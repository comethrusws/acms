import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
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
    
    // Only admins and organizers can assign reviewers
    if (user.role !== "ADMIN" && user.role !== "ORGANIZER") {
      return NextResponse.json(
        { message: "Permission denied" },
        { status: 403 }
      );
    }
    
    const paperId = params.paperId;
    const { reviewerIds } = await req.json();
    
    if (!Array.isArray(reviewerIds) || reviewerIds.length === 0) {
      return NextResponse.json(
        { message: "Please provide at least one reviewer ID" },
        { status: 400 }
      );
    }
    
    // Get the paper to ensure it exists
    const paper = await db.paper.findUnique({
      where: { id: paperId },
      include: {
        reviews: {
          select: {
            reviewerId: true
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
    
    // Get existing reviewers to avoid duplicates
    const existingReviewerIds = paper.reviews.map(review => review.reviewerId);
    
    // Filter out reviewers who are already assigned
    const newReviewerIds = reviewerIds.filter(id => !existingReviewerIds.includes(id));
    
    if (newReviewerIds.length === 0) {
      return NextResponse.json(
        { message: "All selected reviewers are already assigned to this paper" },
        { status: 400 }
      );
    }
    
    // Create review assignments for new reviewers
    const reviewAssignments = await Promise.all(
      newReviewerIds.map(reviewerId => 
        db.review.create({
          data: {
            paperId,
            reviewerId,
            completed: false,
          }
        })
      )
    );
    
    // If paper is still in SUBMITTED status, update it to UNDER_REVIEW
    if (paper.status === "SUBMITTED") {
      await db.paper.update({
        where: { id: paperId },
        data: { status: "UNDER_REVIEW" }
      });
    }
    
    // TODO: Send email notifications to newly assigned reviewers
    
    return NextResponse.json({
      message: "Reviewers assigned successfully",
      assignedReviewers: reviewAssignments.length
    });
    
  } catch (error) {
    console.error("Error assigning reviewers:", error);
    return NextResponse.json(
      { message: "Error assigning reviewers" },
      { status: 500 }
    );
  }
}
