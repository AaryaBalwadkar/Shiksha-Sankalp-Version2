import React, { useState } from 'react'
import { Trash, Code } from 'lucide-react'
import { Presentation } from 'lucide-react'
import { useAuthStore } from '@/store/AuthStore'
import { useNavigate } from 'react-router-dom'
import { ActionTooltip } from '@/actions/TooltipAction'
import DeleteClassroomAndChannelModal from '@/modals/DeleteClassroomAndChannelModal'

const ChannelHeader = ({ classroomId, code }) => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleRemove = async () => {
    try {
      navigate("/home/confirmremove", { state: { classroomId } })
    } catch (error) {
      console.log("Error in handling delete classroom")
    }
  }

  return (
    <div>
      {showDeleteModal && (
        <DeleteClassroomAndChannelModal
          value="classroom"
          id={classroomId}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {(user?.status === "institute") ? (
        <div className='flex items-center bg-blue-200/30 h-[6vh] pl-2 z-10 shadow-bottom-only'>
          <ActionTooltip side="right" align="center" label={code}>
            <div className='flex h-[100%] w-[33%] items-center justify-center border-r-blue-200 border-r-2'>
              <Code />
            </div>
          </ActionTooltip>
          <ActionTooltip side="right" align="center" label="Whiteboard">
            <div className='flex h-[100%] w-[33%] items-center justify-center border-r-blue-200 border-r-2'>
              <Presentation />
            </div>
          </ActionTooltip>
          <ActionTooltip side="right" align="center" label="Delete Classroom">
            <div className='flex h-[100%] w-[33%] items-center justify-center border-r-blue-200 border-r-2' onClick={handleDelete}>
              <Trash />
            </div>
          </ActionTooltip>
        </div>
      ) : (
        <div className='flex items-center bg-blue-200/30 h-[6vh] pl-2 z-10 shadow-bottom-only'>
          <div className='flex w-[60%]'>
            Channels
          </div>
          <div className='flex w-[40%] items-center justify-end'>
            <ActionTooltip side="right" align="center" label="Unsubscribe Classroom">
              <div className='flex h-[100%] items-center justify-end border-l-blue-200 border-l-2 mr-3 pl-3' onClick={handleRemove}>
                <Trash />
              </div>
            </ActionTooltip>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChannelHeader
