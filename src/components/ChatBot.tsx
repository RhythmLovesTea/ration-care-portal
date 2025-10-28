import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "bot", content: "Hello! How can I assist you today? मैं आपकी कैसे मदद कर सकता हूं?" },
  ]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to connect to chatbot. Please try again later.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "I'm having trouble connecting right now. Please try again later." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          variant="hero"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] shadow-elevated z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary rounded-t-lg">
            <div>
              <h3 className="font-semibold text-primary-foreground">AI Assistant</h3>
              <p className="text-xs text-primary-foreground/80">Ask me anything</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/10"
            >
              <X className="h-5 w-5 text-primary-foreground" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon" variant="default">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
