import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/auth";

// Configure max file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export async function POST(request: Request) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Convert the file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create unique filename
    const uniqueId = uuidv4();
    const filename = `${uniqueId}-${file.name.replace(/\s+/g, "_")}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "uploads", "papers");
    await mkdir(uploadDir, { recursive: true });

    // Write file to the server
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Generate URL for the uploaded file
    const fileUrl = `/uploads/papers/${filename}`;

    // Return the file URL
    return NextResponse.json({ 
      fileUrl,
      success: true,
      message: "File uploaded successfully" 
    });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}

// Configure to accept large files
export const config = {
  api: {
    bodyParser: false,
  },
};
