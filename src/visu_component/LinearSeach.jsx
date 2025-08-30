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

// --- Theory Component for Linear Search ---
const TheoryCard = () => (
    <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Understanding Linear Search</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            <p>
                Linear Search, also known as sequential search, is the most straightforward search algorithm. It sequentially checks each element of a list until a match is found or the whole list has been searched. Unlike Binary Search, it <strong className="text-indigo-500 dark:text-indigo-400">does not require the array to be sorted</strong>.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-4">How it Works:</h3>
            <ol>
                <li>Start from the leftmost element of the array (index 0).</li>
                <li>Compare the target value with the current element.</li>
                <li>If the target matches the element, return the current index.</li>
                <li>If not, move to the next element and repeat the process.</li>
                <li>If the end of the list is reached without finding the target, the search terminates unsuccessfully.</li>
            </ol>
            <h3 className="text-xl font-semibold mt-6 mb-2">Complexity Analysis</h3>
            <p>Its simplicity comes at the cost of efficiency for large datasets.</p>
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
                            <td className="px-4 py-3 font-mono">O(1)</td>
                            <td className="px-4 py-3 font-mono">O(n)</td>
                            <td className="px-4 py-3 font-mono">O(n)</td>
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


// --- Visualizer Component for Linear Search ---
function LinearSearchVisualizer() {
    // --- State Management ---
    const [array, setArray] = useState([]);
    const [target, setTarget] = useState(null);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [foundIndex, setFoundIndex] = useState(null);
    const [message, setMessage] = useState("Generate an array or enter your own to begin.");
    const [status, setStatus] = useState('idle'); // 'idle', 'searching', 'paused', 'finished'
    
    // User input state
    const [userInputArray, setUserInputArray] = useState('51, 11, 89, 42, 97, 23, 66, 35, 73');
    const [userInputTarget, setUserInputTarget] = useState('66');
    const [inputError, setInputError] = useState('');

    const timeoutRef = useRef(null);
    const ANIMATION_SPEED_MS = 800;

    // --- Algorithm & Animation Logic ---
    const resetState = (clearMessage = false) => {
        clearTimeout(timeoutRef.current);
        setSteps([]);
        setCurrentStep(0);
        setCurrentIndex(null);
        setFoundIndex(null);
        setStatus('idle');
        setInputError('');
        if(clearMessage) {
            setMessage("Generate an array or enter your own to begin.");
        }
    };

    const generateNewProblem = () => {
        resetState();
        const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 1);
        const newTarget = newArray[Math.floor(Math.random() * newArray.length)];
        
        setArray(newArray);
        setTarget(newTarget);
        setUserInputArray(newArray.join(', '));
        setUserInputTarget(newTarget.toString());
        setMessage("Random array generated. Click 'Start' to visualize.");
    };

    const handleVisualizeCustomInput = () => {
        resetState(true);
        const parsedArray = userInputArray.split(',').map(s => s.trim()).filter(s => s !== '').map(Number);
        const parsedTarget = Number(userInputTarget);

        if (parsedArray.some(isNaN)) {
            setInputError('Array contains non-numeric values. Please enter comma-separated numbers.');
            return;
        }
        if (isNaN(parsedTarget)) {
            setInputError('Target must be a valid number.');
            return;
        }

        setArray(parsedArray);
        setTarget(parsedTarget);
        setMessage("Custom input loaded. Click 'Start' to visualize.");
    };

    const generateSteps = (arr, tgt) => {
        const newSteps = [];
        let found = false;

        for (let i = 0; i < arr.length; i++) {
            newSteps.push({ currentIndex: i, message: `Checking index ${i}. Value: ${arr[i]}.` });
            if (arr[i] === tgt) {
                newSteps.push({ currentIndex: i, found: i, message: `Target found at index ${i}!` });
                found = true;
                break;
            }
        }

        if (!found) {
            newSteps.push({ currentIndex: arr.length -1, message: `Target ${tgt} not found after checking all elements.` });
        }
        setSteps(newSteps);
    };
    
    useEffect(() => {
        generateNewProblem();
    }, []);
    
    useEffect(() => {
        if (status === 'searching' && currentStep < steps.length) {
            timeoutRef.current = setTimeout(() => {
                const step = steps[currentStep];
                setCurrentIndex(step.currentIndex);
                setMessage(step.message);
                if (step.found !== undefined) {
                    setFoundIndex(step.found);
                    setStatus('finished');
                }
                setCurrentStep(prev => prev + 1);
            }, ANIMATION_SPEED_MS);
        } else if (status === 'searching' && currentStep >= steps.length) {
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
        generateSteps(array, target);
        setStatus('searching');
    };

    const handlePausePlay = () => {
        setStatus(prev => (prev === 'searching' ? 'paused' : 'searching'));
    };

    const getBarClass = (index) => {
        const base = "flex-1 font-bold text-xs sm:text-sm rounded-md transition-all duration-300 mx-0.5 sm:mx-1 flex items-center justify-center h-12 sm:h-16";
        if (foundIndex === index) return `${base} bg-green-500 text-white shadow-lg scale-110`;
        if (currentIndex === index) return `${base} bg-yellow-400 dark:bg-yellow-500 text-black shadow-md`;
        return `${base} bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100`;
    };

    return (
        <>
            <header className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">Linear Search Visualizer</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">A simple, sequential search algorithm.</p>
            </header>

            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 mb-6">
                <h3 className="font-semibold text-lg mb-4 text-center sm:text-left text-black dark:text-white">Create Your Own Problem</h3>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                    <div className="sm:col-span-8">
                        <label htmlFor="array-input-linear" className="block text-sm font-medium text-black dark:text-white mb-1">Array (comma-separated)</label>
                        <input id="array-input-linear" type="text" value={userInputArray} onChange={e => setUserInputArray(e.target.value)} placeholder="e.g., 51, 11, 89, 42" className="text-black dark:text-white w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 font-mono"/>
                    </div>
                    <div className="sm:col-span-4">
                        <label htmlFor="target-input-linear" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Target</label>
                        <input id="target-input-linear" type="number" value={userInputTarget} onChange={e => setUserInputTarget(e.target.value)} placeholder="e.g., 42" className="text-black dark:text-white w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 font-mono"/>
                    </div>
                </div>
                {inputError && <p className="text-red-500 text-sm mt-3 text-center">{inputError}</p>}
                <div className="mt-4 flex justify-center">
                    <button onClick={handleVisualizeCustomInput} className="bg-indigo-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-600 transition-all shadow-sm disabled:opacity-50" disabled={status === 'searching' || status === 'paused'}>
                        Load Custom Input
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 mb-6 flex flex-wrap items-center justify-center gap-4">
                <button onClick={generateNewProblem} className="flex items-center gap-2 bg-slate-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-600 transition-all shadow-sm disabled:opacity-50" disabled={status === 'searching' || status === 'paused'}>
                    <RefreshIcon /> Random Example
                </button>
                <button onClick={handleStart} className="flex items-center gap-2 bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-all shadow-sm disabled:status === 'searching' || status === 'paused'">
                   <PlayIcon /> Start
                </button>
                <button onClick={handlePausePlay} className="flex items-center gap-2 bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all shadow-sm disabled:status === 'idle' || status === 'finished'" disabled={status === 'idle' || status === 'finished'}>
                    {status === 'paused' ? <PlayIcon /> : <PauseIcon />} {status === 'paused' ? 'Play' : 'Pause'}
                </button>
                <div className="font-mono text-sm sm:text-base text-slate-600 dark:text-slate-300">
                    Target: <span className="font-bold text-indigo-500 dark:text-indigo-400 text-lg">{target ?? ''}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 min-h-[200px]">
                <div className="flex justify-center items-end mb-4 h-24">
                    {array.map((value, idx) => (
                        <div key={idx} className="flex flex-col items-center flex-1">
                            <div className={getBarClass(idx)}>{value}</div>
                            <span className="text-xs mt-2 text-slate-500 dark:text-slate-400">{idx}</span>
                        </div>
                    ))}
                </div>
                 <div className="flex justify-around text-center text-sm font-semibold mt-4 text-slate-600 dark:text-slate-300">
                    <span className={currentIndex !== null ? 'text-yellow-500' : ''}>Current Index: {currentIndex ?? 'N/A'}</span>
                </div>
            </div>

            <div className="mt-6 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center text-slate-700 dark:text-slate-300 font-mono text-sm md:text-base min-h-[50px] flex items-center justify-center">
                <p>{message}</p>
            </div>
            
            <TheoryCard />
        </>
    );
}
export default LinearSearchVisualizer