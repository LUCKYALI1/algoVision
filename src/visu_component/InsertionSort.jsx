import React, { useState, useEffect, useRef } from 'react';

// --- Helper Components & Icons ---

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566z" clipRule="evenodd" />
    </svg>
);

// --- Theory Component for Insertion Sort ---
const TheoryCard = () => (
    <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Understanding Insertion Sort</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            <p>
                Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-4">How it Works:</h3>
            <ol>
                <li>Iterate from the second element (index 1) to the end of the array.</li>
                <li>This element is the "key" that we will insert into the sorted portion of the array (which is initially just the first element).</li>
                <li>Compare the key with the elements before it, in the sorted portion.</li>
                <li>Shift all elements in the sorted portion that are greater than the key one position to the right.</li>
                <li>Insert the key into the correct position in the sorted portion.</li>
                <li>Repeat for all elements.</li>
            </ol>
            <h3 className="text-xl font-semibold mt-6 mb-2">Complexity Analysis</h3>
            <p>Insertion sort is efficient for small datasets or datasets that are already substantially sorted.</p>
            <div className="my-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-left">Complexity</th>
                            <th className="px-4 py-3 font-semibold text-left">Best Case</th>
                            <th className="px-4 py-3 font-semibold text-left">Average Case</th>
                            <th className="px-4 py-3 font-semibold text-left">Worst Case</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        <tr>
                            <td className="px-4 py-3 font-mono">Time</td>
                            <td className="px-4 py-3 font-mono">O(n)</td>
                            <td className="px-4 py-3 font-mono">O(n²)</td>
                            <td className="px-4 py-3 font-mono">O(n²)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-mono">Space</td>
                            <td className="px-4 py-3 font-mono" colSpan="3">O(1)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);


