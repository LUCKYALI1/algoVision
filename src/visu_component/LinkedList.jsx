import React, { useState, useRef, useLayoutEffect } from 'react';

// --- Helper Components ---
const CodeBlock = () => {
  const code = [
    'class Node {',
    '  constructor(value) {',
    '    this.value = value;',
    '    this.next = null;',
    '  }',
    '}',
    '',
    'class LinkedList {',
    '  constructor() {',
    '    this.head = null;',
    '    this.tail = null;',
    '  }',
    '  // ... methods for insert/delete',
    '}',
  ];
  return (
    <div className="code-block bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4 overflow-x-auto">
      <pre className="m-0"><code className="block">{code.join('\n')}</code></pre>
    </div>
  );
};

// --- Main Visualizer Component ---
export default function LinkedList() {
  const MAX_SIZE = 9;
  const [nodes, setNodes] = useState(['A', 'B', 'C']);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [message, setMessage] = useState('Linked List initialized.');
  const [deletedValue, setDeletedValue] = useState(null);
  const [arrows, setArrows] = useState([]);
  
  const nodeRefs = useRef([]);

  useLayoutEffect(() => {
    const newArrows = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const startNode = nodeRefs.current[i];
      const endNode = nodeRefs.current[i + 1];
      if (startNode && endNode) {
        newArrows.push({
          x1: startNode.offsetLeft + startNode.offsetWidth - 5,
          y1: startNode.offsetTop + startNode.offsetHeight / 2,
          x2: endNode.offsetLeft + 5,
          y2: endNode.offsetTop + endNode.offsetHeight / 2,
        });
      }
    }
    setArrows(newArrows);
  }, [nodes]);

  const handleInsert = (index) => {
    if (!inputValue) {
        setMessage('Error: Input value cannot be empty.');
        return;
    }
    if (nodes.length >= MAX_SIZE) {
        setMessage(`Error: List is full (max size: ${MAX_SIZE}).`);
        return;
    }

    const newNodes = [...nodes];
    newNodes.splice(index, 0, inputValue);
    setNodes(newNodes);
    setMessage(`Inserted '${inputValue}' at index ${index}.`);
    setInputValue('');
    setInputIndex('');
    setDeletedValue(null);
  };
  
  const handleDelete = (index) => {
    if (nodes.length === 0) {
        setMessage('Error: List is empty.');
        return;
    }
    
    const newNodes = [...nodes];
    const [deleted] = newNodes.splice(index, 1);
    setNodes(newNodes);
    setDeletedValue(deleted);
    setMessage(`Deleted '${deleted}' from index ${index}.`);
    setInputIndex('');
  };
  
  const handleIndexOperation = (operation) => {
      const idx = parseInt(inputIndex, 10);
      if (isNaN(idx) || idx < 0 || (operation === 'insert' && idx > nodes.length) || (operation === 'delete' && idx >= nodes.length)) {
          setMessage(`Error: Invalid index. Must be between 0 and ${operation === 'insert' ? nodes.length : nodes.length - 1}.`);
          return;
      }
      if (operation === 'insert') handleInsert(idx);
      else handleDelete(idx);
  }

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen p-2 sm:p-5 font-sans">
       <style>{`
        .node-enter { opacity: 0; transform: scale(0.5); }
        .node-enter-active { opacity: 1; transform: scale(1); transition: all 300ms; }
        .node-exit { opacity: 1; transform: scale(1); }
        .node-exit-active { opacity: 0; transform: scale(0.5); transition: all 300ms; }
      `}</style>
      
      {/* --- TITLE & DESCRIPTION --- */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-sky-600 dark:text-sky-400">Linked List Visualizer</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">A Linked List stores elements in nodes, with each node pointing to the next one in the sequence.</p>
      </div>

      <div className="main-content grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CONTROLS & INFO --- */}
        <div className="controls-panel lg:col-span-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700">Operations</h2>
          <div className="space-y-4">
            {/* --- INSERT --- */}
            <div>
              <label className="block font-medium mb-1">Value to Insert</label>
              <div className="flex gap-2">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter value" className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2"/>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={() => handleInsert(0)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400" disabled={!inputValue || nodes.length >= MAX_SIZE}>Insert Head</button>
                <button onClick={() => handleInsert(nodes.length)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400" disabled={!inputValue || nodes.length >= MAX_SIZE}>Insert Tail</button>
              </div>
            </div>
            {/* --- DELETE --- */}
            <div>
              <label className="block font-medium mb-1">Delete Operations</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleDelete(0)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400" disabled={nodes.length === 0}>Delete Head</button>
                <button onClick={() => handleDelete(nodes.length - 1)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400" disabled={nodes.length === 0}>Delete Tail</button>
              </div>
            </div>
             {/* --- BY INDEX --- */}
            <div>
              <label className="block font-medium mb-1">Operate by Index</label>
              <div className="flex gap-2">
                <input type="number" value={inputIndex} onChange={(e) => setInputIndex(e.target.value)} placeholder="Index" className="w-20 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2"/>
                <button onClick={() => handleIndexOperation('insert')} className="flex-grow bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-md transition disabled:bg-gray-400" disabled={!inputValue || nodes.length >= MAX_SIZE}>Insert</button>
                <button onClick={() => handleIndexOperation('delete')} className="flex-grow bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition disabled:bg-gray-400" disabled={nodes.length === 0}>Delete</button>
              </div>
            </div>
          </div>
          <div className="status mt-6 space-y-3">
              <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
                <h3 className="font-semibold text-sky-600 dark:text-sky-400">Status</h3>
                <p className="text-sm italic">{message}</p>
              </div>
              <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
                <h3 className="font-semibold">Last Deleted Value</h3>
                <p className="text-2xl font-mono text-red-500">{deletedValue || '—'}</p>
              </div>
          </div>
        </div>

        {/* --- VISUALIZATION --- */}
        <div className="visualization-area lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 min-h-[300px] flex justify-center items-center overflow-x-auto relative">
          <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
             <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" className="fill-current text-gray-500 dark:text-gray-400" />
                </marker>
            </defs>
            {arrows.map((arrow, i) => (
                <line key={i} x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2} className="stroke-current text-gray-500 dark:text-gray-400" strokeWidth="2" markerEnd="url(#arrowhead)" style={{transition: 'all 300ms'}}/>
            ))}
          </svg>
          <div className="flex items-center gap-10 relative">
             {nodes.map((value, index) => (
                <div key={index} ref={el => nodeRefs.current[index] = el} className="node-container flex flex-col items-center node-enter-active">
                   <div className="node w-16 h-16 flex items-center justify-center bg-sky-500 text-white font-bold text-lg rounded-md border-2 border-sky-300 z-10">
                        {value}
                   </div>
                   <div className="labels text-xs mt-2 font-semibold">
                      {index === 0 && <span className="text-green-500">HEAD</span>}
                      {index === 0 && index === nodes.length - 1 && <span className="mx-1">/</span>}
                      {index === nodes.length - 1 && <span className="text-red-500">TAIL</span>}
                   </div>
                </div>
             ))}
             {nodes.length === 0 && <div className="text-gray-500">List is empty</div>}
          </div>
        </div>
      </div>
      
      {/* --- CODE & INFO --- */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Linked List Implementation in JavaScript</h2>
        <CodeBlock />
      </div>
    </div>
  );
}