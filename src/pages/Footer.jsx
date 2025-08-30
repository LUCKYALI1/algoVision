import React from 'react';

// --- SVG Icons ---
const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-400 h-7 w-7 sm:h-8 sm:w-8">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/LUCKYALI1', icon: <svg fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/luckyalim/', icon: <svg fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg> },
];

const footerLinks = {
    platform: [
        { name: 'Visualizer', href: 'Visualizer' },
        { name: 'Algorithms', href: 'dsa' },
        { name: 'Quizzes', href: 'home' },
        { name: 'Blog', href: 'blog' },
    ],
    company: [
        { name: 'About Us', href: '#' },
        { name: 'Contact', href: '#' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
    ],
};

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-gray-50 dark:bg-black text-white overflow-hidden ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10 w-[90vw] m-auto">
                {/* Main footer content */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
                    {/* Logo and social links section */}
                    <div className="flex-shrink-0 text-center lg:text-left lg:max-w-sm">
                        <div className="flex items-center justify-center lg:justify-start mb-4">
                            <Logo />
                            <span className="text-black dark:text-white  ml-2 text-xl font-bold">Algo Vision</span>
                        </div>
                        <p className="text-base text-gray-400">
                            Mastering data structures and algorithms through visualization, practice, and in-depth learning.
                        </p>
                        <div className="flex space-x-4 mt-6 justify-center lg:justify-start">
                            {socialLinks.map((social) => (
                                <a key={social.name} href={social.href} className="text-gray-400 hover:text-indigo-500 transition-transform duration-300 hover:scale-110">
                                    <span className="sr-only">{social.name}</span>
                                    <div className="h-6 w-6">{social.icon}</div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link sections container */}
                    <div className="flex-grow grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
                        <div>
                            <h3 className=" text-black dark:text-white   text-sm font-semibold tracking-wider uppercase">Platform</h3>
                            <ul className="mt-4 space-y-3">
                                {footerLinks.platform.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-base text-gray-400 hover:text-indigo-500 transition-colors duration-300">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-black dark:text-white   text-sm font-semibold tracking-wider uppercase">Company</h3>
                            <ul className="mt-4 space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-base text-gray-400 hover:text-indigo-500 transition-colors duration-300">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-black dark:text-white  text-sm font-semibold tracking-wider uppercase">Legal</h3>
                            <ul className="mt-4 space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-base text-gray-400 hover:text-indigo-500 transition-colors duration-300">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 md:mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm space-y-2">
                    <h4 className='text-gray-400'>Created By Lucky Ali With ❤️</h4>
                    <p>&copy; {currentYear} Algo Vision. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