// --- Visualizer Component for Insertion Sort ---
const InsertionSort = () => {
    // --- State Management ---
    const [array, setArray] = useState([]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [status, setStatus] = useState('idle'); // 'idle', 'sorting', 'paused', 'finished'
    const [message, setMessage] = useState("Generate an array or enter your own to begin.");
    
    // State for the current step's visualization details
    const [activeIndices, setActiveIndices] = useState({ key: null, comparing: null, sorted: [] });
    
    // User input state
    const [userInputArray, setUserInputArray] = useState('12, 11, 13, 5, 6');
    const [inputError, setInputError] = useState('');

    const timeoutRef = useRef(null);
    const ANIMATION_SPEED_MS = 600;

    // --- Algorithm & Animation Logic ---
    const resetState = (clearMessage = false) => {
        clearTimeout(timeoutRef.current);
        setSteps([]);
        setCurrentStep(0);
        setActiveIndices({ key: null, comparing: null, sorted: [] });
        setStatus('idle');
        setInputError('');
        if (clearMessage) {
            setMessage("Generate an array or enter your own to begin.");
        }
    };

    const generateNewProblem = () => {
        resetState();
        const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
        setArray(newArray);
        setUserInputArray(newArray.join(', '));
        setMessage("Random array generated. Click 'Start' to visualize.");
    };

    const handleVisualizeCustomInput = () => {
        resetState(true);
        const parsedArray = userInputArray.split(',').map(s => s.trim()).filter(s => s !== '').map(Number);

        if (parsedArray.some(isNaN)) {
            setInputError('Array contains non-numeric values. Please use comma-separated numbers.');
            return;
        }
        if (parsedArray.length > 15) {
            setInputError('For better visualization, please use an array with 15 elements or less.');
            return;
        }

        setArray(parsedArray);
        setMessage("Custom input loaded. Click 'Start' to visualize.");
    };

    const generateSteps = (arr) => {
        const newSteps = [];
        let localArr = [...arr];
        let n = localArr.length;

        for (let i = 1; i < n; i++) {
            let key = localArr[i];
            let j = i - 1;

            newSteps.push({
                arrayState: [...localArr],
                key: i, comparing: j, sorted: Array.from({length: i}, (_, k) => k),
                message: `Selecting ${key} as the key to insert.`
            });

            while (j >= 0 && localArr[j] > key) {
                newSteps.push({
                    arrayState: [...localArr],
                    key: i, comparing: j, sorted: Array.from({length: i}, (_, k) => k),
                    message: `Comparing key ${key} with ${localArr[j]}. Shifting ${localArr[j]} to the right.`
                });
                localArr[j + 1] = localArr[j];
                j = j - 1;
                 newSteps.push({
                    arrayState: [...localArr],
                    key: i, comparing: j, sorted: Array.from({length: i}, (_, k) => k),
                    message: `Shift complete.`
                });
            }
            localArr[j + 1] = key;
            newSteps.push({
                arrayState: [...localArr],
                key: null, comparing: j + 1, sorted: Array.from({length: i + 1}, (_, k) => k),
                message: `Inserted ${key} at its correct position.`
            });
        }
        
        newSteps.push({
            arrayState: [...localArr],
            key: null, comparing: null, sorted: Array.from(Array(n).keys()),
            message: `Sorting complete!`
        });

        setSteps(newSteps);
    };
    
    useEffect(() => {
        generateNewProblem();
    }, []);
    
    useEffect(() => {
        if (status === 'sorting' && currentStep < steps.length) {
            timeoutRef.current = setTimeout(() => {
                const step = steps[currentStep];
                setArray(step.arrayState);
                setActiveIndices({
                    key: step.key,
                    comparing: step.comparing,
                    sorted: step.sorted
                });
                setMessage(step.message);
                setCurrentStep(prev => prev + 1);
            }, ANIMATION_SPEED_MS);
        } else if (status === 'sorting' && currentStep >= steps.length) {
            setStatus('finished');
        }
        return () => clearTimeout(timeoutRef.current);
    }, [currentStep, status, steps]);

    const handleStart = () => {
        if (array.length === 0) {
            setInputError("Please generate or enter an array first.");
            return;
        }
        resetState();
        generateSteps(array);
        setStatus('sorting');
    };

    const handlePausePlay = () => {
        setStatus(prev => (prev === 'sorting' ? 'paused' : 'sorting'));
    };

    const getBarClass = (index) => {
        const base = "flex-1 font-bold text-xs sm:text-sm rounded-md transition-all duration-300 mx-0.5 sm:mx-1 flex items-center justify-center h-12 sm:h-16";
        if (activeIndices.sorted.includes(index)) return `${base} bg-green-500 text-white shadow-lg`;
        if (index === activeIndices.key) return `${base} bg-sky-500 text-white shadow-lg scale-110`;
        if (index === activeIndices.comparing) return `${base} bg-yellow-400 dark:bg-yellow-500 text-black shadow-md`;
        return `${base} bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100`;
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-950 min-h-screen p-4 sm:p-8 font-sans">
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">Insertion Sort Visualizer</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">A simple sorting algorithm that builds the final sorted array one item at a time.</p>
            </header>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 mb-6">
                    <h3 className="font-semibold text-lg mb-4 text-center sm:text-left text-black dark:text-white">Create Your Own Problem</h3>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="flex-grow w-full">
                            <label htmlFor="array-input-insertion" className="block text-sm font-medium text-black dark:text-white mb-1">Array (comma-separated)</label>
                            <input id="array-input-insertion" type="text" value={userInputArray} onChange={e => setUserInputArray(e.target.value)} placeholder="e.g., 12, 11, 13, 5, 6" className="text-black dark:text-white w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 font-mono"/>
                        </div>
                        <div className="w-full sm:w-auto pt-0 sm:pt-6">
                             <button onClick={handleVisualizeCustomInput} className="bg-indigo-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-600 transition-all shadow-sm disabled:opacity-50 w-full" disabled={status === 'sorting' || status === 'paused'}>
                                Load Input
                            </button>
                        </div>
                    </div>
                    {inputError && <p className="text-red-500 text-sm mt-3 text-center">{inputError}</p>}
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 mb-6 flex flex-wrap items-center justify-center gap-4">
                    <button onClick={generateNewProblem} className="flex items-center gap-2 bg-slate-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-600 transition-all shadow-sm disabled:opacity-50" disabled={status === 'sorting' || status === 'paused'}>
                        <RefreshIcon /> Random Example
                    </button>
                    <button onClick={handleStart} className="flex items-center gap-2 bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-all shadow-sm disabled:opacity-50" disabled={status === 'sorting' || status === 'paused' || array.length === 0}>
                       <PlayIcon /> Start
                    </button>
                    <button onClick={handlePausePlay} className="flex items-center gap-2 bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all shadow-sm disabled:status === 'idle' || status === 'finished'" disabled={status === 'idle' || status === 'finished'}>
                        {status === 'paused' ? <PlayIcon /> : <PauseIcon />} {status === 'paused' ? 'Play' : 'Pause'}
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 min-h-[150px]">
                    <div className="flex justify-center items-center mb-4 h-24">
                        {array.map((value, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-1">
                                <div className={getBarClass(idx)}>{value}</div>
                                <span className="text-xs mt-2 text-slate-500 dark:text-slate-400">{idx}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center text-slate-700 dark:text-slate-300 font-mono text-sm md:text-base min-h-[50px] flex items-center justify-center">
                    <p>{message}</p>
                </div>
                
                <TheoryCard />
            </div>
        </div>
    );
}
export default InsertionSort;
