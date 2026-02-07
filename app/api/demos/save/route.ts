import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    const body = await req.json();
    const { query, isPublic = true } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query data is required" },
        { status: 400 }
      );
    }

    // Create demo with userId if user is authenticated
    const demo = {
      id: crypto.randomUUID(),
      userId: user?.id,
      query: {
        ...query,
        userId: user?.id,
      },
      createdAt: Date.now(),
      isPublic,
    };

    // In a real app, this would save to a database
    // For now, we'll return the demo data for client-side storage
    return NextResponse.json({ 
      success: true, 
      demo,
      message: "Demo saved successfully" 
    });
  } catch (error) {
    console.error("Error saving demo:", error);
    return NextResponse.json(
      { error: "Failed to save demo" },
      { status: 500 }
    );
  }
}
