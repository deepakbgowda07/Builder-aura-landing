import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import ChatList from "../components/messaging/ChatList";
import MessageView from "../components/messaging/MessageView";
import MessageInput from "../components/messaging/MessageInput";
import PinnedMessages from "../components/messaging/PinnedMessages";
import {
  MessageCircle,
  Pin,
  LogOut,
  Settings,
  MoreVertical,
} from "lucide-react";

export default function Chat() {
  const { user, logout } = useAuth();
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Header */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg brand-gradient">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold brand-gradient-text">ChatFlow</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPinnedMessages(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Pin className="h-4 w-4 mr-2" />
            Pinned
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">
                  {user.username}
                </span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Chat Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Sidebar */}
        <div className="w-80 border-r bg-white hidden md:flex flex-col">
          <ChatList />
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col">
          <MessageView />
          <MessageInput />
        </div>
      </div>

      {/* Mobile Chat List - Hidden on desktop */}
      <div className="md:hidden h-full flex flex-col">
        <ChatList />
      </div>

      {/* Pinned Messages Modal */}
      <PinnedMessages
        isOpen={showPinnedMessages}
        onClose={() => setShowPinnedMessages(false)}
      />
    </div>
  );
}
