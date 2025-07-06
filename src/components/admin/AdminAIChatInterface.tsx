import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles, MessageCircle } from "lucide-react";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AdminAIChatInterfaceProps {
  chatMessages: ChatMessage[];
  inputMessage: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const AdminAIChatInterface = ({
  chatMessages,
  inputMessage,
  isLoading,
  onInputChange,
  onSendMessage,
  onKeyPress
}: AdminAIChatInterfaceProps) => {
  const exampleCommands = [
    "Post ID 123 মুছে দাও",
    "john@example.com ব্যবহারকারীকে ব্লক করো",
    "সব pending shops approve করো",
    "ব্রাহ্মণবাড়িয়ার top 3 shops highlight করো"
  ];

  return (
    <Card className="h-[600px] flex flex-col shadow-lg border-0 glass-morphism animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="relative">
            <Bot className="h-6 w-6 text-primary animate-pulse" />
            <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI Assistant
            </span>
            <p className="text-sm font-normal text-muted-foreground mt-1">
              স্বাভাবিক ভাষায় commands দিয়ে আপনার platform manage করুন
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-6">
        <ScrollArea className="flex-1 pr-4 mb-6">
          <div className="space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="relative mb-6">
                  <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/30" />
                  <Bot className="h-8 w-8 absolute top-2 left-1/2 transform -translate-x-1/2 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  AI Assistant প্রস্তুত
                </h3>
                <p className="text-muted-foreground mb-6">
                  এই commands গুলো try করে দেখুন:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                  {exampleCommands.map((command, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="p-3 text-xs hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => onInputChange(command)}
                    >
                      {command}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex animate-slide-up ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 backdrop-blur-sm border'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString('bn-BD', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-muted/50 backdrop-blur-sm border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">Processing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-3">
          <Input
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="আপনার command লিখুন..."
            disabled={isLoading}
            className="flex-1 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary transition-colors"
          />
          <Button 
            onClick={onSendMessage} 
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};