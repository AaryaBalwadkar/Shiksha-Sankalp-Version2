import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

const RichTextEditor = ({ onEditorReady = () => {}, onChange = () => {} }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color, TextAlign.configure({ types: ['heading', 'paragraph'] }), Link, Image, Placeholder.configure({ placeholder: 'Start writing your assignment...' })],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose md:prose-lg lg:prose-xl prose-stone focus:outline-none p-4 min-h-[200px] break-words'
      }
    },
    onUpdate: ({ editor }) => onChange(editor),
  });

  useEffect(() => {
    if (editor) onEditorReady(editor);
    return () => editor && editor.destroy();
  }, [editor, onEditorReady]);

  return <EditorContent editor={editor} />;
}

export default RichTextEditor;