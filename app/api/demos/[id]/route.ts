import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // In a real app, this would fetch from a database
    // For now, we'll return a placeholder response
    // The client will handle loading from localStorage
    
    return NextResponse.json({
      success: true,
      message: "Use client-side storage to load demo",
      demoId: id,
    });
  } catch (error) {
    console.error("Error fetching demo:", error);
    return NextResponse.json(
      { error: "Failed to fetch demo" },
      { status: 500 }
    );
  }
}
