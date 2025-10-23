import React, { useCallback, useState, Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import RichTextEditor from '../components/assignmentEditor/RichTextEditor';
import EditorToolbar from '../components/assignmentEditor//EditorToolbar';
import PreviewPane from '../components/assignmentEditor//PreviewPane';
import AssignmentMetaForm from '../components/assignmentEditor//AssignmentMetaForm';
import useDebouncedSave from '../components/assignmentEditor//useDebouncedSave';

export default function AssignmentEditorModal({ open, onClose, onSubmit }) {
  // Meta state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [attachedDoc, setAttachedDoc] = useState(null);

  // Editor exposes an API object that provides getHTML(), commands etc.
  const [editorApi, setEditorApi] = useState(null);

  // autosave using debounced hook (saves editor HTML + meta)
  const saveDraft = useDebouncedSave(async (data) => {
    // Implement API call here — this is called debounced
    // console.log('autosave', data);
    // await api.saveDraft(data)
  }, 1200);

  const onEditorChange = useCallback(
    (editor) => {
      setEditorApi(editor);
      // call autosave with minimal payload
      saveDraft({ title, summary, dueDate, tags, content: editor.getHTML() });
    },
    [title, summary, dueDate, tags, saveDraft]
  );

  const handleSubmit = async (publish = true) => {
    const content = editorApi?.getHTML() || '';
    const payload = {
      title,
      summary,
      dueDate,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      content,
      attachedDoc,
      published: publish,
    };

    if (onSubmit) await onSubmit(payload);
    // reset local state
    setTitle(''); setSummary(''); setDueDate(''); setTags(''); setAttachedDoc(null);
    editorApi && editorApi.commands && editorApi.commands.clearContent(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[90%] max-h-[80%] bg-white rounded-xl shadow-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create Assignment</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-6 px-4 pb-4">
          {/* LEFT: Editor + Toolbar + Meta */}
          <div className="col-span-12 lg:col-span-7 p-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assignment title"
              className="w-full text-2xl font-semibold mb-2 p-2 border-b focus:outline-none"
            />
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short summary (optional)"
              className="w-full mb-4 p-2 border-b focus:outline-none"
            />

            <EditorToolbar editorApi={editorApi} />

            <div className="border rounded-lg mt-2">
              <RichTextEditor onEditorReady={setEditorApi} onChange={onEditorChange} />
            </div>

            <div className="mt-4">
              <AssignmentMetaForm
                dueDate={dueDate}
                onDueDateChange={setDueDate}
                tags={tags}
                onTagsChange={setTags}
                attachedDoc={attachedDoc}
                setAttachedDoc={setAttachedDoc}
              />
            </div>
          </div>

          {/* RIGHT: Preview + actions */}
          <div className="col-span-12 lg:col-span-5 p-2 border-l">
            <div className="sticky top-6">
              <PreviewPane
                title={title}
                summary={summary}
                content={editorApi ? editorApi.getHTML() : ''}
                attachedDoc={attachedDoc}
                dueDate={dueDate}
                tags={tags}
              />

              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => handleSubmit(false)}>Save Draft</Button>
                <Button onClick={() => handleSubmit(true)} className="bg-blue-600 text-white">Publish Assignment</Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
              </div>
            </div>
          </div>

        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
