# Ski Trip Planner

A small AI agent that helps me and my friends in NYC decide where to ski on the Ikon pass. It's a weekend project to get hands-on with the Next.js + Vercel + Supabase + Anthropic SDK stack, and I'll be walking through it in an interview, so I need to understand every piece of it.

## How to work with me

- Go one step at a time. Finish and test a step before starting the next.
- Briefly explain what you changed and why, especially anything about how the frameworks connect. I need to be able to explain it myself.
- Keep it simple. Prefer plain, readable code over abstractions or extra libraries.
- Don't add anything listed under "Out of scope" unless I ask.
- Suggest a clear commit message when a step is done.

## Stack

- **Next.js** (App Router, TypeScript): one page with a chat box, API routes under `app/api/`
- **Supabase**: Postgres table of resorts, read with `@supabase/supabase-js`
- **Anthropic SDK** (`@anthropic-ai/sdk`): Claude with tool use, model `claude-sonnet-5-5`
- **Vercel**: deployed from GitHub, auto-deploys on push to `main`
- **Open-Meteo**: free weather API (no key) for snowfall forecasts

## Secrets and keys

- All keys live in `.env.local` (gitignored) locally and in Vercel environment variables in production.
- Env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`
- Supabase and Anthropic calls happen only in server-side API routes, never in client components. Don't use `NEXT_PUBLIC_` for any of these.
- Never hardcode a key or print one in logs.

## Data

Supabase table `resorts`:

| column | type | notes |
|---|---|---|
| id | serial | primary key |
| name | text | |
| state | text | |
| drive_hours | numeric | from Williamsburg, Brooklyn |
| lat, lon | numeric | base lodge coordinates, used for forecasts |
| vertical_ft | int | |
| trails | int | |
| ikon_access | text | 'unlimited' or 'limited' |

Row level security is on, with a public read-only policy.

## The agent

`POST /api/chat` takes `{ message }` and returns `{ reply }`. Claude gets a system prompt about helping NYC friends plan Ikon ski weekends, plus two tools:

1. `get_resorts`: returns resorts from Supabase (optionally filtered, e.g. max drive time)
2. `get_snow_forecast`: takes lat/lon, calls Open-Meteo, returns recent and upcoming snowfall

The route runs the tool-use loop: call Claude, run any tools it requests, send results back, repeat until Claude gives a final text answer. Claude writes the trip recommendation itself; there's no separate trip-planning tool.

The test question: "Where should we ski this weekend?" should produce an answer based on real forecasts and drive times.

## Evals

A small script (`evals/run.ts`) with 5 or 6 questions that have known correct answers (e.g. "Which resort is the shortest drive?"). It calls the agent, checks each answer, and prints a score. Run locally.

## Out of scope

Streaming, user accounts, saved trips, flights, a cron digest, styling beyond basic readability. These go in the README as "what I'd do next."

## Plan

**Sunday**
1. Next.js app created, pushed to GitHub
2. Deployed to Vercel (live URL)
3. Supabase table created and filled; `/api/resorts` test route returns the data
4. `/api/chat` returns a Claude reply (no tools yet) and the page shows it
5. Env vars set in Vercel; chat works on the live site

**Monday**
1. Add `get_resorts` tool, test
2. Add `get_snow_forecast` tool, test
3. "Where should we ski this weekend?" works on the live site with real forecasts
4. Eval script written and run; fix failures
5. README: what I built, how it works, what broke, what I'd do next

## Status

Update this section as steps get done.

- [x] Sunday 1: Next.js app created, pushed to https://github.com/caroline-paul99/ski-planner
- [x] Sunday 2: Deployed to Vercel at https://ski-planner-vert.vercel.app/ (auto-deploys on push to `main`)
- [x] Sunday 3: Supabase `resorts` table created (schema in `supabase/resorts.sql`), `/api/resorts` returns 10 resorts locally
- [x] Sunday 3 (live): `/api/resorts` works on Vercel with Supabase env vars set
- [x] Sunday 4: `/api/chat` returns a Claude reply (no tools yet) and the page shows it (tested locally)
- [x] Sunday 5: Env vars set in Vercel; chat works on https://ski-planner-vert.vercel.app/
- [x] Monday 1: `get_resorts` tool (in `lib/tools.ts`) and tool-use loop in `/api/chat` (tested locally)
- [ ] Monday 2