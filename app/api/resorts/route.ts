import { supabase } from "@/lib/supabase";

// GET /api/resorts: test route that returns every resort from Supabase.
export async function GET() {
  const { data, error } = await supabase
    .from("resorts")
    .select("*")
    .order("drive_hours");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ resorts: data });
}
