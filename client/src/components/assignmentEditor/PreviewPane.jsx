import React from 'react';

function Preview({ title, summary, content, attachedDoc, dueDate, tags }) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-2">{title || 'Untitled assignment'}</h3>
      {summary && <p className="text-gray-700 mb-3">{summary}</p>}

      <div className="prose max-w-none break-words" dangerouslySetInnerHTML={{ __html: content || '<p><em>Start writing to see the preview...</em></p>' }} />

      {attachedDoc && (
        <div className="mt-3 p-3 border rounded bg-gray-50">
          <strong>Attached:</strong>
          <div className="text-sm">{attachedDoc.name} ({(attachedDoc.size/1024/1024).toFixed(2)} MB)</div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <div>Due: {dueDate ? new Date(dueDate).toLocaleString() : 'Not set'}</div>
        {tags && <div>Tags: {tags}</div>}
      </div>
    </div>
  );
}

export default React.memo(Preview);