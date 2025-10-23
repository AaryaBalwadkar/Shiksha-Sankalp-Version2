import React, { useEffect, useRef, useState } from "react";
import { Plus, Smile } from "lucide-react";
import useConversationStore from "@/store/ConversationsStore";

const ChatInput = ({ name, channelid, onOpenAssignmentModal }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef();
  const { sendMessage } = useConversationStore();

  useEffect(() => {
    setMessage(""); // Clear input on channel change
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [channelid]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(channelid, message);
    setMessage("");
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return;
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div>
      {name === "Assignments" ? (
        <div className="relative p-4 pb-6 z-20 h-[100px] shadow-md flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenAssignmentModal}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition"
          >
            + Create Assignment
          </button>
        </div>
      ) : (
        <form>
          <div className="relative p-4 pb-6 z-20 shadow-md">
            <button
              type="button"
              onClick={handleSendMessage}
              className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
            >
              <Plus className="text-white dark:text-[#313338]" />
            </button>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${name}`}
              className="border-0 w-full resize-none overflow-hidden px-14 py-3 bg-zinc-200/90 dark:bg-zinc-700/75 border-none outline-none focus:ring-0 focus-visible:ring-0 text-zinc-600 dark:text-zinc-200 rounded-md"
              rows={1}
              style={{ maxHeight: "200px", minHeight: "40px", overflowY: "auto" }}
            />
            <div className="absolute top-7 right-8">
              <Smile />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChatInput;
