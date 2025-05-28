import { useChatStore } from "../store/useChatStore";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import SideBar from "../components/SideBar";
import SearchPage from "../components/SearchPage";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { selectedUser, getUsers } = useChatStore();
  const [showSearchPage, setShowSearchPage] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="h-screen bg-base-200 animate-fade-in">
      <div className="flex items-center justify-center pt-22 px-4">
        <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)] transition-all">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SideBar />

            <div className="flex-1 flex flex-col transition-all duration-300">
              {!selectedUser ? (
                showSearchPage ? (
                  <SearchPage onClose={() => setShowSearchPage(false)} />
                ) : (
                  <NoChatSelected
                    onOpenSearch={() => setShowSearchPage(true)}
                  />
                )
              ) : (
                <ChatContainer />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
