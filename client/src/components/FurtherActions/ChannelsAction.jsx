import React, { useState } from 'react'
import { ActionTooltip } from '@/actions/TooltipAction'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/store/AuthStore'
import AddChannelModal from '@/modals/AddChannelModal'

const ChannelsAction = ({ classroomId }) => {
  const { user } = useAuthStore()
  const [openAddChannelModal, setOpenAddChannelModal] = useState(false)

  const handlePlus = () => {
    setOpenAddChannelModal(true)
  }
  
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add New Channel">
        <button 
          className="group flex items-center mt-3 w-[100%]"
          onClick={handlePlus}
        >
          {(user?.status === "institute") && (

            <div className="group-hover:text-white group px-5 flex items-center gap-x-2 h-10 w-full transition mb-1 mx-3 group-hover:rounded-md overflow-hidden justify-center bg-background dark:bg-neutral-700 group-hover:bg-pink-500">
              <Plus
                className="group-hover:text-white transition text-pink-500"
                size={25}
              />
              Add Channel
            </div>
          )}
          {(user?.status === "educator") && (

            <div className="group px-5 flex items-center gap-x-2 h-10 w-full transition mb-1 mx-3 group-hover:rounded-md overflow-hidden justify-center bg-background dark:bg-neutral-700 group-hover:bg-green-500">
              <Plus
                className="group-hover:text-white transition text-green-500"
                size={25}
              />
            </div>
          )}
          </button>
      </ActionTooltip>
      {openAddChannelModal && (
        <AddChannelModal
          classroomId={classroomId}
          onClose={() => setOpenAddChannelModal(false)}
        />
      )}
    </div>
  )
}

export default ChannelsAction