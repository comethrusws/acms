import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { title, abstract, keywords, pdfUrl } = body;
    
    if (!title || !abstract || !pdfUrl) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Set user role to AUTHOR if not already
    if (user.role !== "ADMIN" && user.role !== "ORGANIZER" && user.role !== "AUTHOR") {
      await db.user.update({
        where: { id: user.id },
        data: { role: "AUTHOR" }
      });
    }
    
    // Create the paper
    const paper = await db.paper.create({
      data: {
        title,
        abstract,
        keywords,
        pdfUrl,
        authorId: user.id,
      }
    });
    
    return NextResponse.json({
      message: "Paper submitted successfully",
      paper
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating paper:", error);
    return NextResponse.json(
      { message: "Error creating paper" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Different behavior based on user role
    let papers;
    
    if (user.role === "ADMIN" || user.role === "ORGANIZER") {
      // Admins and organizers can see all papers
      papers = await db.paper.findMany({
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
              completed: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (user.role === "REVIEWER") {
      // Reviewers can only see papers assigned to them (anonymized)
      const reviews = await db.review.findMany({
        where: { reviewerId: user.id },
        include: {
          paper: true
        }
      });
      
      papers = reviews.map(review => ({
        ...review.paper,
        pdfUrl: review.paper.anonymizedPdfUrl || review.paper.pdfUrl,
        author: null // Hide author information for reviewers
      }));
    } else {
      // Authors can only see their own papers
      papers = await db.paper.findMany({
        where: { authorId: user.id },
        include: {
          reviews: {
            select: {
              id: true,
              score: true,
              completed: true,
              comments: false // Hide reviewer comments until decision is made
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }
    
    return NextResponse.json({ papers });
    
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { message: "Error fetching papers" },
      { status: 500 }
    );
  }
}
