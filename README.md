# Ski Trip Planner

Ask where to ski on the Ikon pass from NYC. Claude answers using real resort data.

## Try it

1. Open https://ski-planner-vert.vercel.app/
2. Ask a question, e.g.:
   - Which resort is the shortest drive?
   - Which resorts are under 5 hours with unlimited Ikon access?
3. Wait about 10 seconds for the answer.

Notes: one question at a time (no follow-ups). Snow forecasts coming soon.

## Run locally

1. `npm install`
2. Run `supabase/resorts.sql` in the Supabase SQL Editor.
3. Create `.env.local`:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=...
   ANTHROPIC_API_KEY=...
   ```
4. `npm run dev`, then open http://localhost:3000

## Stack

Next.js, Supabase, Claude (Anthropic API), Vercel.
