import React, { useState } from 'react';

// --- Helper Components ---
const CodeBlock = () => {
  const code = [
    'class Stack {',
    '  constructor() {',
    '    this.items = [];',
    '  }',
    '  push(item) {',
    '    this.items.push(item);',
    '  }',
    '  pop() {',
    '    if (this.isEmpty()) return null;',
    '    return this.items.pop();',
    '  }',
    '  peek() {',
    '    return this.items[this.items.length - 1];',
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
export default function Stack() {
  const MAX_SIZE = 8;
  const [stack, setStack] = useState(['A', 'B', 'C']);
  const [inputValue, setInputValue] = useState('');
  const [poppedValue, setPoppedValue] = useState(null);
  const [peekValue, setPeekValue] = useState(null);
  const [message, setMessage] = useState('Stack initialized. Try the operations!');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handlePush = () => {
    if (!inputValue) {
      setMessage('Input value cannot be empty.');
      return;
    }
    if (stack.length >= MAX_SIZE) {
      setMessage(`Error: Stack is full (max size: ${MAX_SIZE}).`);
      return;
    }

    setStack([...stack, inputValue]);
    setMessage(`Pushed '${inputValue}' onto the stack.`);
    setInputValue('');
    setPoppedValue(null);
    setPeekValue(null);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage('Error: Stack is empty. Cannot pop.');
      return;
    }

    const newStack = [...stack];
    const popped = newStack.pop();
    
    setStack(newStack);
    setPoppedValue(popped);
    setPeekValue(null);
    setMessage(`Popped '${popped}' from the stack.`);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
        setMessage('Error: Stack is empty. Nothing to peek.');
        return;
    }
    const topValue = stack[stack.length - 1];
    setPeekValue(topValue);
    setPoppedValue(null);
    setMessage(`Top element is '${topValue}'.`);
    setHighlightedIndex(stack.length - 1);
    setTimeout(() => setHighlightedIndex(-1), 1500); // Highlight for 1.5s
  };

  const handleClear = () => {
    setStack([]);
    setMessage('Stack has been cleared.');
    setPoppedValue(null);
    setPeekValue(null);
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen p-2 sm:p-5 font-sans">
      <style>{`
        @keyframes push-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-push-in { animation: push-in 0.4s ease-out forwards; }
      `}</style>
      
      {/* --- TITLE & DESCRIPTION --- */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">Stack Visualizer</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">A Stack is a Last-In, First-Out (LIFO) data structure. The last element added is the first one to be removed.</p>
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
                onKeyPress={(e) => e.key === 'Enter' && handlePush()}
                placeholder="Enter value"
                className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2"
              />
              <button onClick={handlePush} disabled={stack.length >= MAX_SIZE} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed">Push</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={handlePop} disabled={stack.length === 0} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed">Pop</button>
              <button onClick={handlePeek} disabled={stack.length === 0} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed">Peek</button>
              <button onClick={handleClear} disabled={stack.length === 0} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed">Clear</button>
            </div>
          </div>
          
          <div className="status mt-6 space-y-3">
            <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
              <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">Status</h3>
              <p className="text-sm italic">{message}</p>
            </div>
             <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
              <h3 className="font-semibold">Popped Value</h3>
              <p className="text-2xl font-mono text-red-500">{poppedValue || '—'}</p>
            </div>
             <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
              <h3 className="font-semibold">Peek Value</h3>
              <p className="text-2xl font-mono text-yellow-500">{peekValue || '—'}</p>
            </div>
          </div>
        </div>

        {/* --- VISUALIZATION --- */}
        <div className="visualization-area lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 min-h-[500px] flex flex-col items-center justify-end">
          <div className="w-48 h-full flex flex-col-reverse items-center gap-2 border-x-4 border-b-4 border-gray-400 dark:border-gray-600 rounded-b-md p-2">
            {stack.map((item, index) => (
              <div 
                key={index}
                className={`w-full h-12 flex items-center justify-center font-bold text-lg text-white rounded-md transition-all duration-300
                  ${index === stack.length - 1 ? 'animate-push-in' : ''}
                  ${index === highlightedIndex ? 'shadow-lg shadow-yellow-400/50 ring-4 ring-yellow-400' : ''}
                  bg-indigo-500
                `}
              >
                {item}
              </div>
            ))}
             <div className="absolute bottom-2 right-2 text-xs text-gray-500">Top</div>
             <div className="absolute top-2 right-2 text-xs text-gray-500">Bottom</div>
          </div>
          <div className="mt-2 font-semibold text-gray-600 dark:text-gray-400">
            Size: {stack.length} / {MAX_SIZE}
          </div>
        </div>
      </div>
      
      {/* --- CODE & INFO --- */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Stack Implementation in JavaScript</h2>
        <CodeBlock />
      </div>
    </div>
  );
}