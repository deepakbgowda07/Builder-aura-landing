import React, { useEffect, useRef } from "react";
import { useChat } from "../../contexts/ChatContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, Pin, PinOff, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";

export default function MessageView() {
  const {
    selectedChatId,
    getMessagesForChat,
    pinMessage,
    unpinMessage,
    clearMessages,
    chats,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  const messages = selectedChatId ? getMessagesForChat(selectedChatId) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handlePinToggle = (messageId: string, isPinned: boolean) => {
    if (isPinned) {
      unpinMessage(messageId);
    } else {
      pinMessage(messageId);
    }
  };

  const handleClearMessages = () => {
    if (selectedChatId) {
      clearMessages(selectedChatId);
    }
  };

  if (!selectedChatId || !selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-100 flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a chat
          </h3>
          <p className="text-gray-600">
            Choose a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
            <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleClearMessages}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear messages
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex group animate-fade-in",
                message.sender === "You" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative",
                  message.sender === "You"
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-900",
                  message.isPinned && "ring-2 ring-amber-400",
                )}
              >
                {message.isPinned && (
                  <div className="absolute -top-1 -right-1">
                    <Pin className="h-4 w-4 text-amber-500 fill-current" />
                  </div>
                )}

                <p className="text-sm">{message.content}</p>
                <div
                  className={cn(
                    "flex items-center justify-between mt-1",
                    message.sender === "You"
                      ? "text-blue-100"
                      : "text-gray-500",
                  )}
                >
                  <span className="text-xs">
                    {formatTime(message.timestamp)}
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2",
                          message.sender === "You"
                            ? "hover:bg-blue-600 text-blue-100"
                            : "hover:bg-gray-200",
                        )}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handlePinToggle(message.id, message.isPinned)
                        }
                      >
                        {message.isPinned ? (
                          <>
                            <PinOff className="mr-2 h-4 w-4" />
                            Unpin message
                          </>
                        ) : (
                          <>
                            <Pin className="mr-2 h-4 w-4" />
                            Pin message
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
