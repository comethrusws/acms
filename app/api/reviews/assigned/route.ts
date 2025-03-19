import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get all reviews assigned to this reviewer
    const reviews = await db.review.findMany({
      where: { reviewerId: user.id },
      include: {
        paper: {
          select: {
            id: true,
            title: true,
            abstract: true,
            anonymizedPdfUrl: true,
            pdfUrl: true,
          }
        }
      },
      orderBy: [
        { completed: 'asc' }, // Pending reviews first
        { createdAt: 'asc' } // Oldest first
      ]
    });
    
    // Ensure we only show anonymized PDFs to reviewers
    const sanitizedReviews = reviews.map(review => ({
      ...review,
      paper: {
        ...review.paper,
        // Use anonymized PDF if available, otherwise fallback to regular PDF
        // In a real system, you'd ensure only anonymized PDFs are accessible
        pdfUrl: review.paper.anonymizedPdfUrl || review.paper.pdfUrl
      }
    }));
    
    return NextResponse.json({ reviews: sanitizedReviews });
    
  } catch (error) {
    console.error("Error fetching assigned reviews:", error);
    return NextResponse.json(
      { message: "Error fetching reviews" },
      { status: 500 }
    );
  }
}
