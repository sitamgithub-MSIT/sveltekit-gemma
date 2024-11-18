import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: env.GROQ_API_KEY ?? "",
});

/**
 * Handles POST requests to the chat API endpoint.
 *
 * This function processes incoming chat messages, applies a system prompt
 * to ensure responses are in the style of a pirate, and streams the
 * generated text back to the client.
 */
export const POST = (async ({ request }) => {
  const { messages } = await request.json();

  const systemPrompt = {
    role: "system",
    content:
      "You are a friendly chatbot who always responds in the style of a pirate.",
  };

  const result = await streamText({
    model: groq("gemma2-9b-it"),
    messages: convertToCoreMessages([systemPrompt, ...messages]),
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;
