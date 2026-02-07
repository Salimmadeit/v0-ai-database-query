import { generateText, Output } from "ai";
import { z } from "zod";
import { getSchemaDescription } from "@/lib/demo-database";
import { executeQuery } from "@/lib/query-executor";
import { validateQuery } from "@/lib/query-validator";

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

// Retry helper with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (400s)
      if (error instanceof Error && 'statusCode' in error) {
        const statusCode = (error as any).statusCode;
        if (statusCode >= 400 && statusCode < 500) {
          throw error;
        }
      }
      
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`[v0] Retry attempt ${attempt + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

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

    console.log("[v0] Generating SQL for question:", question);

    const { output } = await retryWithBackoff(async () => {
      return await generateText({
        model: "anthropic/claude-sonnet-4-20250514",
        output: Output.object({ schema: sqlResultSchema }),
        maxOutputTokens: 1000,
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
    });

    if (!output) {
      console.error("[v0] No output received from AI");
      return Response.json(
        { error: "Failed to generate SQL query. Please try again." },
        { status: 500 }
      );
    }

    console.log("[v0] Generated SQL:", output.sql);

    // Validate the generated SQL
    const validation = validateQuery(output.sql);
    if (!validation.valid) {
      console.error("[v0] Query validation failed:", validation.error);
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
    console.log("[v0] Executing validated query");
    const queryResult = await executeQuery(output.sql);
    console.log("[v0] Query executed successfully, rows:", queryResult.rowCount);

    return Response.json({
      sql: output.sql,
      explanation: output.explanation,
      tablesUsed: output.tablesUsed,
      estimatedRows: output.estimatedRows,
      result: queryResult,
    });
  } catch (error) {
    console.error("[v0] Query generation error:", error);
    
    // Provide more specific error messages
    let errorMessage = "An unexpected error occurred. Please try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("timeout") || error.message.includes("Timeout")) {
        errorMessage = "The AI service is taking too long to respond. Please try a simpler question or try again in a moment.";
      } else if (error.message.includes("Gateway")) {
        errorMessage = "Unable to connect to AI service. Please check your connection and try again.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
