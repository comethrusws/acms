import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }
    
    // Check if it's a PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files are allowed" },
        { status: 400 }
      );
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const timestamp = Date.now();
    const filename = `paper_${user.id}_${timestamp}.pdf`;
    
    // For a real application, you would upload to a cloud storage service
    // For this example, we'll save to the public directory
    const uploadsDir = join(process.cwd(), "public/uploads");
    const filepath = join(uploadsDir, filename);
    
    await writeFile(filepath, buffer);
    
    // URL to access the file
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      message: "File uploaded successfully",
      fileUrl 
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Error uploading file" },
      { status: 500 }
    );
  }
}
