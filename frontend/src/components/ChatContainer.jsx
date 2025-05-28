import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const {
    selectedUser,
    isMessagesLoading,
    messages,
    getMessages,
    subscribeToMessages,
    unsubscribeToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeToMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const groupMessagesByDay = (messages) => {
    const grouped = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toISOString().split("T")[0];
      grouped[dateKey] = grouped[dateKey] || [];
      grouped[dateKey].push(msg);
    });
    return grouped;
  };

  const formatDateHeader = (dateStr) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    if (dateStr === today) return "Today";
    if (dateStr === yesterdayStr) return "Yesterday";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: new Date(dateStr).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  if (isMessagesLoading) return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  );

  const groupedMessages = groupMessagesByDay(messages);
  const sortedDates = Object.keys(groupedMessages).sort();

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto px-2">
        {sortedDates.map((date) => (
          <div key={date} className="space-y-4">
            <div className="sticky top-0 z-10 flex justify-center my-2 animate-fade-in">
              <div className="bg-base-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                {formatDateHeader(date)}
              </div>
            </div>

            {groupedMessages[date].map((message) => (
              <div
                key={message._id}
                ref={messageEndRef}
                className={`chat px-4 transition-all ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border shadow-sm">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble bg-primary/10 text-base-content shadow-sm hover:shadow-md">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
