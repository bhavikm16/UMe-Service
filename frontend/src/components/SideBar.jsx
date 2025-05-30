import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SideBarSkeleton from "./skeletons/SideBarSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SideBar = () => {
  const { getUsers, users, selectedUser, isUserLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const allContacts = users.flatMap(user => user.contacts);
  const uniqueContacts = Array.from(new Map(allContacts.map(contact => [contact._id, contact])).values());

  const filteredContacts = showOnlineOnly
    ? uniqueContacts.filter(contact => onlineUsers.includes(contact._id))
    : uniqueContacts;

    console.log("allContacts", allContacts)
    console.log("unique", uniqueContacts)
  console.log("FILTERED", filteredContacts)
  if (isUserLoading) return <SideBarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-300">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-primary" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 px-1">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <button
              key={contact._id}
              onClick={() => setSelectedUser(contact)}
              className={`group w-full p-3 flex items-center gap-3 rounded-lg transition-all duration-200 hover:bg-base-300 ${
                selectedUser?._id === contact._id ? "bg-base-300 ring-1 ring-primary" : ""
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.fullName}
                  className="size-12 object-cover rounded-full shadow-sm transition-transform group-hover:scale-105"
                />
                {onlineUsers.includes(contact._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{contact.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(contact._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4 animate-fade-in">
            {showOnlineOnly ? "No online contacts" : "No contacts found"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
