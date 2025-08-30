
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from './useTheme';
import UserAvatar from './UserAvatar';

// --- Custom Hooks (included directly in this file) ---
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const updatePosition = () => setScrollPosition(window.pageYOffset);
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);
  return scrollPosition;
};

// --- Child Components (defined locally) ---
const AuthModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, onClose);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div ref={modalRef} className="relative w-full max-w-md p-8 m-4 space-y-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-white">Authentication Required</h2>
          <p className="text-center text-gray-400">Please sign up or login to continue</p>
          <div className="flex gap-4">
            <Link to="/signup" className="flex-1 px-4 py-3 text-center font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors" onClick={onClose}>Sign Up</Link>
            <Link to="/login" className="flex-1 px-4 py-3 text-center font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors" onClick={onClose}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileDropdown = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef} className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
        <UserAvatar photoURL={user.photoURL} name={user.displayName || user.email} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl shadow-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold truncate text-zinc-800 dark:text-zinc-200">Signed in as</p>
                <p className="text-sm font-medium truncate text-zinc-600 dark:text-zinc-400">{user.email}</p>
              </div>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-indigo-500 hover:text-white transition-colors">Your Profile</Link>
              <Link to="/create-post" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-indigo-500 hover:text-white transition-colors">Create Post</Link>
              <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors">Log Out</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Constants ---
const NAV_ITEMS = [{ name: "Home", sectionId: "home" }, { name: "Features", sectionId: "features" }, { name: "Reviews", sectionId: "reviews" }];
const SERVICE_ITEMS = [{ name: "Visualizer", path: "/visualizer" }, { name: "Algorithms", path: "/dsa" }, { name: "Blog", path: "/blog" }];

// --- Main Navbar Component ---
export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const scrollPosition = useScrollPosition();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mobileMenuRef = useRef(null);
  useOnClickOutside(mobileMenuRef, () => setIsMobileOpen(false));

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileOpen(false);
  };

  const handleNavClick = (item) => {
    setIsMobileOpen(false);
    if (item.sectionId) {
      if (window.location.pathname === "/") {
        document.getElementById(item.sectionId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/#${item.sectionId}`);
      }
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleServiceClick = (path) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    navigate(path);
    setIsMobileOpen(false);
    setIsServicesOpen(false);
  };
  
  const navClassOnScroll = scrollPosition > 10 ? "shadow-lg" : "shadow-md";
  const navShapeClass = isMobileOpen ? "rounded-3xl" : "rounded-full";

  return (
    <>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <nav ref={mobileMenuRef} className={`fixed top-2 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-zinc-800 dark:text-zinc-200 transition-all duration-300 ${navClassOnScroll} ${navShapeClass}`}>
        <div className="mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>
              <span className="hidden sm:inline text-black dark:text-white">Algo Vision</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => <button key={item.name} onClick={() => handleNavClick(item)} className="text-base font-medium px-4 py-2 rounded-full tracking-tight hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{item.name}</button>)}
              <div className="relative" onMouseEnter={() => setIsServicesOpen(true)} onMouseLeave={() => setIsServicesOpen(false)}>
                <button className="text-base font-medium px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors tracking-tight">Services</button>
                <AnimatePresence>
                {isServicesOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
                    {SERVICE_ITEMS.map((srv) => <button key={srv.name} onClick={() => handleServiceClick(srv.path)} className="block w-full text-left px-4 py-3 text-sm font-medium hover:bg-indigo-500 hover:text-white transition-colors tracking-tight">{srv.name}</button>)}
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className={`text-2xl transition-transform duration-300 ${theme === "dark" ? "rotate-180 scale-0" : "rotate-0 scale-100"}`}>☀️</span>
                <span className={`absolute text-2xl transition-transform duration-300 ${theme === "dark" ? "rotate-0 scale-100" : "-rotate-180 scale-0"}`}>🌙</span>
              </button>
              {user ? <ProfileDropdown user={user} logout={handleLogout} /> : <Link to="/signup" className="hidden sm:inline-block px-5 py-2 text-sm rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition-all">Sign Up</Link>}
              <button className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                <svg className={`transition-transform duration-300 ${isMobileOpen ? "rotate-90" : ""}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="md:hidden overflow-hidden">
            <div className="p-4 pt-2 border-t border-gray-200 dark:border-gray-700">
              {[...NAV_ITEMS, ...SERVICE_ITEMS].map((item) => <button key={item.name} onClick={() => item.path ? handleNavClick(item) : handleServiceClick(item.path)} className="w-full text-left font-semibold p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">{item.name}</button>)}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              {!user && <Link to="/signup" onClick={() => setIsMobileOpen(false)} className="block w-full mt-2 px-5 py-3 text-center rounded-lg bg-indigo-600 text-white font-semibold">Sign Up / Login</Link>}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </nav>
    </>
  );
}
