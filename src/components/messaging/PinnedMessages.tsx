import React from "react";
import { useChat } from "../../contexts/ChatContext";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Pin, PinOff, X } from "lucide-react";

interface PinnedMessagesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PinnedMessages({
  isOpen,
  onClose,
}: PinnedMessagesProps) {
  const { pinnedMessages, unpinMessage, selectedChatId } = useChat();

  const filteredPinnedMessages = selectedChatId
    ? pinnedMessages.filter((msg) => msg.chatId === selectedChatId)
    : pinnedMessages;

  const formatTime = (date: Date) => {
    return date.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center">
            <Pin className="mr-2 h-5 w-5 text-amber-500" />
            Pinned Messages
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto custom-scrollbar">
          {filteredPinnedMessages.length === 0 ? (
            <div className="text-center py-8">
              <Pin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No pinned messages</p>
              <p className="text-sm text-gray-400 mt-1">
                Pin important messages to find them easily later
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPinnedMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {message.sender}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => unpinMessage(message.id)}
                      className="h-6 w-6 p-0 text-amber-600 hover:text-amber-700"
                    >
                      <PinOff className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-800">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
