import React, { useEffect } from "react";
import "./Chat.css";
import { useParams } from "react-router-dom";
import ChatInput from "./ChatInput.jsx";
import ChatHeader from "./ChatHeader.jsx";
import ChatMessages from "./ChatMessages";
import ChatWelcome from "./ChatWelcome";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import useConversationStore from "@/store/ConversationsStore";

const DATE_FORMAT = "dd/MM/yyyy HH:mm";

const Chat = () => {
  const { id, channelid, channelName } = useParams();
  const { getChats, chats, subscribeToMessages, unsubscribeFromMessages } = useConversationStore();

  useEffect(() => {
    getChats(channelid);

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [getChats, channelid, subscribeToMessages, unsubscribeFromMessages, chats]);

  return (
    <div>
      {channelid && <ChatHeader name={channelName} />}
      {!channelid && (
        <div className="flex flex-col bg-blue-200/30 ml-[320px] h-[100vh] items-center justify-center">
          Hello
        </div>
      )}
      {channelid && (
        <div className="chat-section flex flex-col justify-end mb-0 pb-0 h-[94vh] bg-blue-200/30">
          <ScrollArea className="flex-col justify-end w-full overflow-auto h-[100vh]">
            <ChatWelcome name={channelName} />
            {chats?.map((chat) => (
              <ChatMessages
                key={chat._id} // Assuming each message has a unique `_id`
                message={chat.message}
                senderId={chat.senderId}
                timestamp={format(new Date(chat.createdAt), DATE_FORMAT)}
              />
            ))}
          </ScrollArea>
          <ChatInput name={channelName} channelid={channelid}/>
        </div>
      )}
    </div>
  );
};

export default Chat;
