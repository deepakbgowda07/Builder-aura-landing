import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Message {
  id: string;
  chatId: string;
  content: string;
  timestamp: Date;
  sender: string;
  isPinned: boolean;
}

export interface Chat {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  avatar: string;
  unreadCount: number;
}

interface ChatContextType {
  chats: Chat[];
  messages: Message[];
  selectedChatId: string | null;
  pinnedMessages: Message[];
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => void;
  pinMessage: (messageId: string) => void;
  unpinMessage: (messageId: string) => void;
  clearMessages: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  getMessagesForChat: (chatId: string) => Message[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Mock initial data
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      name: "Alice Johnson",
      lastMessage: "Hey! How are you doing?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      unreadCount: 2,
    },
    {
      id: "2",
      name: "Bob Smith",
      lastMessage: "Let's meet up this weekend",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      unreadCount: 0,
    },
    {
      id: "3",
      name: "Team Discussion",
      lastMessage: "Great work on the project!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=team",
      unreadCount: 5,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      chatId: "1",
      content: "Hey! How are you doing?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      sender: "Alice Johnson",
      isPinned: false,
    },
    {
      id: "2",
      chatId: "1",
      content: "I'm doing great! Thanks for asking.",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      sender: "You",
      isPinned: true,
    },
    {
      id: "3",
      chatId: "1",
      content: "Would you like to grab coffee this afternoon?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      sender: "Alice Johnson",
      isPinned: false,
    },
    {
      id: "4",
      chatId: "2",
      content: "Let's meet up this weekend",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      sender: "Bob Smith",
      isPinned: false,
    },
    {
      id: "5",
      chatId: "3",
      content: "Great work on the project!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      sender: "Team Lead",
      isPinned: true,
    },
  ]);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const pinnedMessages = messages.filter((message) => message.isPinned);

  const selectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    // Mark messages as read
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
      ),
    );
  };

  const sendMessage = (content: string) => {
    if (!selectedChatId || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: selectedChatId,
      content: content.trim(),
      timestamp: new Date(),
      sender: "You",
      isPinned: false,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Update last message in chat
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              lastMessage: content.trim(),
              lastMessageTime: new Date(),
            }
          : chat,
      ),
    );
  };

  const pinMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, isPinned: true } : message,
      ),
    );
  };

  const unpinMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, isPinned: false } : message,
      ),
    );
  };

  const clearMessages = (chatId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.chatId !== chatId),
    );

    // Update last message in chat
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessage: "", lastMessageTime: undefined }
          : chat,
      ),
    );
  };

  const deleteChat = (chatId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.chatId !== chatId),
    );

    if (selectedChatId === chatId) {
      setSelectedChatId(null);
    }
  };

  const getMessagesForChat = (chatId: string) => {
    return messages
      .filter((message) => message.chatId === chatId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  const value: ChatContextType = {
    chats,
    messages,
    selectedChatId,
    pinnedMessages,
    selectChat,
    sendMessage,
    pinMessage,
    unpinMessage,
    clearMessages,
    deleteChat,
    getMessagesForChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
