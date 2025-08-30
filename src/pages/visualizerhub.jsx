import React, { useState, useEffect } from 'react';
import BinarySearch from '../visu_component/Binarysearch';
import LinearSearch from '../visu_component/LinearSeach';
import BubbleSort from '../visu_component/BubbleSort';
import SelectionSort from '../visu_component/SelectionSort';
import InsertionSort from '../visu_component/InsertionSort';
import MergeSort from '../visu_component/MergeSort';
import QuickSort from '../visu_component/QuickSort';
import HeapSort from '../visu_component/HeapSort';
import FactorialVisualizer from '../visu_component/FactorialRecusion';
import FibonacciRecursion from '../visu_component/FibonacciRecusion';
import TowerOfHanoi from '../visu_component/TowerOfHannoi';
import Stack from '../visu_component/Stack';
import Queue from '../visu_component/Queue';
import LinkedList from '../visu_component/LinkedList';
import BinaryTree from '../visu_component/BinaryTree';
import Working from '../visu_component/Working';


// --- Data for the visualization categories ---
const visualizerData = [
    {
        id: 'sorting',
        category: 'Sorting Algorithms',
        description: 'Visualize how different algorithms arrange data into a sorted order. Watch swaps, comparisons, and merges happen in real-time.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 8h18M3 12h18M3 16h18m-7 4h7m-7-4v4m0-8v4" />
            </svg>
        ),
        items: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort'],
    },
    {
        id: 'searching',
        category: 'Searching Algorithms',
        description: 'See how algorithms find a target value within a dataset. Perfect for understanding efficiency and search patterns.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
        items: ['Linear Search', 'Binary Search'],
    },
    {
        id: 'recursion',
        category: 'Recursion & Divide and Conquer',
        description: 'Explore the power of recursion by visualizing call stacks, branching, and how problems are broken into smaller pieces.',
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        items: ['Factorial Recursion', 'Fibonacci Recursion', 'Tower of Hanoi'],
    },
    {
        id: 'datastructures',
        category: 'Basic Data Structures',
        description: 'Understand how fundamental data structures are modified with common operations like push, pop, insert, and delete.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
        ),
        items: ['Stack (Push/Pop)', 'Queue (Enqueue/Dequeue)', 'Linked List (Insert/Delete)'],
    },
    {
        id: 'pathfinding',
        category: 'Pathfinding Algorithms',
        description: 'Watch maze-solving algorithms in action. These visualizations are perfect for understanding graph and grid traversal.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        items: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Dijkstra’s Algorithm', 'A* (A-Star) Algorithm'],
    }
];

