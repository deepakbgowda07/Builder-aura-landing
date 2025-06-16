import React, { useState } from "react";
import { useChat } from "../../contexts/ChatContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send } from "lucide-react";

export default function MessageInput() {
  const { selectedChatId, sendMessage } = useChat();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedChatId) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!selectedChatId) {
    return null;
  }

  return (
    <div className="p-4 border-t bg-white">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 h-10"
        />
        <Button
          type="submit"
          size="sm"
          className="h-10 w-10 p-0 brand-gradient hover:opacity-90 transition-opacity"
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
