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
  console.log("AuthUSer: ", authUser);
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeToMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeToMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to group messages by day
  const groupMessagesByDay = (messages) => {
    const grouped = {};

    messages.forEach((message) => {
      const date = new Date(message.createdAt);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(message);
    });

    return grouped;
  };

  // Function to format date header
  const formatDateHeader = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    const todayStr = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (dateStr === todayStr) {
      return "Today";
    } else if (dateStr === yesterdayStr) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
      // Example: "Mar 4" or "Mar 4, 2023" if different year
    }
  };

  if (isMessagesLoading)
    return (
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

      <div className="flex-1 overflow-y-auto">
        {sortedDates.map((date) => (
          <div key={date} className="space-y-4">
            <div className="sticky top-0 z-10 flex justify-center my-2">
              <div className="bg-base-200 px-3 py-1 rounded-full text-sm font-medium">
                {formatDateHeader(date)}
              </div>
            </div>

            {groupedMessages[date].map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                } px-4`}
                ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
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
                <div className="chat-bubble flex flex-col">
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
