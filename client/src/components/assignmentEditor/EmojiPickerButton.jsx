import React, { useState, Suspense } from 'react';
const EmojiPicker = React.lazy(() => import('emoji-picker-react'));

export default function EmojiPickerButton({ onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="px-3 py-1 rounded hover:bg-gray-100">😊 Emoji</button>
      {open && (
        <div className="absolute z-50 mt-2">
          <Suspense fallback={<div className="p-3 bg-white border">Loading...</div>}>
            <EmojiPicker onEmojiClick={(e, emoji) => { onSelect(emoji.emoji); setOpen(false); }} />
          </Suspense>
        </div>
      )}
    </div>
  );
}