import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Helper Components ---
const CodeBlock = ({ highlightedLine }) => {
  const code = [
    'function hanoi(n, src, dest, aux) {',
    '  if (n === 1) {',
    '    moveDisk(src, dest);',
    '    return;',
    '  }',
    '  hanoi(n - 1, src, aux, dest);',
    '  moveDisk(src, dest);',
    '  hanoi(n - 1, aux, dest, src);',
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
export default function TowerOfHanoi() {
  const [diskCount, setDiskCount] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(700);
  const [totalMoves, setTotalMoves] = useState(0);
  const treeContainerRef = useRef(null);

  const getTreeTransform = useCallback((nodes) => {
    if (!treeContainerRef.current || nodes.length === 0) return { transform: 'scale(1)' };
    const containerWidth = treeContainerRef.current.clientWidth;
    const padding = 20;
    const minX = Math.min(...nodes.map(node => node.x));
    const maxX = Math.max(...nodes.map(node => node.x));
    const treeWidth = maxX - minX + 100;
    let scale = 1;
    if (treeWidth > containerWidth - padding * 2) {
      scale = (containerWidth - padding * 2) / treeWidth;
    }
    const translateX = (containerWidth / 2) - (minX + (treeWidth - 100) / 2) * scale;
    return {
      transform: `translate(${translateX}px, ${padding}px) scale(${scale})`,
      transformOrigin: 'top left'
    };
  }, []);

  const generateSteps = useCallback((n) => {
    let newSteps = [];
    let tree = { nodes: [], edges: [] };
    let nodeIdCounter = 0;
    let callStack = [];
    let moveCounter = 0;

    let rods = {
      A: Array.from({ length: n }, (_, i) => n - i),
      B: [],
      C: [],
    };

    function trace(num, src, dest, aux, parentId = null, depth = 0, xOffset = 0) {
      const currentId = nodeIdCounter++;
      const horizontalSpread = 300 * Math.pow(0.6, depth);
      const node = {
        id: currentId,
        label: `h(${num}, ${src}, ${dest})`,
        x: xOffset,
        y: depth * 80,
        status: 'calling',
      };
      tree.nodes.push(node);
      if (parentId !== null) tree.edges.push({ from: parentId, to: currentId });
      
      callStack.push(node.label);
      newSteps.push({
        rods: JSON.parse(JSON.stringify(rods)),
        tree: JSON.parse(JSON.stringify(tree)),
        stack: [...callStack],
        highlightedLine: num > 1 ? 5 : 1,
        explanation: `Calling hanoi(${num}, from '${src}', to '${dest}').`
      });

      if (num === 1) {
        node.status = 'base-case';
        const diskToMove = rods[src].pop();
        rods[dest].push(diskToMove);
        moveCounter++;
        newSteps.push({
          rods: JSON.parse(JSON.stringify(rods)),
          tree: JSON.parse(JSON.stringify(tree)),
          stack: [...callStack],
          highlightedLine: 2,
          explanation: `Move disk ${diskToMove} from '${src}' to '${dest}'. (${moveCounter} moves)`
        });
        callStack.pop();
        node.status = 'returning';
        return;
      }

      trace(num - 1, src, aux, dest, currentId, depth + 1, xOffset - horizontalSpread);
      
      node.status = 'waiting';
      const diskToMove = rods[src].pop();
      rods[dest].push(diskToMove);
      moveCounter++;
      newSteps.push({
        rods: JSON.parse(JSON.stringify(rods)),
        tree: JSON.parse(JSON.stringify(tree)),
        stack: [...callStack],
        highlightedLine: 6,
        explanation: `Move disk ${diskToMove} from '${src}' to '${dest}'. (${moveCounter} moves)`
      });

      trace(num - 1, aux, dest, src, currentId, depth + 1, xOffset + horizontalSpread);

      callStack.pop();
      node.status = 'returning';
      newSteps.push({
        rods: JSON.parse(JSON.stringify(rods)),
        tree: JSON.parse(JSON.stringify(tree)),
        stack: [...callStack],
        highlightedLine: -1,
        explanation: `Returning from hanoi(${num}, from '${src}', to '${dest}').`
      });
    }

    newSteps.push({ rods: JSON.parse(JSON.stringify(rods)), tree, stack: [], highlightedLine: -1, explanation: "Starting..." });
    trace(n, 'A', 'C', 'B');
    newSteps.push({ rods: JSON.parse(JSON.stringify(rods)), tree: { nodes: [], edges: [] }, stack: [], highlightedLine: -1, explanation: `Complete! Total moves: ${moveCounter}.` });
    
    setTotalMoves(moveCounter);
    setSteps(newSteps);
  }, []);

  const handleVisualize = () => {
    const n = parseInt(diskCount, 10);
    if (isNaN(n) || n < 1 || n > 5) {
      alert("Please enter a number of disks between 1 and 5.");
      return;
    }
    handleReset();
    setTimeout(() => {
        generateSteps(n);
        setIsPlaying(true);
    }, 100);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    setTotalMoves(0);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps, speed]);

  const currentFrame = steps[currentStep] || { rods: { A: Array.from({ length: diskCount }, (_, i) => diskCount - i), B: [], C: [] }, tree: { nodes: [], edges: [] }, stack: [], highlightedLine: -1, explanation: "Enter the number of disks and click Visualize." };
  const treeTransformStyle = getTreeTransform(currentFrame.tree.nodes);
  const diskColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen p-2 sm:p-5 font-sans">
        {/* --- CONTROLS --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-5 mb-5 border-b border-gray-300 dark:border-gray-700">
            <div className="flex flex-wrap gap-3">
                <input type="number" value={diskCount} onChange={e => setDiskCount(e.target.value)} min="1" max="5" className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full sm:w-auto" aria-label="Number of disks"/>
                <button onClick={handleVisualize} disabled={isPlaying} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto">Visualize</button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
                <button onClick={() => setIsPlaying(!isPlaying)} disabled={steps.length === 0} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto">{isPlaying ? 'Pause' : 'Play'}</button>
                <button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full sm:w-auto">Reset</button>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Speed</span>
                    <input type="range" min="0" max="1300" defaultValue={1500 - speed} onChange={(e) => setSpeed(1500 - parseInt(e.target.value))} disabled={isPlaying} className="w-24 sm:w-32 accent-indigo-500" aria-label="Animation speed"/>
                </div>
            </div>
        </div>
      
        {/* --- MAIN VISUALIZATION: RODS --- */}
        <div className="rods-container bg-gray-100 dark:bg-gray-800 rounded-lg p-5 min-h-[250px] flex justify-around items-end">
            {['A', 'B', 'C'].map(rodId => (
                <div key={rodId} className="rod flex flex-col-reverse items-center w-1/3 h-48">
                    <div className="rod-base w-full h-2 bg-gray-400 dark:bg-gray-600 rounded-t-md"></div>
                    {currentFrame.rods[rodId].map(disk => (
                        <div key={disk} className="disk rounded-md h-5 mb-1 text-white flex items-center justify-center text-xs font-bold transition-all duration-300"
                            style={{ width: `${disk * 15 + 30}%`, backgroundColor: diskColors[disk - 1] }}>
                            {disk}
                        </div>
                    ))}
                    <div className="rod-label mt-2 font-bold text-lg">{rodId}</div>
                </div>
            ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-5 mt-5">
            {/* --- VISUALIZATION AREA: TREE & STACK --- */}
            <div className="flex-grow lg:flex-[3] flex flex-col gap-5">
                <div ref={treeContainerRef} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 sm:p-5 min-h-[300px] relative overflow-hidden">
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-indigo-600 dark:text-indigo-400">Recursion Tree</h2>
                    <div style={{...treeTransformStyle, position: 'relative', width: '100%', height: '100%'}}>
                        <svg width="100%" height="100%" className="absolute top-0 left-0" style={{overflow: 'visible'}}>
                            {currentFrame.tree.edges.map((edge, i) => {
                                const fromNode = currentFrame.tree.nodes.find(n => n.id === edge.from);
                                const toNode = currentFrame.tree.nodes.find(n => n.id === edge.to);
                                if (!fromNode || !toNode) return null;
                                return <line key={i} x1={fromNode.x + 50} y1={fromNode.y + 20} x2={toNode.x + 50} y2={toNode.y} stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2"/>;
                            })}
                        </svg>
                        {currentFrame.tree.nodes.map(node => (
                            <div key={node.id} className={`absolute rounded-md w-24 h-10 flex items-center justify-center font-bold text-xs transition-all duration-500 ease-in-out border-2
                                ${node.status === 'calling' ? 'bg-indigo-500 text-white border-indigo-300' : ''}
                                ${node.status === 'base-case' ? 'bg-green-500 text-white border-green-300' : ''}
                                ${node.status === 'returning' ? 'bg-purple-500 text-white border-purple-300' : ''}
                                ${node.status === 'waiting' ? 'bg-yellow-500 text-white border-yellow-300' : ''}
                            `} style={{ left: `${node.x}px`, top: `${node.y}px` }}>{node.label}</div>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5 min-h-[250px] flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 text-indigo-600 dark:text-indigo-400">Call Stack</h2>
                    <div className="flex flex-col-reverse items-center flex-grow justify-end">
                        {currentFrame.stack.map((item, index) => <div key={index} className="bg-indigo-500 text-white px-3 py-1.5 rounded-md my-1 w-40 text-center text-xs animate-stack-push">{item}</div>)}
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
                <h3 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">Total Moves</h3>
                <p className="text-gray-800 dark:text-gray-200">{totalMoves > 0 ? `${totalMoves}` : 'Pending...'}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-2 text-red-500 dark:text-red-400">Time Complexity: $O(2^n)$</h3>
                <p className="text-gray-800 dark:text-gray-200">To move $n$ disks, we perform two recursive calls for $n-1$ disks and one move. The number of moves is $2^n - 1$, which leads to exponential time complexity.</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-2 text-green-500 dark:text-green-400">Space Complexity: $O(n)$</h3>
                <p className="text-gray-800 dark:text-gray-200">The memory usage is determined by the maximum depth of the recursion. Since we must go $n$ levels deep, the call stack grows linearly with the number of disks.</p>
            </div>
        </div>
        <style>{`@keyframes stack-push { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-stack-push { animation: stack-push 0.3s ease-out forwards; }`}</style>
    </div>
  );
}