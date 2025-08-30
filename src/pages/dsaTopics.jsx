import { useState, useEffect } from 'react';

// --- STEP 1: YOUR JSON DATA (Unchanged) ---
// const dsaJsonData = {
//     "Array": {
//         "topicName": "Array",
//         "theoryAndFeatures": "An **Array** is a fundamental linear data structure that stores a collection of elements of the **same data type** in **contiguous memory locations**. Each element is identified by an index, typically a zero-based integer.\n\n### Key Features\n- **Contiguous Memory:** Elements are stored side-by-side, which is excellent for CPU cache performance.\n- **Random Access:** Any element can be accessed directly using its index in constant time, $O(1)$.\n- **Fixed Size (Static Arrays):** In languages like C++ and Java, the size of an array is fixed upon creation.\n- **Dynamic Size (Dynamic Arrays):** Data structures like C++'s `std::vector` or Python's `list` are built on top of arrays but can automatically resize themselves. This resizing operation, however, can be costly ($O(n)$).\n\n### Complexity Analysis\n| Operation           | Average Case | Worst Case   | Explanation                                                              |\n| ------------------  | ------------ | ------------ | ------------------------------------------------------------------------ |\n| Access (by index)   | $O(1)$         | $O(1)$         | The memory address is calculated directly from the index.                |\n| Search (linear)     | $O(n)$         | $O(n)$         | Must potentially check every element.                                    |\n| Insertion (at end)  | $O(1)^*$       | $O(n)^*$       | *Amortized $O(1)$ for dynamic arrays, but $O(n)$ if resizing is needed.    |\n| Insertion (middle)  | $O(n)$         | $O(n)$         | All subsequent elements must be shifted.                                 |\n| Deletion (at end)   | $O(1)$         | $O(1)$         | No shifting of elements is required.                                     |\n| Deletion (middle)   | $O(n)$         | $O(n)$         | All subsequent elements must be shifted to fill the gap.                 |",
//         "realWorldAnalogy": "Think of an **egg carton**. It has a fixed number of slots (its size), and each slot is in a specific, numbered position (the index). You can instantly access the 5th slot to get an egg (random access).",
//         "advancedTopics": "- **Dynamic Arrays (Vectors):** Automatically handle resizing, providing more flexibility than static arrays.\n- **Multi-dimensional Arrays:** Arrays of arrays, used to represent matrices or grids.\n- **Prefix Sum Array:** A precomputed array allowing for $O(1)$ range sum queries.\n- **Sliding Window:** A technique that uses a conceptual window that slides over an array to solve subarray problems efficiently.",
//         "codingProblems": [
//             {
//                 "title": "Two Sum",
//                 "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
//                 "links": { "leetCode": "https://leetcode.com/problems/two-sum/", "gfg": "https://www.geeksforgeeks.org/problems/two-sum-1587115621/1" },
//                 "pattern": "Using a hash map for efficient lookups to find the complement.",
//                 "solutions": {
//                     "cpp": "```cpp\n#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        std::unordered_map<int, int> numMap;\n        for (int i = 0; i < nums.size(); ++i) {\n            int complement = target - nums[i];\n            if (numMap.count(complement)) {\n                return {numMap[complement], i};\n            }\n            numMap[nums[i]] = i;\n        }\n        return {};\n    }\n}; \n```",
//                     "python": "```python\nclass Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        num_map = {}\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in num_map:\n                return [num_map[complement], i]\n            num_map[num] = i\n        return []\n```",
//                     "javascript": "```javascript\nvar twoSum = function(nums, target) {\n    const numMap = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (numMap.has(complement)) {\n            return [numMap.get(complement), i];\n        }\n        numMap.set(nums[i], i);\n    }\n    return [];\n};\n```"
//                 }
//             }
//         ],
//         "extraInsights": "### Interview Relevance\nArrays are the **most common** data structure in interviews. Questions range from easy to hard. Mastery is non-negotiable.\n\n### Tips\n- **Clarify Constraints:** Ask if the array is sorted, contains duplicates, or has negative numbers.\n- **Think About Space-Time Tradeoffs:** Often, you can use extra space (like a hash map) to reduce time complexity.\n- **Master Patterns:** Two Pointers, Sliding Window, and Prefix Sums are your best friends."
//     },
//     "String": {
//         "topicName": "String",
//         "theoryAndFeatures": "A **String** is a data structure representing a **sequence of characters**. Internally, it's often implemented as an array of characters. A crucial property of strings in languages like Java, Python, and JavaScript is their **immutability** – once a string is created, it cannot be changed. Operations that seem to modify a string actually create a new one.\n\n### Key Features\n- **Sequence of Characters:** Ordered collection of characters.\n- **Immutability (Commonly):** In many languages, strings are immutable. This makes them thread-safe and allows for internal optimizations.\n- **Rich API:** Most languages provide a vast library of functions for string manipulation (slicing, searching, concatenation, etc.).",
//         "realWorldAnalogy": "Think of a word printed in a **book**. The word 'hello' is fixed. You can't change the letter 'e' to 'a' directly on the page. To get 'hallo', you must write the new word elsewhere.",
//         "advancedTopics": "- **String Searching Algorithms:** Advanced algorithms like **KMP (Knuth-Morris-Pratt)** and **Rabin-Karp** can find substrings in $O(n+m)$ time.\n- **Trie (Prefix Tree):** A special tree-like data structure used for efficient retrieval of keys in a dataset of strings.",
//         "codingProblems": [
//             {
//                 "title": "Valid Anagram",
//                 "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
//                 "links": { "leetCode": "https://leetcode.com/problems/valid-anagram/", "gfg": "https://www.geeksforgeeks.org/problems/anagram-1587115620/1" },
//                 "pattern": "Character Counting using a hash map or an integer array.",
//                 "solutions": {
//                     "cpp": "```cpp\n#include <string>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    bool isAnagram(std::string s, std::string t) {\n        if (s.length() != t.length()) return false;\n        std::unordered_map<char, int> counts;\n        for (char c : s) counts[c]++;\n        for (char c : t) {\n            if (counts.find(c) == counts.end() || counts[c] == 0) {\n                return false;\n            }\n            counts[c]--;\n        }\n        return true;\n    }\n};\n```",
//                     "python": "```python\nfrom collections import Counter\nclass Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        return Counter(s) == Counter(t)\n```",
//                     "javascript": "```javascript\nvar isAnagram = function(s, t) {\n    if (s.length !== t.length) return false;\n    const counts = {};\n    for (const char of s) {\n        counts[char] = (counts[char] || 0) + 1;\n    }\n    for (const char of t) {\n        if (!counts[char]) return false;\n        counts[char]--;\n    }\n    return true;\n};\n```"
//                 }
//             }
//         ],
//         "extraInsights": "### Interview Relevance\nString problems are very common and test your attention to detail.\n\n### Tips\n- **Clarify Character Set:** Ask if the string contains only ASCII characters or Unicode.\n- **Immutability Gotcha:** Remember that repeatedly concatenating strings in a loop is inefficient. Use a list/builder and join them at the end."
//     }
// };
import dsaData from '../Data/Dsa';

