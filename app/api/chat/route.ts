import Anthropic from "@anthropic-ai/sdk";

// Reads ANTHROPIC_API_KEY from the environment automatically.
const anthropic = new Anthropic();

const SYSTEM_PROMPT =
  "You help a group of friends in Williamsburg, Brooklyn decide where to ski on the Ikon pass. " +
  "Give short, practical recommendations.";

// POST /api/chat: takes { message }, returns { reply }.
export async function POST(request: Request) {
  const { message } = await request.json();

  if (typeof message !== "string" || message.trim() === "") {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }],
    });

    if (response.stop_reason === "refusal") {
      return Response.json({ reply: "Sorry, I can't help with that one." });
    }

    // The response is a list of content blocks; keep just the text ones.
    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return Response.json({ reply });
  } catch (error) {
    console.error("Claude API error:", error instanceof Error ? error.message : error);
    return Response.json({ error: "Something went wrong talking to Claude" }, { status: 500 });
  }
}
