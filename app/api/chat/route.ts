import Anthropic from "@anthropic-ai/sdk";
import { tools, runTool } from "@/lib/tools";

// Reads ANTHROPIC_API_KEY from the environment automatically.
const anthropic = new Anthropic();

const SYSTEM_PROMPT =
  "You help a group of friends in Williamsburg, Brooklyn decide where to ski on the Ikon pass. " +
  "Use the get_resorts tool for resort facts like drive times and Ikon access, and only recommend " +
  "resorts it returns. Give short, practical recommendations.";

// Safety limit so a confused loop can't run up the API bill.
const MAX_TURNS = 10;

// POST /api/chat: takes { message }, returns { reply }.
export async function POST(request: Request) {
  const { message } = await request.json();

  if (typeof message !== "string" || message.trim() === "") {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  // The conversation so far. Each loop adds Claude's turn and our tool results.
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: message }];

  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-5-5",
        max_tokens: 16000,
        output_config: { effort: "medium" },
        system: SYSTEM_PROMPT,
        tools,
        messages,
      });

      if (response.stop_reason === "refusal") {
        return Response.json({ reply: "Sorry, I can't help with that one." });
      }

      // No tool requested: this is Claude's final answer.
      if (response.stop_reason !== "tool_use") {
        const reply = response.content
          .filter((block) => block.type === "text")
          .map((block) => block.text)
          .join("\n");
        return Response.json({ reply });
      }

      // Claude asked for one or more tools. Keep its full turn in the history,
      // run each tool, and send all the results back in one user message.
      messages.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        console.log("Tool call:", block.name, JSON.stringify(block.input));
        try {
          const result = await runTool(block.name, block.input);
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
        } catch (error) {
          // Tell Claude the tool failed instead of crashing, so it can recover.
          const text = error instanceof Error ? error.message : "Tool failed";
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: text, is_error: true });
        }
      }
      messages.push({ role: "user", content: toolResults });
    }

    return Response.json({ reply: "Sorry, that took too many steps. Try a simpler question." });
  } catch (error) {
    console.error("Claude API error:", error instanceof Error ? error.message : error);
    return Response.json({ error: "Something went wrong talking to Claude" }, { status: 500 });
  }
}
