"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setReply("");

    // The browser only talks to our own API route; the route talks to Claude.
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    setReply(data.reply ?? data.error);
    setLoading(false);
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Ski Trip Planner</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Where should we ski this weekend?"
        />
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={loading || message.trim() === ""}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {reply && <p className="mt-6 whitespace-pre-wrap">{reply}</p>}
    </main>
  );
}
