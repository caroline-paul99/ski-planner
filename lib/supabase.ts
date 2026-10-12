import { createClient } from "@supabase/supabase-js";

// Server-side only: these env vars have no NEXT_PUBLIC_ prefix,
// so they're never sent to the browser.
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
