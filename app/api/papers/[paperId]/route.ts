import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PaperStatus } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

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
            reviewerId: true,
            score: true,
            completed: true,
            comments: user.role === "ADMIN" || user.role === "ORGANIZER"
          },
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
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
    
    return NextResponse.json({ paper });
    
  } catch (error) {
    console.error("Error fetching paper:", error);
    return NextResponse.json(
      { message: "Error fetching paper" },
      { status: 500 }
    );
  }
}

// PATCH request to update a paper's status
export async function PATCH(
  request: Request,
  { params }: { params: { paperId: string } }
) {
  try {
    // Check admin authentication using cookie
    const cookieHeader = request.headers.get('cookie');
    const cookies = cookieHeader?.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>) || {};
    
    const isAdmin = cookies['admin_session'] === 'true';
    
    if (!isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { paperId } = params;
    const data = await request.json();
    
    // Validate input
    if (!data.status || !Object.values(PaperStatus).includes(data.status)) {
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update paper in database
    const updatedPaper = await db.paper.update({
      where: { id: paperId },
      data: { 
        status: data.status,
        updatedAt: new Date()
      },
      include: {
        author: true
      }
    });

    // Return the updated paper
    return NextResponse.json({
      message: 'Paper status updated successfully',
      paper: updatedPaper
    });
  } catch (error) {
    console.error('Error updating paper status:', error);
    return NextResponse.json(
      { message: 'Failed to update paper status' },
      { status: 500 }
    );
  }
}