// --- STEP 2: DATA TRANSFORMATION (Unchanged) ---
function transformData(jsonData) {
    return [
        {
            category: 'Array & String',
            topics: [
                { id: 'Array', ...jsonData.Array },
                { id: 'String', ...jsonData.String },
                { id: 'Sorting', ...jsonData.Sorting },
                { id: 'Searching', ...jsonData.Searching },
                { id: 'Hashing', ...jsonData.Hashing },
                { id: 'LinkedList', ...jsonData.LinkedList },
                { id: 'Stack', ...jsonData.Stack },
                { id: 'Queue', ...jsonData.Queue },
                { id: 'Tree', ...jsonData.Tree },
                { id: 'Graph', ...jsonData.Graph },
                { id: 'Heap List', ...jsonData.Heap },
                { id: 'Trie', ...jsonData.Trie },
                { id: 'DynamicProgramming', ...jsonData.DynamicProgramming },
                { id: 'Greedy', ...jsonData.Greedy },
                { id: 'SegmentTree', ...jsonData.SegmentTree },


            ]
        },
    ];
}

const dsaTopicData = transformData(dsaData);

// --- STEP 3: RESTRUCTURED & REDESIGNED COMPONENTS (Unchanged) ---

// Helper to parse markdown-like text to JSX
const MarkdownRenderer = ({ content }) => {
    if (!content) return null;

    const renderSegment = (segment) => {
        segment = segment.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-indigo-400">$1</strong>');
        segment = segment.replace(/`(.*?)`/g, '<code class="px-1.5 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded-md font-mono">$1</code>');
        segment = segment.replace(/\$(.*?)\$/g, '<code class="px-1.5 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded-md font-mono">$1</code>');
        return <div dangerouslySetInnerHTML={{ __html: segment }} />;
    };

    const parts = content.split(/(\n\|.*\|.*\n(?:\|.*\|.*\n)+)/g);

    return (
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            {parts.map((part, index) => {
                if (part.trim().startsWith('|')) {
                    const rows = part.trim().split('\n').map(row => row.split('|').slice(1, -1).map(cell => cell.trim()));
                    if (rows.length < 2) return null;
                    const header = rows[0];
                    const body = rows.slice(2);

                    return (
                        <div key={index} className="my-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        {header.map((th, i) => <th key={i} className="px-4 py-3 font-semibold text-left text-slate-700 dark:text-slate-200">{th}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {body.map((row, i) => (
                                        <tr key={i}>
                                            {row.map((td, j) => <td key={j} className="px-4 py-3">{renderSegment(td)}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                } else {
                    const sections = part.split(/(\n### .*)/g).filter(Boolean);
                    return sections.map((section, secIndex) => {
                        if (section.trim().startsWith('### ')) {
                            const title = section.replace('### ', '').trim();
                            return <h3 key={`${index}-${secIndex}`} className="text-xl font-semibold mt-8 mb-4 text-slate-800 dark:text-slate-100">{title}</h3>;
                        }
                        const listItems = section.split('\n- ').filter(item => item.trim());
                        if (listItems.length > 1 || (listItems.length === 1 && section.trim().startsWith('- '))) {
                            const firstItem = listItems[0].trim() === '' ? listItems.slice(1) : listItems;
                            return (
                                <ul key={`${index}-${secIndex}`} className="space-y-2 list-disc list-inside mt-4">
                                    {firstItem.map((item, itemIndex) => <li key={itemIndex}>{renderSegment(item)}</li>)}
                                </ul>
                            );
                        }
                        return <p key={`${index}-${secIndex}`}>{renderSegment(section)}</p>;
                    });
                }
            })}
        </div>
    );
};

const CodeBlock = ({ code, language }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const cleanCode = code.replace(/```[a-z]*\n/g, '').replace(/```/g, '').trim();

    return (
        <div className="bg-slate-800/80 dark:bg-black/50 rounded-lg overflow-hidden my-4 border border-slate-700/50">
            <div className="flex justify-between items-center px-4 py-2 bg-slate-700/50 dark:bg-slate-800/50">
                <span className="text-xs font-semibold text-slate-300 uppercase">{language}</span>
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors">
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto font-mono text-slate-300">
                <code>{cleanCode}</code>
            </pre>
        </div>
    );
};

const ProblemCard = ({ problem }) => {
    const [selectedLang, setSelectedLang] = useState(Object.keys(problem.solutions)[0]);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 transition-shadow hover:shadow-md">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{problem.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">{problem.description}</p>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-medium px-3 py-1 rounded-full text-xs">
                    {problem.pattern}
                </span>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <a href={problem.links.leetCode} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">
                        LeetCode
                    </a>
                    <a href={problem.links.gfg} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">
                        GeeksForGeeks
                    </a>
                    _D_   </div>
            </div>

            <div>
                <div className="border-b border-slate-200 dark:border-slate-800">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        {Object.keys(problem.solutions).map(lang => (
                            <button
                                key={lang}
                                onClick={() => setSelectedLang(lang)}
                                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${selectedLang === lang
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </nav>
                </div>
                <CodeBlock code={problem.solutions[selectedLang]} language={selectedLang} />
            </div>
        </div>
    );
};

const InfoCard = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
            {title}
        </h3>
        <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {children}
        </div>
    </div>
);

// --- UPDATED RESPONSIVE COMPONENTS ---

const Sidebar = ({ data, selectedTopic, onTopicSelect, isSidebarOpen, onToggleTheme, isDarkMode }) => (
    <aside className={`fixed inset-y-0 left-0 w-64 flex-shrink-0 bg-slate-50 dark:bg-black border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0  z-[60]' : '-translate-x-full ] '}`}>
        <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">DSA Explorer</h1>
            <div className='lg:hidden'> {/* Only show theme toggle in sidebar header on large screens */}
                <button onClick={onToggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xl">
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>
        </header>
        <nav className="flex-grow p-4 overflow-y-auto">
            {data.map(category => (
                <div key={category.category} className="mb-6">
                    {/* <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
                        {category.category}
                    </h2> */}
                    <ul>
                        {category.topics.map(topic => (
                            <li key={topic.id}>
                                <button
                                    onClick={() => onTopicSelect(topic.id)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 font-medium ${selectedTopic === topic.id
                                        ? 'bg-indigo-500 text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                        }`}
                                >
                                    {topic.topicName}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    </aside>
);

const TopicContent = ({ topic, onSidebarToggle }) => {
    if (!topic) {
        return (
            <main className="flex-1 p-8 lg:p-12 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">Select a topic</h2>
                    <p className="text-slate-500 mt-2">Choose a Data Structure or Algorithm from the sidebar to begin.</p>
                </div>
            </main>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-20">
                <button onClick={onSidebarToggle} className="p-2 text-slate-600 dark:text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{topic.topicName}</h2>
            </header>

            <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto bg-slate-50/50 dark:bg-black">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">{topic.topicName}</h2>
                    </header>

                    <section className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Theory & Features</h3>
                            <MarkdownRenderer content={topic.theoryAndFeatures} />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                            <InfoCard title="Real-World Analogy">
                                <MarkdownRenderer content={topic.realWorldAnalogy} />
                            </InfoCard>
                            <InfoCard title="Advanced Topics">
                                <MarkdownRenderer content={topic.advancedTopics} />
                            </InfoCard>
                        </div>

                        <InfoCard title="Extra Insights">
                            <MarkdownRenderer content={topic.extraInsights} />
                        </InfoCard>

                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 pt-4 border-t border-slate-200 dark:border-slate-800">Coding Problems</h3>
                            <div className="space-y-6">
                                {topic.codingProblems.map(problem => (
                                    <ProblemCard key={problem.title} problem={problem} />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
function DSATopicList() {
    const [selectedTopicId, setSelectedTopicId] = useState(dsaTopicData[0]?.topics[0]?.id || null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Effect to check for saved theme preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('dsa-explorer-theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        }
    }, []);

    // Effect to apply the dark class to the root element
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('dsa-explorer-theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('dsa-explorer-theme', 'light');
        }
    }, [isDarkMode]);

    const handleTopicSelect = (topicId) => {
        setSelectedTopicId(topicId);
        // Close sidebar on mobile after selecting a topic
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const selectedTopicData = dsaTopicData
        .flatMap(category => category.topics)
        .find(topic => topic.id === selectedTopicId);

    return (
        <div className=' bg-slate-50 dark:bg-black pt-10'>
            <div className=" px-10 md-px-0 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-4xl font-extrabold text-black dark:text-white leading-tight mb-4 fade-in-up delay-100">
                    Master  Data Structures & Algorithms
                </h1>
                <p className="text-lg text-slate-600 mb-8 fade-in-up delay-200">
                    Data Structures and Algorithms (DSA) are the foundation of computer science and programming.
                </p>
            </div>


            <div className="w-[90vw] m-auto bg-white dark:bg-black text-slate-900 dark:text-white min-h-screen">
                <div className="relative min-h-screen  lg:flex bg-slate-50">
                    {/* Overlay for mobile */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        ></div>
                    )}
                    <Sidebar
                        data={dsaTopicData}
                        selectedTopic={selectedTopicId}
                        onTopicSelect={handleTopicSelect}
                        isSidebarOpen={isSidebarOpen}
                    />
                    <TopicContent
                        topic={selectedTopicData}
                        onSidebarToggle={() => setSidebarOpen(!isSidebarOpen)}
                    />
                </div>
            </div>
        </div>
    );
}

export default DSATopicList;