import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, Lock, Megaphone, NotebookPen, Trash2 } from 'lucide-react';
import DeleteClassroomAndChannelModal from '@/modals/DeleteClassroomAndChannelModal';
import useConversationStore from '@/store/ConversationsStore';
import { useAuthStore } from '@/store/AuthStore';
import { useClassroomAndChannelStore } from '@/store/ClassroomStore';

const ChannelNavigationItem = ({ classroomId, channelId, channelName, lock }) => {
    const { selectedConversation, setSelectedConversation } = useConversationStore();
    const isSelected = selectedConversation === channelId;

    const navigate = useNavigate();
    const { user } = useAuthStore()
    const { deleteChannel } = useClassroomAndChannelStore()

    const handleOnClick = () => {
        setSelectedConversation(channelId);
        navigate(`/home/${classroomId}/${channelName}/${channelId}`);
    };


    // Modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteChannel = () => {
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
    };

    useEffect(() => {
        // Reset the selected conversation when the classroomId changes
        setSelectedConversation(null); // or setSelectedConversation("") to reset
    }, [classroomId, setSelectedConversation]);

    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleOnClick}
                    className={`group px-5 rounded-md flex items-center gap-x-2 h-10 w-[85%] hover:bg-blue-200 dark:hover:bg-zinc-700/50 transition mb-1
        ${isSelected ? "bg-blue-200" : ""}
        `}
                >
                    {lock ? (
                        <Lock className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                    ) : channelName === 'Announcements' ? (
                        <Megaphone className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                    ) : channelName === 'Assignments' ? (
                        <NotebookPen className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                    ) : (
                        <Hash className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                    )}
                    {channelName}
                </button>

                {user?.status !== "student" && channelName !== "Announcements" && channelName !== "Assignments" && (
                    <button
                        onClick={handleDeleteChannel}
                        className="flex items-center justify-center h-[100%] w-[10%] text-zinc-500"
                    >
                        <Trash2 className="h-[18px] hover:h-[25px]" />
                    </button>
                )}
            </div>
            {showDeleteModal && (
                <DeleteClassroomAndChannelModal
                    open={showDeleteModal}
                    onClose={handleCloseModal}
                    value="channel"
                    id={channelId}
                    classroomId={classroomId}
                />
            )}
        </>
    );
};

export default ChannelNavigationItem;

