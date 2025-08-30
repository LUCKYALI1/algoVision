import React, { useState } from 'react';

// --- Helper Components ---
const CodeBlock = () => {
  const code = [
    'class Queue {',
    '  constructor() {',
    '    this.items = [];',
    '  }',
    '  enqueue(item) { // Add to rear',
    '    this.items.push(item);',
    '  }',
    '  dequeue() { // Remove from front',
    '    if (this.isEmpty()) return null;',
    '    return this.items.shift();',
    '  }',
    '  front() {',
    '    return this.items[0];',
    '  }',
    '  isEmpty() {',
    '    return this.items.length === 0;',
    '  }',
    '}',
  ];

  return (
    <div className="code-block bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4 overflow-x-auto">
      <pre className="m-0"><code className="block">{code.join('\n')}</code></pre>
    </div>
  );
};

// --- Main Visualizer Component ---
export default function Queue() {
  const MAX_SIZE = 8;
  const [queue, setQueue] = useState(['A', 'B', 'C']);
  const [inputValue, setInputValue] = useState('');
  const [dequeuedValue, setDequeuedValue] = useState(null);
  const [frontValue, setFrontValue] = useState(null);
  const [message, setMessage] = useState('Queue initialized. Try the operations!');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleEnqueue = () => {
    if (!inputValue) {
      setMessage('Input value cannot be empty.');
      return;
    }
    if (queue.length >= MAX_SIZE) {
      setMessage(`Error: Queue is full (max size: ${MAX_SIZE}).`);
      return;
    }
    // FIFO: Add to the end (rear) of the array
    setQueue([...queue, inputValue]);
    setMessage(`Enqueued '${inputValue}' to the rear of the queue.`);
    setInputValue('');
    setDequeuedValue(null);
    setFrontValue(null);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setMessage('Error: Queue is empty. Cannot dequeue.');
      return;
    }
    
    // FIFO: Remove from the beginning (front) of the array
    const dequeued = queue[0];
    const newQueue = queue.slice(1);
    
    setQueue(newQueue);
    setDequeuedValue(dequeued);
    setFrontValue(null);
    setMessage(`Dequeued '${dequeued}' from the front of the queue.`);
  };

  const handleFront = () => {
    if (queue.length === 0) {
        setMessage('Error: Queue is empty. Nothing at the front.');
        return;
    }
    // Peek at the first element
    const front = queue[0];
    setFrontValue(front);
    setDequeuedValue(null);
    setMessage(`Front element is '${front}'.`);
    setHighlightedIndex(0);
    setTimeout(() => setHighlightedIndex(-1), 1500); // Highlight for 1.5s
  };

  const handleClear = () => {
    setQueue([]);
    setMessage('Queue has been cleared.');
    setDequeuedValue(null);
    setFrontValue(null);
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen p-2 sm:p-5 font-sans">
      <style>{`
        @keyframes enqueue-in { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-enqueue-in { animation: enqueue-in 0.4s ease-out forwards; }
      `}</style>
      
      {/* --- TITLE & DESCRIPTION --- */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-400">Queue Visualizer</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">A Queue is a First-In, First-Out (FIFO) data structure. Like a real-world line, the first element to enter is the first to leave.</p>
      </div>

      <div className="main-content grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CONTROLS & INFO --- */}
        <div className="controls-panel lg:col-span-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700">Controls</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
                placeholder="Enter value"
                className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2"
              />
              <button onClick={handleEnqueue} disabled={queue.length >= MAX_SIZE} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed">Enqueue</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={handleDequeue} disabled={queue.length === 0} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed">Dequeue</button>
              <button onClick={handleFront} disabled={queue.length === 0} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed">Front</button>
              <button onClick={handleClear} disabled={queue.length === 0} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed">Clear</button>
            </div>
          </div>
          
          <div className="status mt-6 space-y-3">
            <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
              <h3 className="font-semibold text-teal-600 dark:text-teal-400">Status</h3>
              <p className="text-sm italic">{message}</p>
            </div>
             <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
              <h3 className="font-semibold">Dequeued Value</h3>
              <p className="text-2xl font-mono text-red-500">{dequeuedValue || '—'}</p>
            </div>
             <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
              <h3 className="font-semibold">Front Value</h3>
              <p className="text-2xl font-mono text-yellow-500">{frontValue || '—'}</p>
            </div>
          </div>
        </div>

        {/* --- VISUALIZATION --- */}
        <div className="visualization-area lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 min-h-[250px] flex flex-col justify-center items-center">
          <div className="w-full flex justify-center items-center relative">
            <div className="font-bold text-gray-500 mr-4">Front</div>
            <div className="w-full h-20 flex items-center gap-2 bg-gray-200 dark:bg-gray-900 rounded-md p-2 overflow-x-auto">
              {queue.map((item, index) => (
                <div 
                  key={index}
                  className={`w-16 h-16 flex-shrink-0 flex items-center justify-center font-bold text-lg text-white rounded-md transition-all duration-300
                    ${index === queue.length - 1 ? 'animate-enqueue-in' : ''}
                    ${index === highlightedIndex ? 'shadow-lg shadow-yellow-400/50 ring-4 ring-yellow-400' : ''}
                    bg-teal-500
                  `}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="font-bold text-gray-500 ml-4">Rear</div>
          </div>
          <div className="mt-4 font-semibold text-gray-600 dark:text-gray-400">
            Size: {queue.length} / {MAX_SIZE}
          </div>
        </div>
      </div>
      
      {/* --- CODE & INFO --- */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Queue Implementation in JavaScript</h2>
        <CodeBlock />
      </div>
    </div>
  );
}