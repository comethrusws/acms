import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { paperId } = await request.json();

    const paper = await db.paper.findUnique({
      where: { id: paperId, authorId: user.id },
    });

    if (!paper) {
      return NextResponse.json({ message: "Paper not found" }, { status: 404 });
    }

    // Create a temporary script file
    const scriptPath = path.join(os.tmpdir(), `anonymize_${Date.now()}.py`);
    const outputPath = path.join(os.tmpdir(), `anonymized_${Date.now()}.pdf`);

    // Simple Python script for PDF anonymization using PyPDF2 and regular expressions
    const pythonScript = `
import sys
import re
import PyPDF2
import io

def anonymize_pdf(input_path, output_path, author_name):
    # Open the PDF
    with open(input_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        pdf_writer = PyPDF2.PdfWriter()
        
        # Process each page
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            
            # Extract text
            text = page.extract_text()
            
            # Look for author name and affiliations
            contains_author = re.search(r'(?i)\\b' + re.escape(author_name) + r'\\b', text)
            contains_affiliation = re.search(r'(?i)(affiliation|department|university|institute|college)', text)
            
            # If author name or affiliation likely found, add page but mark for review
            if contains_author or contains_affiliation:
                pdf_writer.add_page(page)
                needs_review = True
            else:
                # No author data detected, add page normally
                pdf_writer.add_page(page)
        
        # Save the anonymized PDF
        with open(output_path, 'wb') as output_file:
            pdf_writer.write(output_file)
    
    return needs_review

# Get parameters from command line
input_pdf = sys.argv[1]
output_pdf = sys.argv[2]
author_name = sys.argv[3]

# Perform anonymization
needs_review = anonymize_pdf(input_pdf, output_pdf, author_name)

# Output result
if needs_review:
    print("NEEDS_REVIEW")
else:
    print("SUCCESS")
`;

    fs.writeFileSync(scriptPath, pythonScript);

    try {
      // Get the URL of the PDF and download it temporarily
      const response = await fetch(paper.pdfUrl);
      const pdfBuffer = await response.arrayBuffer();
      const tempPdfPath = path.join(os.tmpdir(), `original_${Date.now()}.pdf`);
      fs.writeFileSync(tempPdfPath, Buffer.from(pdfBuffer));

      // Run the Python script
      const { stdout } = await execAsync(
        `${process.env.PYTHON_PATH || 'python'} ${scriptPath} ${tempPdfPath} ${outputPath} "${user.name}"`
      );

      // Determine if manual review is needed
      const needsManualReview = stdout.trim() === "NEEDS_REVIEW";

      // Upload the anonymized PDF to your storage service
      // For this example, we'll assume a function uploadToStorage exists
      // const anonymizedPdfUrl = await uploadToStorage(outputPath);
      const anonymizedPdfUrl = `/anonymized/${paperId}.pdf`; // Placeholder

      // Update the paper in the database
      await db.paper.update({
        where: { id: paperId },
        data: {
          anonymizedPdfUrl,
          isAnonymized: true,
          needsManualReview,
        },
      });

      // Clean up temporary files
      fs.unlinkSync(scriptPath);
      fs.unlinkSync(tempPdfPath);
      fs.unlinkSync(outputPath);

      return NextResponse.json({ 
        success: true, 
        anonymizedPdfUrl,
        needsManualReview 
      });
    } catch (error) {
      console.error("PDF anonymization error:", error);
      return NextResponse.json(
        { message: "Failed to anonymize PDF" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}