// --- Placeholder Visualizer Components ---
// Replace these with your actual component imports
const BinarySearchVisualizer = () => <div className="text-center p-8 bg-white dark:bg-black rounded-lg"><BinarySearch/></div>;
const LinearSearchVisualizer = () => <div className="text-center p-8  bg-white dark:bg-black  rounded-lg"><LinearSearch /></div>;
const BubbleSortVisualizer  = () => <div className="text-center p-8  bg-white dark:bg-black rounded-lg"><BubbleSort /></div>;
const SelectionSortVisualizer = () => <div className="text-center p-8  bg-white dark:bg-black rounded-lg"><SelectionSort /></div>;
const InsertionSortVisualizer = () => <div className="text-center p-8  bg-white dark:bg-black rounded-lg"><InsertionSort /></div>;
const MergeSortVisualizer = () => <div className="text-center p-8  bg-white dark:bg-black rounded-lg"><MergeSort /></div>;
const QuickSortVisualizer = () => <div className="text-center p-8  bg-white dark:bg-black rounded-lg"><QuickSort /></div>;
const HeapSortVisualizer = () => <div className="text-center p-8  bg-white dark:bg-black rounded-lg"><HeapSort /></div>;
const FactorialVisu =() =><div className="text-center p-8  bg-white dark:bg-black rounded-lg"><FactorialVisualizer /></div>; 
const FibonacciVisualizer =() =><div className="text-center p-8  bg-white dark:bg-black rounded-lg"><FibonacciRecursion /></div>; 
const TowerOfHanoiVisualizer =() =><div className="text-center p-8  bg-white dark:bg-black rounded-lg"><TowerOfHanoi /></div>; 
const StackVisualizer =() =><div className="text-center p-8  bg-white dark:bg-black rounded-lg"><Stack /></div>; 
const QueueVisualizer =() =><div className="text-center p-8  bg-white dark:bg-black rounded-lg"><Queue /></div>; 
const LinkedListVisualizer =() =><div className="text-center p-8  bg-white dark:bg-black rounded-lg"><LinkedList /></div>; 
const BinaryTreeVisualizer =() =><div className="text-center p-8  bg-white dark:bg-black rounded-lg"><BinaryTree /></div>; 
const WorkingVisualizer =() =><div className="text-center p-8  bg-white dark:bg-black rounded-lg"><Working /></div>; 
// --- Modal Component ---
const VisualizerModal = ({ algorithmName, onClose }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    // --- Renders the correct visualizer based on the name ---
    const renderVisualizer = () => {
        switch (algorithmName) {
            case 'Binary Search':
                return <BinarySearchVisualizer />;
            case 'Linear Search':
                return <LinearSearchVisualizer />;
           case 'Bubble Sort':
                return <BubbleSortVisualizer />;
        case 'Selection Sort':
                return <SelectionSortVisualizer />;
           case 'Insertion Sort':
                return <InsertionSortVisualizer />;
            case 'Merge Sort':
                return <MergeSortVisualizer />;
            case 'Quick Sort':
                return <QuickSortVisualizer />; 
            case 'Heap Sort':
                return <HeapSortVisualizer />;
            case 'Factorial Recursion':
                return <FactorialVisu />;
            case 'Fibonacci Recursion':
                return <FibonacciVisualizer />;
            case 'Tower of Hanoi':
                return <TowerOfHanoiVisualizer />;
            case 'Stack (Push/Pop)':
                return <StackVisualizer />;
            case 'Queue (Enqueue/Dequeue)':
                return <QueueVisualizer />;
            case 'Linked List (Insert/Delete)':
                return <LinkedListVisualizer />;
           case 'Breadth-First Search (BFS)':
                return <Working />;
            case 'Depth-First Search (DFS)':
                return <Working />;
            case 'Dijkstra’s Algorithm':
                return <Working />;  
            case 'A* (A-Star) Algorithm':
                return <Working />;
          
            // Add cases for your other visualizers here
            // e.g., case 'Bubble Sort': return <BubbleSortVisualizer />;
            default:
                return <PlaceholderVisualizer name={algorithmName} />;
        }
    };

    return (
        <div 
            className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 mb-20"
            onClick={onClose}
        >
            <div 
                className="bg-gray-50 dark:bg-black/80 rounded-2xl shadow-xl w-[90vw] h-[90vh] flex flex-col m-auto border border-slate-200 dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{algorithmName} Visualizer</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                <main className="p-6 flex-grow overflow-y-auto">
                    {renderVisualizer()}
                </main>
            </div>
        </div>
    );
};


// --- Accordion Item Component ---
const AccordionItem = ({ item, isOpen, onClick, onAlgorithmSelect }) => {
    return (
        <div className="border-b border-slate-200 dark:border-slate-800">
            <h2>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-6 font-medium text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                    onClick={onClick}
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center">
                        <div className="mr-5 text-indigo-500 dark:text-indigo-400">{item.icon}</div>
                        <div>
                            <span className="text-xl font-semibold">{item.category}</span>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
                        </div>
                    </div>
                    <svg
                        className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </h2>
            <div
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {item.items.map((algo, index) => (
                                <li key={index}>
                                    <button 
                                        onClick={() => onAlgorithmSelect(algo)}
                                        className="w-full text-left text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:shadow-md transition-all"
                                    >
                                        {algo}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Hub Component ---
function AlgorithmHub() {
    const [openId, setOpenId] = useState(visualizerData[0].id);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

    const handleToggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const handleSelectAlgorithm = (algoName) => {
        setSelectedAlgorithm(algoName);
    };

    const handleCloseModal = () => {
        setSelectedAlgorithm(null);
    };

    return (
        <>
        <div className="py-20 w-[90vw] m-auto pt-[150px] md:pt-25" >
            <header className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-white">Algorithm Visualizer Hub</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
                    Select a category to explore interactive visualizations of fundamental data structures and algorithms.
                </p>
            </header>
            
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                {visualizerData.map((item) => (
                    <AccordionItem
                        key={item.id}
                        item={item}
                        isOpen={openId === item.id}
                        onClick={() => handleToggle(item.id)}
                        onAlgorithmSelect={handleSelectAlgorithm}
                    />
                ))}
            </div>

            {selectedAlgorithm && (
                <VisualizerModal 
                    algorithmName={selectedAlgorithm}
                    onClose={handleCloseModal}
                />
            )}
            </div>
        </>
    );
}

export default AlgorithmHub;