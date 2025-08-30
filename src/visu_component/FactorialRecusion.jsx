import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Helper Components ---

const CodeBlock = ({ highlightedLine }) => {
  const code = [
    'function factorial(n) {',
    '  if (n <= 1) {',
    '    return 1;',
    '  }',
    '  return n * factorial(n - 1);',
    '}',
  ];

  return (
    <div className="code-block bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-5 overflow-x-auto">
      <pre>
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

export default function FactorialVisualizer() {
  const [number, setNumber] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(700); // ms
  const [finalResult, setFinalResult] = useState(null);
  const treeContainerRef = useRef(null); // Ref for tree container to measure dimensions

  // Calculate tree translation and scale to fit
  const getTreeTransform = useCallback((nodes) => {
    if (!treeContainerRef.current || nodes.length === 0) return { transform: 'scale(1) translate(0px, 0px)' };

    const containerWidth = treeContainerRef.current.clientWidth;
    const containerHeight = treeContainerRef.current.clientHeight;

    const minX = Math.min(...nodes.map(node => node.x));
    const maxX = Math.max(...nodes.map(node => node.x));
    const minY = Math.min(...nodes.map(node => node.y));
    const maxY = Math.max(...nodes.map(node => node.y));

    const treeWidth = maxX - minX + 50; // Add node width
    const treeHeight = maxY - minY + 50; // Add node height

    let scale = 1;
    if (treeWidth > containerWidth || treeHeight > containerHeight) {
      scale = Math.min(containerWidth / treeWidth, containerHeight / treeHeight) * 0.9; // 90% of max fit
    }

    const translateX = (containerWidth / 2) - ((minX + maxX) / 2) * scale;
    const translateY = (containerHeight / 2) - ((minY + maxY) / 2) * scale;
    
    return {
      transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
      transformOrigin: 'top left'
    };
  }, []);


  const generateSteps = useCallback((n) => {
    const newSteps = [];
    const tree = { nodes: [], edges: [] };
    let nodeId = 0;

    function trace(num, parentId = null, depth = 0) {
      const currentId = nodeId++;
      const node = { id: currentId, label: `f(${num})`, x: 0, y: 0, status: 'calling', result: null };
      
      // Basic positioning for the tree, adjust dynamically for responsiveness
      // More sophisticated positioning logic might be needed for very large N
      node.y = depth * 80; // Deeper nodes are lower
      
      if (parentId !== null) {
        const parentNode = tree.nodes.find(node => node.id === parentId);
        if (parentNode) {
          // Simple horizontal spread based on depth and position of parent
          const childrenAtThisLevel = tree.edges.filter(e => e.from === parentId).length;
          const horizontalOffset = (childrenAtThisLevel - 0.5) * 60 * Math.pow(1.2, (n - depth)); // Wider spread for lower levels
          node.x = parentNode.x + (num % 2 === 0 ? horizontalOffset : -horizontalOffset) ;
        }
      } else {
        node.x = 0; // Root node starts at 0,0 and gets centered by transform
      }
      
      tree.nodes.push(node);
      if (parentId !== null) {
        tree.edges.push({ from: parentId, to: currentId });
      }

      // Step 1: Calling the function
      newSteps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        stack: tree.nodes.filter(node => !node.result).map(node => node.label), // Only active calls on stack
        highlightedLine: 4,
        explanation: `Calling factorial(${num}). Pushing f(${num}) to the stack.`
      });

      if (num <= 1) {
        // Step 2: Base Case Reached
        tree.nodes[currentId].status = 'base-case';
        newSteps.push({
          tree: JSON.parse(JSON.stringify(tree)),
          stack: tree.nodes.filter(node => !node.result).map(node => node.label),
          highlightedLine: 1,
          explanation: `Base case n <= 1 is true. Returning 1.`
        });

        // Step 3: Returning from Base Case
        tree.nodes[currentId].status = 'returning';
        tree.nodes[currentId].result = 1;
        const currentStack = tree.nodes.filter(node => !node.result).map(node => node.label); // Before pop
        currentStack.pop(); // Simulate pop for this step's stack
        
        newSteps.push({
          tree: JSON.parse(JSON.stringify(tree)),
          stack: currentStack,
          highlightedLine: 2,
          explanation: `f(${num}) returns 1. Popping from stack.`
        });
        return 1;
      }

      const returnValue = trace(num - 1, currentId, depth + 1);
      const result = num * returnValue;

      // Step 4: Returning from recursive call
      tree.nodes[currentId].status = 'returning';
      tree.nodes[currentId].result = result;
      const currentStack = tree.nodes.filter(node => !node.result).map(node => node.label); // Before pop
      currentStack.pop(); // Simulate pop for this step's stack

      newSteps.push({
        tree: JSON.parse(JSON.stringify(tree)),
        stack: currentStack,
        highlightedLine: 4,
        explanation: `f(${num-1}) returned ${returnValue}. Calculating ${num} * ${returnValue} = ${result}. Returning ${result}.`
      });

      return result;
    }

    // Reset nodeId for a fresh tree generation
    nodeId = 0;
    const result = trace(n);
    
    // Final step
    newSteps.push({
      tree: { nodes: [], edges: [] },
      stack: [],
      highlightedLine: -1,
      explanation: `Recursion complete. Final result: ${n}! = ${result}.`
    });

    setFinalResult(result);
    setSteps(newSteps);
  }, []);

  const handleVisualize = () => {
    const n = parseInt(number, 10);
    if (isNaN(n) || n < 0 || n > 12) {
      alert("Please enter a number between 0 and 12 for effective visualization.");
      return;
    }
    setCurrentStep(0);
    setFinalResult(null);
    generateSteps(n);
    setIsPlaying(true);
  };
  
  const handleRandom = () => {
    const randomNum = Math.floor(Math.random() * 10) + 1; // 1 to 10
    setNumber(randomNum);
  }

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    setFinalResult(null);
    setNumber(5); // Reset input number as well
  };
  
  const handleSpeedChange = (e) => {
    setSpeed(1500 - parseInt(e.target.value, 10)); // Invert slider for intuitive speed control
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === steps.length - 1 && steps.length > 0) {
      setIsPlaying(false); // Auto-pause at the end
    }
  }, [isPlaying, currentStep, steps, speed]);

  const currentFrame = steps[currentStep] || { tree: { nodes: [], edges: [] }, stack: [], highlightedLine: -1, explanation: "Enter a number and click Visualize to start." };

  const treeTransformStyle = getTreeTransform(currentFrame.tree.nodes);

  return (
    <div className="visualizer-container bg-white dark:bg-black text-black dark:text-white min-h-screen p-5">
      {/* --- CONTROLS --- */}
      <div className="controls-panel flex flex-col sm:flex-row justify-between items-center gap-4 pb-5 mb-5 border-b border-gray-300 dark:border-gray-700">
        <div className="flex flex-wrap gap-3">
          <input
            type="number"
            value={number}
            onChange={e => setNumber(e.target.value)}
            min="0"
            max="12"
            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full sm:w-auto"
            aria-label="Enter number for factorial"
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto"
            onClick={handleVisualize}
            disabled={isPlaying}
          >
            Visualize
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto"
            onClick={handleRandom}
            disabled={isPlaying}
          >
            Random
          </button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={steps.length === 0}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto"
            onClick={handleReset}
          >
            Reset
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm">Speed: Slow</span>
            <input
              type="range"
              min="0"
              max="1300"
              value={1500 - speed}
              onChange={handleSpeedChange}
              disabled={isPlaying}
              className="w-24 sm:w-32 accent-indigo-500"
              aria-label="Animation speed"
            />
            <span className="text-sm">Fast</span>
          </div>
        </div>
      </div>

      <div className="main-content flex flex-col lg:flex-row gap-5 mt-5">
        {/* --- VISUALIZATION AREA --- */}
        <div className="visualization-area flex-grow lg:flex-[3] flex flex-col gap-5">
          <div ref={treeContainerRef} className="tree-container bg-gray-100 dark:bg-gray-800 rounded-lg p-5 min-h-[350px] relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-indigo-600 dark:text-indigo-400">Recursion Tree</h2>
            <svg width="100%" height="100%" className="absolute top-0 left-0" style={treeTransformStyle}>
              {currentFrame.tree.edges.map((edge, i) => {
                const fromNode = currentFrame.tree.nodes.find(n => n.id === edge.from);
                const toNode = currentFrame.tree.nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                return (
                  <line
                    key={i}
                    x1={fromNode.x + 25} y1={fromNode.y + 50}
                    x2={toNode.x + 25} y2={toNode.y}
                    stroke="currentColor" // Use current text color for lines
                    className="text-gray-500 dark:text-gray-400"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
            {currentFrame.tree.nodes.map(node => (
              <div
                key={node.id}
                className={`node absolute rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm transition-all duration-500 ease-in-out border-2
                  ${node.status === 'calling' ? 'bg-indigo-500 text-white border-indigo-300' : ''}
                  ${node.status === 'base-case' ? 'bg-green-500 text-white border-green-300' : ''}
                  ${node.status === 'returning' ? 'bg-purple-500 text-white border-purple-300' : ''}
                  ${!node.status ? 'bg-gray-400 dark:bg-gray-600 text-white border-gray-300 dark:border-gray-500' : ''}
                `}
                style={{ left: `${node.x}px`, top: `${node.y}px`, ...treeTransformStyle }}
              >
                {node.label}
                {node.result !== null && <span className="absolute -bottom-5 text-purple-600 dark:text-purple-400 text-xs">{node.result}</span>}
              </div>
            ))}
          </div>
          <div className="stack-container bg-gray-100 dark:bg-gray-800 rounded-lg p-5 min-h-[250px] flex flex-col">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-indigo-600 dark:text-indigo-400">Call Stack</h2>
            <div className="stack-box flex flex-col-reverse items-center flex-grow justify-end">
              {currentFrame.stack.map((item, index) => (
                <div key={index} className="stack-item bg-indigo-500 text-white px-3 py-2 rounded-md my-1 w-24 text-center transition-all duration-500 ease-out animate-stack-push">
                  {item}
                </div>
              ))}
            </div>
            {/* Tailwind equivalent for keyframes (simplified, might need external CSS for complex ones) */}
            <style>{`
              @keyframes stack-push {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-stack-push { animation: stack-push 0.3s ease-out forwards; }
            `}</style>
          </div>
        </div>

        {/* --- SIDE PANEL --- */}
        <div className="side-panel lg:flex-[2] bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-indigo-600 dark:text-indigo-400">Execution Flow</h2>
            <CodeBlock highlightedLine={currentFrame.highlightedLine} />
            <h3 className="text-lg font-medium mt-6 mb-3 text-indigo-600 dark:text-indigo-400">Explanation</h3>
            <div className="explanation-box bg-gray-200 dark:bg-gray-700 rounded-md p-4 min-h-[80px] text-gray-700 dark:text-gray-300 italic">
                {currentFrame.explanation}
            </div>
        </div>
      </div>

      {/* --- INFORMATION PANEL --- */}
      <div className="info-panel grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        <div className="info-card bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">Result</h3>
          <p className="text-gray-800 dark:text-gray-200">{finalResult !== null ? `${number}! = ${finalResult}` : 'Pending...'}</p>
        </div>
        <div className="info-card bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">Time Complexity: O(n)</h3>
          <p className="text-gray-800 dark:text-gray-200">The function is called once for each number from $n$ down to 1. This means the number of operations grows linearly with the input $n$.</p>
        </div>
        <div className="info-card bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">Space Complexity: O(n)</h3>
          <p className="text-gray-800 dark:text-gray-200">Each function call is stored on the call stack until it returns. At its deepest point, the stack holds $n$ calls, so memory usage grows linearly with $n$.</p>
        </div>
      </div>
    </div>
  );
}