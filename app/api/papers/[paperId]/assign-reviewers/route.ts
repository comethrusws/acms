// @ts-nocheck
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

// Using proper Next.js type for route handlers
export async function POST(
  request: Request,
  context: { params: { paperId: string } }
) {
  try {
    // Check admin authentication using cookie
    const cookieStore = cookies();
    const adminSession = cookieStore.get("admin_session");
    const isAdmin = adminSession?.value === "true";
    
    if (!isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { paperId } = context.params;
    const { reviewerIds } = await request.json();

    if (!Array.isArray(reviewerIds) || reviewerIds.length === 0) {
      return NextResponse.json(
        { message: 'Please provide at least one reviewer ID' },
        { status: 400 }
      );
    }

    // Get the paper to ensure it exists and check its current status
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
        { message: 'Paper not found' },
        { status: 404 }
      );
    }

    // If paper isn't in UNDER_REVIEW status, update it
    let statusUpdateNeeded = false;
    if (paper.status !== 'UNDER_REVIEW') {
      statusUpdateNeeded = true;
    }

    // Get existing reviewers to avoid duplicates
    const existingReviewerIds = paper.reviews.map(review => review.reviewerId);
    
    // Filter out reviewers who are already assigned
    const newReviewerIds = reviewerIds.filter(id => !existingReviewerIds.includes(id));
    
    if (newReviewerIds.length === 0) {
      return NextResponse.json(
        { message: 'All selected reviewers are already assigned to this paper' },
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

    // If paper is not in UNDER_REVIEW status, update it
    if (statusUpdateNeeded) {
      await db.paper.update({
        where: { id: paperId },
        data: { 
          status: 'UNDER_REVIEW',
          updatedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      message: 'Reviewers assigned successfully',
      assignedReviewers: reviewAssignments.length,
      statusUpdated: statusUpdateNeeded
    });
  } catch (error) {
    console.error('Error assigning reviewers:', error);
    return NextResponse.json(
      { message: 'Failed to assign reviewers' },
      { status: 500 }
    );
  }
}
