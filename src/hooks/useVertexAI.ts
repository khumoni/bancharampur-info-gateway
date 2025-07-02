import { useState } from "react";
import type { VertexMessage } from "@/services/vertexAI";
import { chatWithVertexAI } from "@/services/vertexAI";

export function useVertexAI(language: "bn" | "en", initialSystem?: string) {
  const [messages, setMessages] = useState<VertexMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(prompt: string) {
    setLoading(true);
    setError(null);
    try {
      const reply = await chatWithVertexAI(messages, prompt, language);
      setMessages(prev => [
        ...prev,
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