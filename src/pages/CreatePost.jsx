
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';

import 'highlight.js/styles/tokyo-night-dark.css';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml'; // for HTML

const lowlight = createLowlight();

// Register languages for syntax highlighting
lowlight.register({html, css, js: javascript, ts: typescript});

const categories = [
    { name: 'Array & String' },
    { name: 'Searching & Sorting' },
    { name: 'Stack & Queue' },
    { name: 'Binary Trees' },
    { name: 'Graphs' },
    { name: 'DP' },
];

// --- Editor Toolbar Component ---
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = useCallback(() => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const menuItems = [
    { action: () => editor.chain().focus().toggleBold().run(), name: 'Bold', isActive: editor.isActive('bold') },
    { action: () => editor.chain().focus().toggleItalic().run(), name: 'Italic', isActive: editor.isActive('italic') },
    { action: () => editor.chain().focus().toggleStrike().run(), name: 'Strike', isActive: editor.isActive('strike') },
    { action: () => editor.chain().focus().toggleCode().run(), name: 'Code', isActive: editor.isActive('code') },
    { type: 'divider' },
    { action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), name: 'H2', isActive: editor.isActive('heading', { level: 2 }) },
    { action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), name: 'H3', isActive: editor.isActive('heading', { level: 3 }) },
    { action: () => editor.chain().focus().toggleBulletList().run(), name: 'Bullet List', isActive: editor.isActive('bulletList') },
    { action: () => editor.chain().focus().toggleOrderedList().run(), name: 'Ordered List', isActive: editor.isActive('orderedList') },
    { action: () => editor.chain().focus().toggleCodeBlock().run(), name: 'Code Block', isActive: editor.isActive('codeBlock') },
    { type: 'divider' },
    { action: () => editor.chain().focus().toggleBlockquote().run(), name: 'Blockquote', isActive: editor.isActive('blockquote') },
    { action: addImage, name: 'Add Image' },
    { action: setLink, name: 'Add Link', isActive: editor.isActive('link') },
  ];

  return (
     <div className="flex flex-wrap items-center gap-x-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {menuItems.map((item, index) =>
        item.type === 'divider' ? <div key={index} className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div> : (
          <button key={index} type="button" onClick={item.action} title={item.name} className={`p-2 rounded-md ${item.isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            {/* You can replace these with actual SVG icons */}
            <span className="text-sm font-semibold">{item.name}</span>
          </button>
        )
      )}
    </div>
  );
};


// --- Main CreatePost Component ---
const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We're using a custom one with highlighting
      }),
      Link.configure({ openOnClick: false }),
      Image,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: `<h2>Welcome to your new post!</h2><p>Start by typing here. You can use Markdown shortcuts!</p>`,
  });

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const htmlContent = editor.getHTML();
    const textContent = editor.getText();

    if (!title.trim() || !textContent.trim() || !category) {
      setError('Title, content, and category are required.');
      return;
    }
    if (!user) {
      setError('You must be logged in to create a post.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content: htmlContent,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigate('/blog'); 
    } catch (err) {
      console.error("Error creating post:", err);
      setError('Failed to publish post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .ProseMirror { min-height: 400px; padding: 1rem; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror pre { background: #0D0D0D; color: #FFF; font-family: 'JetBrainsMono', monospace; padding: 0.75rem 1rem; border-radius: 0.5rem; }
        .ProseMirror pre code { color: inherit; padding: 0; background: none; font-size: 0.8rem; }
      `}</style>
      <div className="bg-gray-100 dark:bg-black min-h-screen pt-20">
        <form onSubmit={handleCreatePost}>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Post</h1>
              <button
                type="submit"
                disabled={loading || !editor}
                className="w-full sm:w-auto inline-flex items-center gap-2 justify-center py-2 px-6 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              >
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert"><p>{error}</p></div>}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4">
                  <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Post Title..."
                      className="w-full text-4xl font-extrabold bg-transparent border-none p-2 focus:ring-0 focus:outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                      disabled={loading}
                    />
                </div>
                <MenuBar editor={editor} />
                <div className="text-gray-900 dark:text-gray-200">
                  <EditorContent editor={editor} />
                </div>
              </div>
              <aside className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Post Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                      <select 
                        id="category" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="" disabled>Select a category</option>
                        {categories.map(cat => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-white dark:text-gray-300">Tags</label>
                      <input 
                        type="text" 
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Comma-separated tags"
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
