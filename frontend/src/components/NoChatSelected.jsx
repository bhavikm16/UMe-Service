import { MessageSquare, MessageCirclePlus } from "lucide-react";

const NoChatSelected = ({ onOpenSearch }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Welcome to UMe!</h2>
        <p className="text-base-content/60">
          Select a contact to start chatting or add new contacts
        </p>

        <button
          onClick={onOpenSearch}
          className="btn btn-primary gap-2 mx-auto"
        >
          <MessageCirclePlus className="w-5 h-5" />
          Add New Contact
        </button>
      </div>
    </div>
  );
};

export default NoChatSelected;
