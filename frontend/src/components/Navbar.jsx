import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, BookHeart } from "lucide-react";
import { Link } from "react-router-dom";
import Connections from "./Connections.jsx";
import { motion } from "framer-motion";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    console.log("Dropdown visible:", showDropdown);
  }, [showDropdown]);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-40 w-full px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative mx-auto mt-3 max-w-fit flex items-center 
  bg-base-100/80 backdrop-blur-lg border border-base-300 
  shadow-lg rounded-full divide-x divide-base-300"
      >
        {!authUser ? (
          <Link
            to="/"
            className="flex rounded-full items-center px-4 py-2 hover:bg-base-100/80 transition-all group"
          >
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="w-4 h-4 text-primary animate-bounce" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight ml-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
              UMe: Your Connection Companion
            </h1>
          </Link>
        ) : (
          <>
            <Link
              to="/"
              className="flex items-center px-4 py-2 rounded-l-box hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-all"
            >
              {authUser? (
                <img
                  src={authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                />
              ) : (
                <MessageSquare className="w-5 h-5 text-primary mr-2" />
              )}
              <span className="font-semibold">UMe</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-600
 transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-600
transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            {/* Dropdown Trigger */}
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-600
 transition-all"
              >
                <BookHeart className="w-4 h-4" />
                <span className="hidden sm:inline">Requests</span>
              </button>

              {showDropdown && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 z-[9999] bg-white dark:bg-gray-900">
                  <Connections onClose={() => setShowDropdown(false)} />
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-r-box hover:bg-neutral-100 dark:hover:bg-neutral-600
 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Navbar;
