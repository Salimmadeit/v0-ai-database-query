import { getSchema } from "@/lib/demo-database";

export async function GET() {
  try {
    const schema = await getSchema();
    return Response.json(schema);
  } catch (error) {
    console.error("Schema fetch error:", error);
    return Response.json(
      { error: "Failed to fetch schema" },
      { status: 500 }
    );
  }
}
