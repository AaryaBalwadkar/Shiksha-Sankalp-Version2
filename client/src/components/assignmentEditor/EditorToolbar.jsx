import React, { useMemo } from 'react';

function Toolbar({ editorApi }) {
  if (!editorApi) return <div className="h-10" />;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <button onClick={() => editorApi.chain().focus().toggleBold().run()} className="px-3 py-1 rounded hover:bg-gray-100">B</button>
      <button onClick={() => editorApi.chain().focus().toggleItalic().run()} className="px-3 py-1 rounded hover:bg-gray-100">I</button>
      <button onClick={() => editorApi.chain().focus().toggleUnderline().run()} className="px-3 py-1 rounded hover:bg-gray-100">U</button>
      <button onClick={() => editorApi.chain().focus().toggleStrike().run()} className="px-3 py-1 rounded hover:bg-gray-100">S</button>

      <button onClick={() => editorApi.chain().focus().toggleHeading({ level: 1 }).run()} className="px-2 py-1 rounded hover:bg-gray-100">H1</button>
      <button onClick={() => editorApi.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 rounded hover:bg-gray-100">H2</button>

      <button onClick={() => editorApi.chain().focus().toggleBulletList().run()} className="px-2 py-1 rounded hover:bg-gray-100">• List</button>
      <button onClick={() => editorApi.chain().focus().toggleOrderedList().run()} className="px-2 py-1 rounded hover:bg-gray-100">1. List</button>

      <button onClick={() => editorApi.chain().focus().toggleBlockquote().run()} className="px-3 py-1 rounded hover:bg-gray-100">❝</button>
      <button onClick={() => editorApi.chain().focus().toggleCodeBlock().run()} className="px-3 py-1 rounded hover:bg-gray-100">{'</>'}</button>

      <label className="px-3 py-1 rounded hover:bg-gray-100 cursor-pointer">
        📷 Image
        <input type="file" accept="image/*" onChange={(e) => handleImageInsert(e, editorApi)} className="hidden" />
      </label>

      <input type="color" title="Text color" onChange={(e) => editorApi.chain().focus().setColor(e.target.value).run()} className="h-8 w-10 p-0 border-0 bg-transparent" />

      <select onChange={(e) => editorApi.chain().focus().setTextAlign(e.target.value).run()} defaultValue="left" className="border p-1 rounded">
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="justify">Justify</option>
      </select>

      <button onClick={() => editorApi.chain().focus().undo().run()} className="px-3 py-1 rounded hover:bg-gray-100">↺</button>
      <button onClick={() => editorApi.chain().focus().redo().run()} className="px-3 py-1 rounded hover:bg-gray-100">↻</button>
    </div>
  );
}

// helper to insert image file as base64 — replace with upload flow in prod
function handleImageInsert(e, editorApi) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert('Image too large (max 5MB)');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    editorApi.chain().focus().setImage({ src: reader.result }).run();
  };
  reader.readAsDataURL(file);
}

export default React.memo(function EditorToolbar({ editorApi }) {
  return <Toolbar editorApi={editorApi} />;
});