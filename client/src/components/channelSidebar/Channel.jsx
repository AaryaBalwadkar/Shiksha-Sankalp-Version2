import React, { useState, useEffect } from "react";
import './Channel.css';
import { useParams } from "react-router-dom";
import ChannelNavigationItem from "./ChannelNavigationItem";
import ChannelHeader from "./ChannelHeader";
import ChannelsAction from "../FurtherActions/ChannelsAction";
import { ScrollArea } from "../ui/scroll-area";
import { useClassroomAndChannelStore } from "@/store/ClassroomStore";

const Channel = () => {
  const { id, channelId } = useParams();
  const [classroomCode, setClassroomCode] = useState(null);

  const {
    getChannels,
    getClassroomCode,
    channels = [],
    subscribeToAllChannelEvents,
    unsubscribeFromChannel
  } = useClassroomAndChannelStore();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      await getChannels(id);
      const code = await getClassroomCode(id);
      setClassroomCode(code);
      subscribeToAllChannelEvents(id);
    };

    fetchData();

    return () => {
      unsubscribeFromChannel(id);
    };
  }, [id, getChannels, getClassroomCode, subscribeToAllChannelEvents, unsubscribeFromChannel]);

  return (
    <div className="channel-side-bar">
      {!id ? (
        <div className="flex flex-col h-[100vh] items-center justify-center">
          Select any classroom
        </div>
      ) : (
        <>
          {classroomCode && (
            <ChannelHeader classroomId={id} code={classroomCode} />
          )}

          <ScrollArea className="h-[80vh]">
            {channels?.map((channel) => (
              <div key={channel._id}>
                <ChannelNavigationItem
                  classroomId={id}
                  channelId={channel._id}
                  channelName={channel.channelName}
                  lock={channel.lock}
                />
              </div>
            ))}
            <ChannelsAction classroomId={id} />
          </ScrollArea>
        </>
      )}
    </div>
  );
};

export default Channel;

