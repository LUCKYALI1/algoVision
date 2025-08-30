import React  from 'react';


function DsaHome() {
    
    return (
        <div className="pt-20 bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* --- Main Content --- */}
            <main className="container mx-auto px-6 py-12 md:py-20">

                {/* Hero Section */}
                <section className="text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black dark:text-white leading-tight mb-4">
                            <span className='text-indigo-500 dark:text-indigo-400'>Master</span> the Building Blocks of <span className='text-indigo-500 dark:text-indigo-400'>Code</span>.
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                            Dive deep into Data Structures and Algorithms. Go from theory to practice with clear explanations, visual diagrams, and ready-to-use code examples.
                        </p>
                    </div>
                </section>

                {/* Categories Section */}
                <section id="categories" className="my-20 md:my-24">
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        
                        {/* Data Structures Card */}
                        <a href="#" className="block bg-white dark:bg-slate-900 p-8 rounded-xl shadow-md hover:shadow-xl dark:border dark:border-slate-800 dark:hover:border-slate-700 hover:-translate-y-2 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-4">
                                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81a1.5 1.5 0 00-2.122-2.122z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-black dark:text-white">Data Structures</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">
                                Learn how to organize, manage, and store data effectively. Explore fundamental structures like Arrays, Linked Lists, Trees, Graphs, and more.
                            </p>
                        </a>

                        {/* Algorithms Card */}
                        <a href="#" className="block bg-white dark:bg-slate-900 p-8 rounded-xl shadow-md hover:shadow-xl dark:border dark:border-slate-800 dark:hover:border-slate-700 hover:-translate-y-2 transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg mr-4">
                                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-black dark:text-white">Algorithms</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">
                                Master the step-by-step procedures for solving problems. Dive into Sorting, Searching, Graph Traversal, and Dynamic Programming techniques.
                            </p>
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default DsaHome;