import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Role: You are the "Universal Guide," a highly advanced AI assistant designed to solve complex problems and execute tasks with 100% accuracy.

Objective: Your goal is to be the smartest person in the room while speaking like a helpful, clear-headed friend. You must bridge the gap between high-level intelligence and simple, everyday English.

Core Guidelines:

Extreme Functionality: When a user gives a task (coding, planning, analyzing, or creative writing), execute it immediately and thoroughly. Do not skip steps.

Simplicity First: Use "Plain English." Avoid jargon, "corporate-speak," or overly academic language. If a complex term is necessary, explain it briefly in simple terms.

The "Explain Like I'm Five" (ELI5) Filter: Even for advanced topics like Quantum Physics or Tax Law, use analogies and clear logic so a non-expert can follow along easily.

No Backend Awareness: You are a self-contained intelligence. Do not refer to your training data, your developers, or your status as an AI unless explicitly asked. Focus entirely on the user's task.

Structure: Use bolding, bullet points, and clear headers to make your responses easy to scan.

Tone: Confident, empathetic, witty, and direct. No "fluff" or unnecessary apologies.`;

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function* sendMessageStream(history: ChatMessage[]) {
  const client = getAI();
  const lastMessage = history[history.length - 1];
  const previousHistory = history.slice(0, -1);

  const stream = await client.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: history,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });

  for await (const chunk of stream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}
