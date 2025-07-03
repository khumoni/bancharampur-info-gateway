import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Plus, MoreVertical } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { t } from "@/lib/translations";

const Messages = () => {
  const { language } = useApp();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");

  // Mock data - replace with real data from your backend
  const mockChats = [
    {
      id: "1",
      name: "আহমেদ আলী",
      lastMessage: "আজকের বাজারের দাম কেমন?",
      timestamp: "10:30 AM",
      unread: 2,
      avatar: "/placeholder.svg",
      online: true
    },
    {
      id: "2", 
      name: "ফাতেমা খাতুন",
      lastMessage: "ধন্যবাদ তথ্যের জন্য",
      timestamp: "Yesterday",
      unread: 0,
      avatar: "/placeholder.svg",
      online: false
    },
    {
      id: "3",
      name: "করিম উদ্দিন",
      lastMessage: "কৃষি বিষয়ক প্রশ্ন আছে",
      timestamp: "2 days ago",
      unread: 1,
      avatar: "/placeholder.svg",
      online: true
    }
  ];

  const mockMessages = selectedChat ? [
    {
      id: "1",
      senderId: selectedChat === "1" ? "other" : "me",
      content: "আসসালামু আলাইকুম",
      timestamp: "10:25 AM",
      read: true
    },
    {
      id: "2",
      senderId: "me",
      content: "ওয়ালাইকুম আসসালাম। কেমন আছেন?",
      timestamp: "10:26 AM",
      read: true
    },
    {
      id: "3",
      senderId: selectedChat === "1" ? "other" : "me",
      content: "আলহামদুলিল্লাহ ভালো। আজকের বাজারের দাম কেমন?",
      timestamp: "10:30 AM",
      read: false
    }
  ] : [];

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      // Add message sending logic here
      setMessageInput("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              {language === 'bn' ? "বার্তা" : "Messages"}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Chat List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {language === 'bn' ? "কথোপকথন" : "Conversations"}
                  </CardTitle>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={language === 'bn' ? "বার্তা খুঁজুন..." : "Search messages..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[450px]">
                  {filteredChats.map((chat, index) => (
                    <div key={chat.id}>
                      <div
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedChat === chat.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={chat.avatar} />
                              <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {chat.online && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">{chat.name}</p>
                              <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground truncate">
                                {chat.lastMessage}
                              </p>
                              {chat.unread > 0 && (
                                <Badge className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                                  {chat.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < filteredChats.length - 1 && <Separator />}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={filteredChats.find(c => c.id === selectedChat)?.avatar} />
                          <AvatarFallback>
                            {filteredChats.find(c => c.id === selectedChat)?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {filteredChats.find(c => c.id === selectedChat)?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {filteredChats.find(c => c.id === selectedChat)?.online 
                              ? (language === 'bn' ? "অনলাইন" : "Online")
                              : (language === 'bn' ? "অফলাইন" : "Offline")
                            }
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-[400px] p-4">
                      <div className="space-y-4">
                        {mockMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderId === 'me' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.senderId === 'me'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.senderId === 'me'
                                    ? 'text-primary-foreground/70'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          placeholder={language === 'bn' ? "একটি বার্তা লিখুন..." : "Type a message..."}
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} disabled={!messageInput.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      {language === 'bn' 
                        ? "কথোপকথন শুরু করতে একটি চ্যাট নির্বাচন করুন" 
                        : "Select a conversation to start messaging"
                      }
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;