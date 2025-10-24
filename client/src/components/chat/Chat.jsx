import React, { useEffect, useState } from "react";
import "./Chat.css";
import { useParams } from "react-router-dom";
import ChatInput from "./ChatInput.jsx";
import ChatHeader from "./ChatHeader.jsx";
import ChatMessages from "./ChatMessages";
import ChatWelcome from "./ChatWelcome";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import useConversationStore from "@/store/ConversationsStore";
import AssignmentCard from "../channelSidebar/AssignmentCard";
import { useAssignmentsStore } from "@/store/AssignmentsStore";
import AssignmentModal from "../../modals/AssignmentEditorModal";

const DATE_FORMAT = "dd/MM/yyyy HH:mm";

const Chat = () => {
  const { id, channelid, channelName } = useParams();
  const { getChats, chats, subscribeToMessages, unsubscribeFromMessages } = useConversationStore();
  const { getAssignments, assignments } = useAssignmentsStore();

  const [addAssignment, setAddAssignment] = useState(false);

  useEffect(() => {
    getChats(channelid);

    // getAssignments(id, channelid);

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
        <div className={`chat-section flex flex-col mb-0 pb-0 h-[94vh] ${channelName !== "Assignments" && "justify-end"}`}>
          <ScrollArea className="flex-col w-full overflow-auto max-h-[100vh]">
            {channelName === "Assignments" &&
              <div className="flex justify-end h-[100px] items-center">
                <button className="mr-[50px] bg-orange-200 p-2 pl-5 pr-5 rounded-xl font-bold hover:border-black hover:"
                  onClick={() => setAddAssignment(true)}
                >Add Assignment</button>
              </div>
            }
            {channelName === "Assignments" ? (
              assignments?.map((assignment) => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))
            ) : (<>
              <ChatWelcome name={channelName} />
              {chats?.map((chat, index) => {
                const prev = chats[index - 1];
                const isSameSenderAsPrevious = prev?.senderId === chat.senderId;

                return (
                  <ChatMessages
                    key={chat._id} // Assuming each message has a unique `_id`
                    message={chat.message}
                    senderId={chat.senderId}
                    timestamp={format(new Date(chat.createdAt), DATE_FORMAT)}
                    isSameSenderAsPrevious={isSameSenderAsPrevious}
                  />
                );
              })}</>
            )}
          </ScrollArea>
          {channelName !== "Assignments" && (
            <ChatInput name={channelName} channelid={channelid} />
          )}
        </div>
      )}

      <AssignmentModal
        open={addAssignment}
        onClose={() => setAddAssignment(false)}
        onSubmit={(data) => {
          console.log("Assignment Data:", data);
          // Call store/ API to save assignment
        }}
      />
    </div>
  );
};

export default Chat;
