import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';

const ChatMessages = ({ message, senderId, timestamp, isImage, isSameSenderAsPrevious }) => {
  const [userDetails, setUserDetails] = useState();
  const topMarginClass = isSameSenderAsPrevious ? 'mt-0 py-1' : 'mt-4';

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await axios.post(`http://localhost:5000/api/user/details`, { senderId });
        setUserDetails(res.data);
      } catch (error) {
        console.log("Something went wrong:", error.message);
      }
    };

    setUserDetails([]);
    getDetails();
  }, [senderId]);

  return (
    <div className={`relative group flex items-start hover:bg-blue-400/10 px-4 transition w-full ${topMarginClass}`}>
      <div className='group flex gap-x-2 w-full'>
        {/* Show avatar only if it's not the same sender as previous */}
        {!isSameSenderAsPrevious ? (
          <div className='cursor-pointer hover:drop-shadow-md transition place-content-center'>
            <Avatar>
              <AvatarImage src={userDetails?.imageUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className='w-[40px]' /> // Placeholder to keep alignment
        )}

        <div className='flex flex-col w-full'>
          {/* Show name and timestamp only if it's a new sender */}
          {!isSameSenderAsPrevious && (
            <div className='flex items-center gap-x-2 py-1'>
              <p className='font-semibold text-sm hover:underline cursor-pointer'>
                {userDetails?.name}
              </p>
              <span className='text-xs text-zinc-500 dark:text-zinc-400'>{timestamp}</span>
            </div>
          )}

          {isImage && (
            <a
              href=''
              target='_blank'
              rel='noopener noreferrer'
              className='relative aspect-square rounded-md mt-2 overflow-hidden flex items-center bg-secondary h-48 w-48'
            >
              {/* Image content */}
            </a>
          )}

          <p className='text-sm text-zinc-600'>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
