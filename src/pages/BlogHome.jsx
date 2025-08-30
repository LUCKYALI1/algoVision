import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

// --- Category Data with SVG Icons ---
const categories = [
    { name: 'All', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /> },
    { name: 'Array & String', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /> },
    { name: 'Searching & Sorting', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" /> },
    { name: 'Stack & Queue', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { name: 'Binary Trees', icon: <path d="M15 15l-3-3m0 0l-3 3m3-3V3m0 12v3m-3-3H6m12 0h3m-3 3c0 .552-.448 1-1 1h-4c-.552 0-1-.448-1-1v-3c0-.552.448-1 1-1h4c.552 0 1 .448 1 1v3z" /> },
    { name: 'Graphs', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6.375 17.25a9.375 9.375 0 0114.25-14.25" /> },
    { name: 'DP', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6.75a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0zM10.5 17.25a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0zM19.5 6.75a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0zM19.5 17.25a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" /> },
];

// --- Reusable Article Card Component ---
const ArticleCard = ({ id, title, authorName, excerpt, category }) => (
    <Link to={`/post/${id}`} className="block group bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md hover:shadow-xl dark:border dark:border-slate-800 dark:hover:border-slate-700 hover:-translate-y-2 transition-all duration-300">
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2.5 py-1 rounded-full">{category || 'General'}</span>
        <h3 className="text-lg md:text-xl font-bold mt-4 mb-2 text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h3>
        
        <div
  className="prose prose-slate dark:prose-invert mb-4"
  dangerouslySetInnerHTML={{ __html: excerpt }}
></div>
        {/* <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">{excerpt}</p> */}
        <span className="font-semibold text-sm text-indigo-600 dark:text-indigo-400 group-hover:underline">Read More &rarr;</span>
    </Link>
);

// --- Main Homepage Component ---
function BlogHome() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsCollection = collection(db, 'posts');
                const q = query(postsCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPosts(postsData);
            } catch (err) {
                setError('Failed to fetch posts.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredArticles = useMemo(() => {
        if (selectedCategory === 'All') return posts;
        return posts.filter(article => article.category === selectedCategory);
    }, [selectedCategory, posts]);

    return (
        <div className=" px-2 bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .card-fade-in { animation: fadeIn 0.5s ease-out forwards; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <main className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
                {/* Hero Section */}
                <section className="text-center relative">
                    <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '1.5rem 1.5rem' }}></div>
                    <div className="relative z-10 max-w-3xl mx-auto pt-20 md:pt-12">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black dark:text-white leading-tight mb-4">
                            <span className='text-indigo-500 dark:text-indigo-400'>Demystifying</span> Data Structures & Algorithms
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8">
                            Welcome to AlgoVerse, a community-driven platform for learning, teaching, and mastering the core concepts of computer science.
                        </p>
                    </div>
                </section>

                {/* Categories Section */}
                <section id="categories" className="my-16 md:my-20">
                    <h2 className="text-3xl font-bold text-center mb-8">Explore Topics</h2>
                    <div className="relative">
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 no-scrollbar px-4 sm:px-0 -mx-4 sm:mx-0 justify-start sm:justify-center">
                            {categories.map(({ name, icon }) => (
                                <button
                                    key={name}
                                    onClick={() => setSelectedCategory(name)}
                                    className={`flex items-center gap-2.5 flex-shrink-0 px-4 py-2.5 text-sm font-semibold rounded-full border-2 transition-all duration-300
                                        ${selectedCategory === name ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">{icon}</svg>
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Articles Section */}
                <section id="featured" className="my-16 md:my-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {loading && <p>Loading posts...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {!loading && !error && filteredArticles.map((article, index) => (
                            <div key={article.id} className="card-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                <ArticleCard {...article} excerpt={article.content.substring(0, 100) + '...'} />
                            </div>
                        ))}
                        {!loading && !error && filteredArticles.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-xl">
                                <p className="text-slate-500 dark:text-slate-400">No articles found. Be the first to post!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Call to Action Section */}
                <section id="contribute" className="my-20 md:my-24 bg-indigo-600 dark:bg-indigo-500 rounded-2xl text-white " >
                    <div className="max-w-4xl mx-auto text-center py-16 px-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Share Your Knowledge</h2>
                        <p className="text-lg text-indigo-200 dark:text-indigo-100 mb-8 max-w-2xl mx-auto">
                            Become a contributor and help thousands of developers grow. Share your insights and be a part of our thriving community.
                        </p>
                        <Link to="/create-post" className="bg-white hover:bg-slate-100 text-indigo-600 font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg">
                           Create a Post
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default BlogHome;