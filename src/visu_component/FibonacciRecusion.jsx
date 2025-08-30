import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Helper Components ---

const CodeBlock = ({ highlightedLine }) => {
  const code = [
    'function fibonacci(n) {',
    '  if (n <= 1) {',
    '    return n;',
    '  }',
    '  return fibonacci(n - 1) + fibonacci(n - 2);',
    '}',
  ];

  return (
    <div className="code-block bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-5 overflow-x-auto">
      <pre className="m-0">
        {code.map((line, index) => (
          <code key={index} className={`block transition-colors duration-300 ${highlightedLine === index ? 'bg-indigo-200 dark:bg-indigo-700' : ''}`}>
            {`${line}\n`}
          </code>
        ))}
      </pre>
    </div>
  );
};

// --- Main Visualizer Component ---

export default function FibonacciRecursion() {
  const [number, setNumber] = useState(6);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(700);
  const [finalResult, setFinalResult] = useState(null);
  const treeContainerRef = useRef(null);

  const getTreeTransform = useCallback((nodes) => {
    if (!treeContainerRef.current || nodes.length === 0) return { transform: 'scale(1) translate(0px, 0px)' };

    const containerWidth = treeContainerRef.current.clientWidth;
    const padding = 20;

    const minX = Math.min(...nodes.map(node => node.x));
    const maxX = Math.max(...nodes.map(node => node.x));
    const maxY = Math.max(...nodes.map(node => node.y));

    const treeWidth = maxX - minX + 50;
    const treeHeight = maxY + 50;
    
    let scale = 1;
    if (treeWidth > containerWidth - padding * 2) {
      scale = (containerWidth - padding * 2) / treeWidth;
    }

    const translateX = (containerWidth / 2) - (minX + (treeWidth - 50) / 2) * scale;
    const translateY = padding;

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      transformOrigin: 'top left'
    };
  }, []);

  const generateSteps = useCallback((n) => {
    let newSteps = [];
    let tree = { nodes: [], edges: [] };
    let nodeIdCounter = 0;
    let callStack = [];

    function trace(num, parentId = null, depth = 0, xOffset = 0) {
      const currentId = nodeIdCounter++;
      const horizontalSpread = 250 * Math.pow(0.7, depth);
      const node = {
        id: currentId,
        label: `fib(${num})`,
        x: xOffset,
        y: depth * 80,
        status: 'calling',
        result: null
      };
      
      tree.nodes.push(node);
      if (parentId !== null) {
        tree.edges.push({ from: parentId, to: currentId });
      }
      
      callStack.push(node.label);
      newSteps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        stack: [...callStack],
        highlightedLine: 4,
        explanation: `Calling fib(${num}). Pushing to stack.`
      });

      if (num <= 1) {
        node.status = 'base-case';
        node.result = num;
        newSteps.push({
          tree: JSON.parse(JSON.stringify(tree)),
          stack: [...callStack],
          highlightedLine: 1,
          explanation: `Base case n <= 1 is true for fib(${num}).`
        });
        
        callStack.pop();
        newSteps.push({
          tree: JSON.parse(JSON.stringify(tree)),
          stack: [...callStack],
          highlightedLine: 2,
          explanation: `fib(${num}) returns ${num}. Popping from stack.`
        });
        node.status = 'returning';
        return num;
      }
      
      newSteps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        stack: [...callStack],
        highlightedLine: 4,
        explanation: `Calling fib(${num - 1}) first...`
      });
      const leftValue = trace(num - 1, currentId, depth + 1, xOffset - horizontalSpread);

      tree.nodes.find(n => n.id === currentId).status = 'waiting';
      newSteps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        stack: [...callStack],
        highlightedLine: 4,
        explanation: `fib(${num - 1}) returned ${leftValue}. Now calling fib(${num - 2})...`
      });
      const rightValue = trace(num - 2, currentId, depth + 1, xOffset + horizontalSpread);

      tree.nodes.find(n => n.id === currentId).status = 'calculating';
      const result = leftValue + rightValue;
      node.result = result;
      newSteps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        stack: [...callStack],
        highlightedLine: 4,
        explanation: `fib(${num - 2}) returned ${rightValue}. Calculating ${leftValue} + ${rightValue} = ${result}.`
      });
      
      callStack.pop();
      newSteps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        stack: [...callStack],
        highlightedLine: 4,
        explanation: `fib(${num}) returns ${result}. Popping from stack.`
      });
      node.status = 'returning';
      return result;
    }

    const result = trace(n);
    newSteps.push({
      tree: { nodes: [], edges: [] },
      stack: [],
      highlightedLine: -1,
      explanation: `Recursion complete! Final result: ${result}.`
    });

    setFinalResult(result);
    setSteps(newSteps);
  }, []);
  
  const handleVisualize = () => {
    const n = parseInt(number, 10);
    if (isNaN(n) || n < 0 || n > 9) {
      alert("Please enter a number between 0 and 9 for effective visualization.");
      return;
    }
    handleReset();
    setTimeout(() => {
        generateSteps(n);
        setIsPlaying(true);
    }, 100)
  };

  const handleRandom = () => setNumber(Math.floor(Math.random() * 7) + 2); // 2 to 8

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    setFinalResult(null);
  };

  const handleSpeedChange = (e) => setSpeed(1500 - parseInt(e.target.value, 10));

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps, speed]);

  const currentFrame = steps[currentStep] || { tree: { nodes: [], edges: [] }, stack: [], highlightedLine: -1, explanation: "Enter a number and click Visualize." };
  const treeTransformStyle = getTreeTransform(currentFrame.tree.nodes);
  
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen p-5 font-sans">
      {/* --- CONTROLS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-5 mb-5 border-b border-gray-300 dark:border-gray-700">
        <div className="flex flex-wrap gap-3">
          <input type="number" value={number} onChange={e => setNumber(e.target.value)} min="0" max="9" className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full sm:w-auto" aria-label="Enter number for Fibonacci"/>
          <button onClick={handleVisualize} disabled={isPlaying} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto">Visualize</button>
          <button onClick={handleRandom} disabled={isPlaying} className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto">Random</button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button onClick={() => setIsPlaying(!isPlaying)} disabled={steps.length === 0} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto">{isPlaying ? 'Pause' : 'Play'}</button>
          <button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto">Reset</button>
          <div className="flex items-center gap-2">
            <span className="text-sm">Slow</span>
            <input type="range" min="0" max="1300" value={1500 - speed} onChange={handleSpeedChange} disabled={isPlaying} className="w-24 sm:w-32 accent-indigo-500" aria-label="Animation speed"/>
            <span className="text-sm">Fast</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 mt-5">
        {/* --- VISUALIZATION AREA --- */}
        <div className="flex-grow lg:flex-[3] flex flex-col gap-5">
          <div ref={treeContainerRef} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 sm:p-5 min-h-[600px]  relative overflow-auto">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-indigo-600 dark:text-indigo-400">Recursion Tree 🌳</h2>
            <div style={{...treeTransformStyle, position: 'relative', width: '100%', height: '100%'}}>
              <svg width="100%" height="100%" className="absolute top-0 left-0" style={{overflow: 'visible'}}>
                {currentFrame.tree.edges.map((edge, i) => {
                  const fromNode = currentFrame.tree.nodes.find(n => n.id === edge.from);
                  const toNode = currentFrame.tree.nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  return <line key={i} x1={fromNode.x + 25} y1={fromNode.y + 50} x2={toNode.x + 25} y2={toNode.y} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2"/>;
                })}
              </svg>
              {currentFrame.tree.nodes.map(node => (
                <div key={node.id} className={`absolute rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm transition-all duration-500 ease-in-out border-2
                  ${node.status === 'calling' ? 'bg-indigo-500 text-white border-indigo-300' : ''}
                  ${node.status === 'base-case' ? 'bg-green-500 text-white border-green-300' : ''}
                  ${node.status === 'returning' ? 'bg-purple-500 text-white border-purple-300' : ''}
                  ${node.status === 'waiting' ? 'bg-yellow-500 text-white border-yellow-300' : ''}
                  ${node.status === 'calculating' ? 'bg-blue-500 text-white border-blue-300' : ''}
                `} style={{ left: `${node.x}px`, top: `${node.y}px` }}>
                  {node.label}
                  {node.result !== null && <span className="absolute -bottom-5 text-purple-600 dark:text-purple-400 text-xs font-bold">{node.result}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5 min-h-[250px] flex flex-col">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-indigo-600 dark:text-indigo-400">Call Stack</h2>
            <div className="flex flex-col-reverse items-center flex-grow justify-end">
              {currentFrame.stack.map((item, index) => <div key={index} className="bg-indigo-500 text-white px-3 py-2 rounded-md my-1 w-24 text-center animate-stack-push">{item}</div>)}
            </div>
          </div>
        </div>

        {/* --- SIDE PANEL --- */}
        <div className="lg:flex-[2] bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-indigo-600 dark:text-indigo-400">Execution Flow</h2>
            <CodeBlock highlightedLine={currentFrame.highlightedLine} />
            <h3 className="text-lg font-medium mt-6 mb-3 text-indigo-600 dark:text-indigo-400">Explanation</h3>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-4 min-h-[80px] text-gray-700 dark:text-gray-300 italic">{currentFrame.explanation}</div>
        </div>
      </div>

      {/* --- INFORMATION PANEL --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">Result</h3>
          <p className="text-gray-800 dark:text-gray-200">{finalResult !== null ? `fib(${number}) = ${finalResult}` : 'Pending...'}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-2 text-red-500 dark:text-red-400">Time Complexity: $O(2^n)$</h3>
          <p className="text-gray-800 dark:text-gray-200">The function branches twice for each call. This leads to an exponential number of operations as $n$ increases because the same values (e.g., `fib(2)`) are calculated over and over again.</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-2 text-green-500 dark:text-green-400">Space Complexity: $O(n)$</h3>
          <p className="text-gray-800 dark:text-gray-200">Although many calls are made, the maximum depth of the call stack at any one time is proportional to $n$. Memory usage only depends on the deepest path, not the total number of calls.</p>
        </div>
      </div>
      <style>{`@keyframes stack-push { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-stack-push { animation: stack-push 0.3s ease-out forwards; }`}</style>
    </div>
  );
}