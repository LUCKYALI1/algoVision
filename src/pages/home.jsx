import React from 'react';
import { Link } from "react-router-dom";

// --- Component Dependencies ---
// This component uses a custom Button. A placeholder is provided for demonstration.
// In your project, you would replace this with your actual Button component import.
// import Button from "../components/button";

// Placeholder Button component for demonstration
const Button = ({ children, href, className, primary = false }) => {
    const baseClasses = "w-full sm:w-auto px-8 py-3.5 text-base sm:text-lg font-semibold rounded-full shadow-lg active:scale-95 transition-all duration-300";
    const primaryClasses = "text-white bg-indigo-600 hover:bg-indigo-700";
    const secondaryClasses = "text-gray-800 dark:text-white bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80";

    const combinedClasses = `${baseClasses} ${primary ? primaryClasses : secondaryClasses} ${className || ''}`;

    return (
        <a href={href} className={combinedClasses}>
            {children}
        </a>
    );
};
// --- End of Placeholder ---


// SVG Illustration component
const VectorIllustration = () => (
    <div className="hidden lg:block relative w-full h-full">
        {/* Keyframes for the floating animation, injected via a style tag */}
        <style>
            {`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .floating-element {
                    animation: float 6s ease-in-out infinite;
                }
                .floating-element-delay {
                    animation: float 6s ease-in-out infinite 1.2s;
                }
            `}
        </style>

        {/* Main Abstract SVG */}
        <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto opacity-80 dark:opacity-60">
                <path fill="#818CF8" d="M49.8,-68.8C64.9,-59.8,77.8,-45.5,82.6,-28.8C87.4,-12.1,84.1,6.9,76.5,23.1C68.9,39.3,57,52.7,42.8,63.1C28.6,73.5,12.1,81,-5.5,83.1C-23.1,85.2,-42.2,81.9,-56.9,71.5C-71.6,61.1,-81.9,43.6,-86.3,25.4C-90.7,7.2,-89.2,-11.7,-81.1,-27.3C-73,-42.9,-58.3,-55.2,-43.1,-64.3C-27.9,-73.4,-12.2,-79.3,3.1,-81.4C18.4,-83.5,34.7,-81.7,49.8,-68.8Z" transform="translate(100 100)" />
                <g className="floating-element" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="100" cy="60" r="8" />
                    <circle cx="70" cy="100" r="8" />
                    <circle cx="130" cy="100" r="8" />
                    <circle cx="55" cy="140" r="8" />
                    <circle cx="85" cy="140" r="8" />
                    <circle cx="115" cy="140" r="8" />
                    <line x1="100" y1="68" x2="70" y2="92" />
                    <line x1="100" y1="68" x2="130" y2="92" />
                    <line x1="70" y1="108" x2="55" y2="132" />
                    <line x1="70" y1="108" x2="85" y2="132" />
                    <line x1="130" y1="108" x2="115" y2="132" />
                </g>
            </svg>
        </div>
        {/* Decorative Floating Elements */}
        <div className="absolute top-10 left-5 w-20 h-20 floating-element">
            <svg viewBox="0 0 100 100" className="opacity-50 dark:opacity-30">
                <rect x="10" y="10" width="80" height="15" rx="5" fill="#A78BFA" />
                <rect x="10" y="35" width="60" height="15" rx="5" fill="#A78BFA" />
                <rect x="10" y="60" width="70" height="15" rx="5" fill="#A78BFA" />
            </svg>
        </div>
        <div className="absolute bottom-10 right-5 w-24 h-24 floating-element-delay">
            <svg viewBox="0 0 100 100" className="opacity-50 dark:opacity-30">
                <path d="M20 80 L50 20 L80 80 Z" fill="#60A5FA" />
            </svg>
        </div>
    </div>
);


function Home(prop) {
    return (
        <main id="home" className="relative overflow-hidden">
            <div className="min-h-screen w-full pt-32 sm:pt-28 pb-16 flex items-center justify-center 
            bg-gradient-to-br from-pink-100 via-purple-100 to-blue-200
            dark:bg-gradient-to-tl dark:from-black dark:via-gray-900 dark:to-indigo-900
            transition-colors duration-1000">

                <div className="container  w-[90vw] m-auto  px-4 sm:px-6 z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Text Content & CTAs */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-800 dark:text-white">
                                Master Data Structures & Algorithms, <span className="text-indigo-600 dark:text-indigo-400">Visually.</span>
                            </h1>
                            <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                                Dive deep into the world of DSA with interactive visualizations, comprehensive guides, and challenging quizzes. Understand complex concepts, read insightful blogs, and prepare for your next interview.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link to="/visualizer">
                                    <Button primary>Start Visualizing</Button>
                                </Link>


                                <Link to="/dsa">
                                    <Button>Explore Topics</Button>
                                </Link>
                            </div>
                        </div>

                        {/* SVG Illustration Section */}
                        <VectorIllustration />

                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;
