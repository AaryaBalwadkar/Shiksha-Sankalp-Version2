import React, { useState, useEffect } from "react";
import './Channel.css';
import { useParams } from "react-router-dom";
import ChannelNavigationItem from "./ChannelNavigationItem";
import ChannelHeader from "./ChannelHeader";
import ChannelsAction from "../FurtherActions/ChannelsAction";
import { ScrollArea } from "../ui/scroll-area";
import { useClassroomAndChannelStore } from "@/store/ClassroomStore";

const Channel = () => {
  const { id, channelId } = useParams(); // Get classroom ID and channel ID from URL
  const [classroomCode, setClassroomCode] = useState(null);

  const {
    getChannels,
    getClassroomCode,
    channels = [],
    subscribeToChannel,
    unsubscribeFromChannel
  } = useClassroomAndChannelStore();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      await getChannels(id); // Fetch channels
      const code = await getClassroomCode(id); // Fetch classroom code
      setClassroomCode(code); // Set classroom code
      subscribeToChannel(id); // Subscribe to real-time updates
    };

    fetchData();

    return () => {
      unsubscribeFromChannel(id); // Clean up subscription
    };
  }, [id, getChannels, getClassroomCode, subscribeToChannel, unsubscribeFromChannel]);

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

