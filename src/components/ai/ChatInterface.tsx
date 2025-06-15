
import React, { useRef, useState } from "react";
import { useGeminiAI } from "@/hooks/useGeminiAI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ChatInterfaceProps {
  language: "bn" | "en";
  onClose?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ language, onClose }) => {
  const { messages, loading, error, sendMessage, reset } = useGeminiAI(language);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-xl w-full max-w-sm animate-fade-in flex flex-col">
      <div className="flex items-center justify-between p-3 border-b rounded-t-xl bg-gradient-to-r from-blue-200 to-emerald-100">
        <div className="font-bold text-blue-700">
          {language === "bn"
            ? "AI সহায়ক (বাঞ্ছারামপুর তথ্য)"
            : "AI Assistant (Local Info)"}
        </div>
        <button className="p-1 text-gray-500" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-3 flex-1 overflow-y-auto" style={{ minHeight: 180, maxHeight: 340 }}>
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm my-6">
            {language === "bn"
              ? "প্রশ্ন লিখুন বা জিজ্ঞাসা করুন (যেমন, স্থানীয় হাসপাতাল কোথায়?)"
              : "Ask a question about Bancharampur local info (e.g., 'Where is the hospital?')"}
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-sm max-w-[93%] ${
                  msg.role === "user"
                    ? "bg-blue-200 text-right ml-auto"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.parts[0]?.text}
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className="text-blue-600 animate-pulse mt-2">
            {language === "bn" ? "লোড হচ্ছে..." : "Loading..."}
          </div>
        )}
        {error && (
          <div className="text-red-500 mt-2 text-xs">
            {language === "bn" ? "ত্রুটি: " : "Error: "}
            {error}
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="flex p-2 border-t gap-2 bg-white rounded-b-xl">
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={
            language === "bn"
              ? "প্রশ্ন লিখুন..."
              : "Type your question..."
          }
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          {language === "bn" ? "পাঠান" : "Send"}
        </Button>
        <Button type="button" variant="ghost" onClick={reset}>
          {language === "bn" ? "রিসেট" : "Reset"}
        </Button>
      </form>
    </div>
  );
};
