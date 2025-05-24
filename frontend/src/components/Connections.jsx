import React, { useState, useEffect, useRef } from "react";
import { EarthLock } from "lucide-react";

const Connections = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const requests = [
    "You have a new message.",
    "Your account settings were updated.",
    "Reminder: Meeting at 3 PM.",
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button className="btn btn-sm gap-2" onClick={toggleDropdown}>
        <EarthLock className="size-5" />
        <span className="hidden sm:inline">Connections</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-base-100 shadow-lg rounded-lg p-4 border border-base-300 z-50">
          <h3 className="font-semibold text-base-content mb-2">
            Notifications
          </h3>
          <ul className="space-y-2">
            {requests.length > 0 ? (
              requests.map((notification, index) => (
                <li
                  key={index}
                  className="text-sm p-2 hover:bg-base-200 rounded transition"
                >
                  {notification}
                </li>
              ))
            ) : (
              <li className="text-sm text-base-content/60">
                No new notifications
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Connections;