import React from 'react';

// --- SVG Icons for Bullet Points ---
const ArrowRightIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);

// --- Feature Data ---
// The data has been expanded with a 'category' for the tags.
const featuresData = [
    {
        category: "Visualize",
        image: "https://placehold.co/600x400/0f172a/c4b5fd?text=Visualizer",
        title: "Interactive Visualizations",
        description: "See algorithms in action. Step through complex processes to build a strong mental model of how they operate.",
        points: [
            "Control execution speed",
            "Supports Sorting, Searching, Graphs",
            "Real-time data state",
        ],
    },
    {
        category: "Learn",
        image: "https://placehold.co/600x400/1e1b4b/a5b4fc?text=Guides",
        title: "In-Depth Theory & Guides",
        description: "Go beyond simple definitions with comprehensive explanations, complexity analysis, and practical use-cases.",
        points: [
            "Beginner-friendly articles",
            "Big O complexity analysis",
            "Multi-language code snippets",
        ],
    },
    {
        category: "Practice",
        image: "https://placehold.co/600x400/1e293b/93c5fd?text=Quizzes",
        title: "Challenging Quizzes",
        description: "Solidify your understanding and prepare for technical interviews with our targeted quizzes and practice problems.",
        points: [
            "Test core concepts",
            "Code challenges",
            "Detailed answer explanations",
        ],
    },
    {
        category: "Explore",
        image: "https://placehold.co/600x400/0c2a4d/60a5fa?text=Blog",
        title: "Insightful Blog Articles",
        description: "Read about industry trends, interview experiences, and deep dives into advanced computer science topics.",
        points: [
            "Written by industry experts",
            "Career advice and tips",
            "New articles published weekly",
        ],
    }
];

// --- The Main Features Component ---
function Features() {
    return (
        <section id="features" className="py-20 sm:py-32 bg-gray-50 dark:bg-black">
            <div className="container  w-[90vw] m-auto px-6">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800 dark:text-white">
                        A Complete Learning Ecosystem
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        From visualization to application, our platform provides all the tools you need to master DSA concepts.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuresData.map((feature, index) => (
                        <div 
                            key={index}
                            className="group relative p-1 rounded-2xl bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700 hover:from-indigo-400 dark:hover:from-indigo-600 transition-all duration-300"
                        >
                            <div className="bg-white dark:bg-gray-900 rounded-[14px] p-6 h-full flex flex-col">
                                <div className="overflow-hidden rounded-lg mb-6">
                                    <img 
                                        src={feature.image} 
                                        alt={`${feature.title} illustration`}
                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Error'; }}
                                    />
                                </div>
                                
                                <span className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start">
                                    {feature.category}
                                </span>
                                
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">
                                    {feature.description}
                                </p>
                                
                                <ul className="space-y-2 mb-6">
                                    {feature.points.map((point, pIndex) => (
                                        <li key={pIndex} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                            <span className="w-4 h-4 mr-2 bg-indigo-200 dark:bg-indigo-800 rounded-full flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-300" fill="currentColor" viewBox="0 0 16 16">
                                                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                                </svg>
                                            </span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>

                                <a href="#" className="mt-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    Read More <ArrowRightIcon />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
