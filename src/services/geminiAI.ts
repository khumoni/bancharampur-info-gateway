
/**
 * Service for interacting with Google Vertex AI Gemini Pro API (REST)
 * Uses the Gemini Pro (or Flash) model for text chat.
 * For streaming, uses fetch with ReadableStream if available.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

export type GeminiMessage = { role: "user" | "model", parts: { text: string }[] };

export async function chatWithGemini(
  history: GeminiMessage[],
  prompt: string,
  onStreamChunk?: (chunk: string) => void,
): Promise<string> {
  // Prepare messages array including new prompt
  const allMessages = [
    ...history,
    { role: "user", parts: [{ text: prompt }] },
  ];
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: allMessages.map(m => ({
        role: m.role,
        parts: m.parts,
      })),
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
      // Disable safety settings and blocklists for easier demo in dev
    }),
  });

  if (!res.ok) throw new Error("Gemini API error");

  const data = await res.json();
  // Non-streaming for now, first candidate's text
  const geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (onStreamChunk) onStreamChunk(geminiReply);
  return geminiReply;
}
