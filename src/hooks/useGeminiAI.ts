import { useState } from "react";
import type { GeminiMessage } from "@/services/geminiAI";
import { chatWithGemini } from "@/services/geminiAI";

export function useGeminiAI(language: "bn" | "en", initialSystem?: string) {
  const [messages, setMessages] = useState<GeminiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Typical system message for context
  const systemPrompt =
    language === "bn"
      ? "আপনি একজন স্থানীয় তথ্য সহকারী, ব্যবহারকারীর লোকাল (বাঞ্ছারামপুর) তথ্যের প্রশ্নের উত্তর বাংলায় দিন।"
      : "You are a local information assistant, answer questions about Bancharampur community and local context in English.";

  async function sendMessage(prompt: string) {
    setLoading(true);
    setError(null);
    try {
      // Always keep a guiding system message as first user input
      const systemMsg: GeminiMessage = {
        role: "user",
        parts: [{ text: initialSystem ?? systemPrompt }],
      };
      const convHistory =
        messages.length === 0 ? [systemMsg] : [...messages];
      const reply = await chatWithGemini(convHistory, prompt);
      setMessages([
        ...convHistory,
        { role: "user", parts: [{ text: prompt }] },
        { role: "model", parts: [{ text: reply }] },
      ]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  function reset() {
    setMessages([]);
    setError(null);
  }

  return { messages, loading, error, sendMessage, reset };
}
