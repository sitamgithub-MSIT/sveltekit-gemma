import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";

const model = createOpenAI({
  baseURL: "https://api-inference.huggingface.co/v1/", // Use other inference providers as well
  apiKey: env.INFERENCE_API_KEY ?? "",
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
    content: "You are a pirate chatbot who always responds in pirate speak!",
  };

  const result = await streamText({
    model: model("meta-llama/Llama-3.3-70B-Instruct"),
    messages: convertToCoreMessages([systemPrompt, ...messages]),
    maxTokens: 500,
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;
