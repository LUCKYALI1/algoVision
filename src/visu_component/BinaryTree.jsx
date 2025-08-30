import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

// --- Static Tree Data ---
const treeData = {
  value: 'F',
  left: {
    value: 'B',
    left: { value: 'A' },
    right: {
      value: 'D',
      left: { value: 'C' },
      right: { value: 'E' },
    },
  },
  right: {
    value: 'G',
    right: {
      value: 'I',
      left: { value: 'H' },
    },
  },
};

// --- Traversal Logic ---
const getInOrderPath = (node, path = []) => {
  if (node.left) getInOrderPath(node.left, path);
  path.push(node.value);
  if (node.right) getInOrderPath(node.right, path);
  return path;
};

const getPreOrderPath = (node, path = []) => {
  path.push(node.value);
  if (node.left) getPreOrderPath(node.left, path);
  if (node.right) getPreOrderPath(node.right, path);
  return path;
};

const getPostOrderPath = (node, path = []) => {
  if (node.left) getPostOrderPath(node.left, path);
  if (node.right) getPostOrderPath(node.right, path);
  path.push(node.value);
  return path;
};

const getLevelOrderPath = (root) => {
  if (!root) return [];
  const path = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    path.push(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return path;
};

// --- Recursive TreeNode Component ---
const TreeNode = ({ node, visitedNodes, nodeRefs }) => {
  const isVisited = visitedNodes.includes(node.value);
  
  return (
    <div className="flex flex-col items-center relative px-2">
      <div
        ref={el => nodeRefs.current[node.value] = el}
        className={`node w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center font-bold text-lg rounded-full border-2 transition-all duration-300
          ${isVisited ? 'bg-emerald-500 text-white border-emerald-300' : 'bg-sky-500 text-white border-sky-300'}
        `}
      >
        {node.value}
      </div>
      <div className="children flex mt-8">
        {node.left && <TreeNode node={node.left} visitedNodes={visitedNodes} nodeRefs={nodeRefs} />}
        {node.right && <TreeNode node={node.right} visitedNodes={visitedNodes} nodeRefs={nodeRefs} />}
      </div>
    </div>
  );
};

// --- Main Visualizer Component ---
export default function BinaryTree() {
  const [traversalPath, setTraversalPath] = useState([]);
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [traversalType, setTraversalType] = useState('');
  const [lines, setLines] = useState([]);
  
  const nodeRefs = useRef({});
  const animationInterval = useRef(null);

  useLayoutEffect(() => {
    const newLines = [];
    const queue = [treeData];
    while(queue.length > 0) {
        const node = queue.shift();
        const parentEl = nodeRefs.current[node.value];
        if (node.left) {
            const childEl = nodeRefs.current[node.left.value];
            if(parentEl && childEl) {
                newLines.push({x1: parentEl.offsetLeft + parentEl.offsetWidth / 2, y1: parentEl.offsetTop + parentEl.offsetHeight, x2: childEl.offsetLeft + childEl.offsetWidth / 2, y2: childEl.offsetTop});
            }
            queue.push(node.left);
        }
        if (node.right) {
            const childEl = nodeRefs.current[node.right.value];
            if(parentEl && childEl) {
                 newLines.push({x1: parentEl.offsetLeft + parentEl.offsetWidth / 2, y1: parentEl.offsetTop + parentEl.offsetHeight, x2: childEl.offsetLeft + childEl.offsetWidth / 2, y2: childEl.offsetTop});
            }
            queue.push(node.right);
        }
    }
    setLines(newLines);
  }, []);

  const startAnimation = (path) => {
    handleReset();
    let index = 0;
    animationInterval.current = setInterval(() => {
      if (index < path.length) {
        setAnimatedNodes(prev => [...prev, path[index]]);
        index++;
      } else {
        clearInterval(animationInterval.current);
        setIsPlaying(false);
      }
    }, 600);
  };

  const handleTraversal = (type) => {
    setIsPlaying(true);
    setTraversalType(type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()));
    let path = [];
    if (type === 'in-order') path = getInOrderPath(treeData);
    else if (type === 'pre-order') path = getPreOrderPath(treeData);
    else if (type === 'post-order') path = getPostOrderPath(treeData);
    else if (type === 'level-order') path = getLevelOrderPath(treeData);
    setTraversalPath(path);
    startAnimation(path);
  };

  const handleReset = () => {
    clearInterval(animationInterval.current);
    setAnimatedNodes([]);
    setTraversalPath([]);
    setTraversalType('');
    setIsPlaying(false);
  };
  
  const getRule = () => {
      switch(traversalType) {
          case 'In Order': return '(Left, Root, Right)';
          case 'Pre Order': return '(Root, Left, Right)';
          case 'Post Order': return '(Left, Right, Root)';
          case 'Level Order': return '(Visit level by level)';
          default: return '';
      }
  }

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen p-2 sm:p-5 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">Binary Tree Traversal 🌳</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Visualize how different algorithms visit each node in a tree.</p>
      </div>

      <div className="controls-panel bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-wrap justify-center items-center gap-3 mb-8">
        <button onClick={() => handleTraversal('in-order')} disabled={isPlaying} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400">In-order</button>
        <button onClick={() => handleTraversal('pre-order')} disabled={isPlaying} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400">Pre-order</button>
        <button onClick={() => handleTraversal('post-order')} disabled={isPlaying} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400">Post-order</button>
        <button onClick={() => handleTraversal('level-order')} disabled={isPlaying} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400">Level-order (BFS)</button>
        <button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition">Reset</button>
      </div>

      <div className="visualization-area bg-gray-100 dark:bg-gray-800 rounded-lg p-6 min-h-[400px] flex justify-center items-start overflow-x-auto relative">
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
             {lines.map((line, i) => (
                <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} className="stroke-current text-gray-400 dark:text-gray-500" strokeWidth="2" />
             ))}
        </svg>
        <TreeNode node={treeData} visitedNodes={animatedNodes} nodeRefs={nodeRefs} />
      </div>

      <div className="info-panel bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-2">
            {traversalType || "Traversal Path"} 
            <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">{getRule()}</span>
        </h2>
        <div className="path-display bg-white dark:bg-gray-700 rounded-md p-4 min-h-[50px] flex items-center flex-wrap gap-x-4 gap-y-2 font-mono text-lg">
          {traversalPath.map((node, index) => (
            <span key={index} className={`transition-opacity duration-300 ${animatedNodes.includes(node) ? 'opacity-100' : 'opacity-20'}`}>
              {node}
            </span>
          ))}
          {traversalPath.length === 0 && <span className="text-gray-400">Click a traversal method to begin.</span>}
        </div>
      </div>
    </div>
  );
}