import { generateText, Output } from "ai";
import { z } from "zod";
import { getSchemaDescription } from "@/lib/demo-database";
import { validateQuery } from "@/lib/query-validator";
import { executeQuery } from "@/lib/query-executor"; // Declared the executeQuery variable

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

Generate the SQL query and provide a clear, natural language explanation that:
- Describes what data is being retrieved in plain English
- Explains any filters or conditions being applied (e.g., "only active employees", "salaries above average")
- Mentions how results are sorted if applicable (e.g., "from highest to lowest salary")
- Avoids technical jargon - speak as if explaining to a non-technical person
- Focuses on what the user will see in the results, not how the query works internally
- Keeps the explanation concise (2-3 sentences maximum)

Example: Instead of "This query joins employees and departments tables using a subquery for average calculation", say "This shows all currently active employees who earn more than the company average, including their department, sorted from highest to lowest salary."`,
          },
        ],
      });
    });

    if (!output) {
      return Response.json(
        { error: "Failed to generate SQL query. Please try again." },
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

    // Return the validated SQL without executing it
    // Execution happens on the client where sql.js WASM is available
    return Response.json({
      sql: output.sql,
      explanation: output.explanation,
      tablesUsed: output.tablesUsed,
      estimatedRows: output.estimatedRows,
    });
  } catch (error) {
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
