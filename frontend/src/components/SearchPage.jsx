import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users, Search, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SearchPage = ({ onClose }) => {
  const {
    getUsers,
    users,
    Allusers,
    isUserLoading,
    getAllUsers,
  } = useChatStore();
  const { search, FriendRequest } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  useEffect(() => {
    if (searchQuery) {
      search({ email: searchQuery });
    }
  }, [searchQuery, search]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const SendRequest = async (userEmail) => {
    try {
      await FriendRequest({ email: userEmail });
      getUsers();
      setSearchQuery("");
    } catch (error) {
      console.error("Error adding contact", error.message);
    }
  };

  const AllPeople = Allusers.filter((user) =>
    user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-base-300 w-full p-6 relative">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center">Add New Contacts</h2>
          <p className="text-base-content/60 text-center">
            Search and connect with people
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-base-200 transition-colors"
        >
          <X className="h-5 w-5 text-base-content/70 hover:text-base-content" />
        </button>
      </div>

      <div className="p-4 border-b border-base-300">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-base-content/50" />
            </div>
            <form onSubmit={handleSearch}>
              <input
                type="email"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-base-content/50 hover:text-base-content/80 transition-colors" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {AllPeople.length > 0 ? (
          <div className="space-y-2">
            {AllPeople.map((user) => {
              const isContact = users.some((contactGroup) =>
                contactGroup.contacts.some(
                  (contact) => contact.email === user.email
                )
              );

              return (
                <div
                  key={user._id}
                  className="card card-side bg-base-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <figure className="px-4 py-3">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </figure>
                  <div className="card-body py-3 px-0 pr-4">
                    <h3 className="card-title text-sm">{user.fullName}</h3>
                    <p className="text-xs text-base-content/60">{user.bio}</p>
                  </div>
                  <div className="card-actions items-center pr-4">
                    {isContact ? (
                      <span className="badge badge-success badge-sm">
                        Added
                      </span>
                    ) : (
                      <button
                        onClick={() => SendRequest(user.email)}
                        className="btn btn-primary btn-sm"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-24 h-24 rounded-2xl bg-base-200 flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-base-content/30" />
            </div>
            <h3 className="text-lg font-medium">
              {searchQuery ? "No users found" : "Search for contacts"}
            </h3>
            <p className="text-base-content/60 mt-1">
              {searchQuery
                ? "Try a different email"
                : "Enter an email to search"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;