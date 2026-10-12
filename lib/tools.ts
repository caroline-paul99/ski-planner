import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

// Tool definitions Claude sees. The descriptions and input schemas are how
// Claude decides when to call a tool and what arguments to pass.
export const tools: Anthropic.Tool[] = [
  {
    name: "get_resorts",
    description:
      "Get Ikon pass ski resorts from the database, with drive time from Williamsburg, Brooklyn, " +
      "state, base lodge lat/lon, vertical drop, trail count, and Ikon access (unlimited or limited). " +
      "Use this for any question about which resorts exist or how they compare.",
    input_schema: {
      type: "object",
      properties: {
        max_drive_hours: {
          type: "number",
          description: "Only return resorts within this many hours' drive.",
        },
        ikon_access: {
          type: "string",
          enum: ["unlimited", "limited"],
          description: "Only return resorts with this Ikon access level.",
        },
      },
    },
  },
];

type GetResortsInput = { max_drive_hours?: number; ikon_access?: string };

async function getResorts(input: GetResortsInput) {
  let query = supabase.from("resorts").select("*").order("drive_hours");

  if (input.max_drive_hours !== undefined) {
    query = query.lte("drive_hours", input.max_drive_hours);
  }
  if (input.ikon_access !== undefined) {
    query = query.eq("ikon_access", input.ikon_access);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

// Runs the tool Claude asked for and returns the result as a string.
export async function runTool(name: string, input: unknown): Promise<string> {
  switch (name) {
    case "get_resorts":
      return JSON.stringify(await getResorts(input as GetResortsInput));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
