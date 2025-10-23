import React from 'react';

export default function AssignmentMetaForm({ dueDate, onDueDateChange, tags, onTagsChange, attachedDoc, setAttachedDoc }) {
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      alert('File exceeds 10MB');
      return;
    }
    setAttachedDoc(f);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-sm text-gray-600">Due date</label>
        <input type="datetime-local" value={dueDate} onChange={(e) => onDueDateChange(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Tags (comma separated)</label>
        <input value={tags} onChange={(e) => onTagsChange(e.target.value)} className="w-full p-2 border rounded" placeholder="algorithms,week1" />
      </div>

      <div className="col-span-1 sm:col-span-2">
        <label className="text-sm text-gray-600">Attach document (pdf/doc/zip) — max 10MB</label>
        <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={handleFile} className="block mt-1" />
        {attachedDoc && <p className="text-sm text-gray-700 mt-1">Attached: {attachedDoc.name}</p>}
      </div>
    </div>
  );
}