import { generateText, Output } from "ai";
import { z } from "zod";
import { getSchemaDescription } from "@/lib/demo-database";
import { executeQuery, validateQuery } from "@/lib/query-executor";

const sqlResultSchema = z.object({
  sql: z.string().describe("The generated SQL query"),
  explanation: z
    .string()
    .describe("Plain language explanation of what the query does"),
  tablesUsed: z.array(z.string()).describe("List of table names used in the query"),
  estimatedRows: z
    .string()
    .describe("Estimated number of rows that will be returned"),
});

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return Response.json(
        { error: "Please provide a question" },
        { status: 400 }
      );
    }

    const schemaDescription = getSchemaDescription();

    const { output } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      output: Output.object({ schema: sqlResultSchema }),
      messages: [
        {
          role: "user",
          content: `You are an expert SQL assistant. Given the following database schema and a natural language question, generate a valid SQLite SELECT query.

${schemaDescription}

RULES:
- Only generate SELECT statements. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, or any other modifying statement.
- Use proper SQLite syntax.
- Use appropriate JOINs when querying across tables.
- Use meaningful aliases for readability.
- Limit results to 100 rows max unless the user specifically asks for more.
- For aggregations, always include relevant GROUP BY clauses.
- Use ORDER BY for meaningful sorting when appropriate.
- Format numbers and dates nicely where possible.

User question: ${question}

Generate the SQL query and explain what it does in simple terms.`,
        },
      ],
    });

    if (!output) {
      return Response.json(
        { error: "Failed to generate SQL query" },
        { status: 500 }
      );
    }

    // Validate the generated SQL
    const validation = validateQuery(output.sql);
    if (!validation.valid) {
      return Response.json(
        {
          error: `Generated unsafe query: ${validation.error}`,
          sql: output.sql,
          explanation: output.explanation,
        },
        { status: 400 }
      );
    }

    // Execute the query
    const queryResult = await executeQuery(output.sql);

    return Response.json({
      sql: output.sql,
      explanation: output.explanation,
      tablesUsed: output.tablesUsed,
      estimatedRows: output.estimatedRows,
      result: queryResult,
    });
  } catch (error) {
    console.error("Query generation error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
