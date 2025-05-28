import React, { useState, useEffect, useRef } from "react";
import { BookHeart } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const Connections = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { requests, getRequests, addFriend, deleteReq } = useAuthStore();
  const { users, getUsers } = useChatStore();

  console.log("Requests: ", requests);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  //need to give the button a purpose;

  const AddContact = async (data) => {
    try {
      await addFriend({ email: data });
      getRequests();
      getUsers();
    } catch (error) {
      console.error("Error adding contact", error.message);
    }
  };
  useEffect(() => {
    getRequests();
    getUsers();
  }, [getRequests, getUsers]);

  console.log("USERS : ", users);

  return (
    <div className="relative" ref={menuRef}>
        <div className="absolute right-0 mt-2 w-64 bg-base-100 shadow-lg rounded-lg p-4 border border-base-300 z-50">
          <h3 className="font-semibold text-base-content mb-2">
            Notifications
          </h3>
          <ul className="space-y-2">
            {requests.some((group) => group.requests.length > 0) ? (
              requests.flatMap((requestGroup, i) =>
                requestGroup.requests.map((notification, j) => (
                  <li
                    key={`${i}-${j}`}
                    className="text-sm p-2 hover:bg-base-200 rounded transition"
                  >
                    Hey, You have a New request from {notification.fullName}
                    {users[0]?.contacts?.some(
                      (user) => user.email === notification.email
                    ) ? (
                      <span className="ml-2 text-green-600 font-semibold">
                        Added
                      </span>
                    ) : (
                      <button
                        onClick={() => AddContact(notification.email)}
                        className="btn btn-primary btn-sm ml-2"
                      >
                        Add
                      </button>
                    )}
                  </li>
                ))
              )
            ) : (
              <li className="text-sm text-base-content/60">
                No new notifications
              </li>
            )}
          </ul>
        </div>

    </div>
  );
};

export default Connections;