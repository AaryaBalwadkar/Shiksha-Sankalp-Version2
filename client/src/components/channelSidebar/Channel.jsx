import React from "react";
import './Channel.css'
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChannelNavigationItem from "./ChannelNavigationItem";
import ChannelHeader from "./ChannelHeader";
import ChannelsAction from "../FurtherActions/ChannelsAction";
import { ScrollArea } from "../ui/scroll-area";
import { useClassroomAndChannelStore } from "@/store/ClassroomStore";

const Channel = () => {
  const { id, channelId } = useParams(); // Get classroom ID from route params
  const { getChannels, channels, subscribeToChannel, unsubscribeFromChannel } = useClassroomAndChannelStore();

  useEffect(() => {
    getChannels(id);

    subscribeToChannel(id);

    return () => {
      unsubscribeFromChannel(id); // Unsubscribe from the channel when component unmounts
    };
  }, [id, getChannels, subscribeToChannel, unsubscribeFromChannel]);

  return (
    <div>
      <div className="channel-side-bar">
        {!id && (
          <div className="flex flex-col h-[100vh] items-center justify-center">Select any classroom</div>
        )}
        {id && (
          <>
            <ChannelHeader classroomId={id} code={channels.classroomCode}/>
          </>
        )}
        <ScrollArea className="h-[80vh]">
        {channels.map((channel, index) => (
          <div key={index}>
            <ChannelNavigationItem classroomId={id} channelId={channel._id} channelName={channel.channelName} lock={channel.lock}/>
          </div>
        ))}
        {id && <ChannelsAction classroomId={id} />}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Channel;
