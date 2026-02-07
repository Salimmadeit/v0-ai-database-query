import { executeQuery, validateQuery } from "@/lib/query-executor";

export async function POST(req: Request) {
  try {
    const { sql } = await req.json();

    if (!sql || typeof sql !== "string") {
      return Response.json(
        { error: "Please provide a SQL query" },
        { status: 400 }
      );
    }

    const validation = validateQuery(sql);
    if (!validation.valid) {
      return Response.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const result = await executeQuery(sql);
    return Response.json({ result });
  } catch (error) {
    console.error("Query execution error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
