import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { paperId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const paperId = params.paperId;
    
    // Find the paper
    const paper = await db.paper.findUnique({
      where: {
        id: paperId,
        ...(user.role !== "ADMIN" && user.role !== "ORGANIZER" ? { authorId: user.id } : {})
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        reviews: {
          select: {
            id: true,
            score: true,
            completed: true,
            ...(user.role === "ADMIN" || user.role === "ORGANIZER" ? { comments: true } : { comments: false })
          }
        }
      }
    });
    
    if (!paper) {
      return NextResponse.json(
        { message: "Paper not found" },
        { status: 404 }
      );
    }
    
    // If user is a reviewer, hide author information by creating a new object
    // instead of trying to delete a property (which causes TypeScript error)
    let responseData;
    if (user.role === "REVIEWER") {
      // Create a new object without the author property
      const { author, ...paperWithoutAuthor } = paper;
      responseData = {
        ...paperWithoutAuthor,
        pdfUrl: paper.anonymizedPdfUrl || paper.pdfUrl
      };
    } else {
      responseData = paper;
    }
    
    return NextResponse.json({ paper: responseData });
    
  } catch (error) {
    console.error("Error fetching paper:", error);
    return NextResponse.json(
      { message: "Error fetching paper" },
      { status: 500 }
    );
  }
}
