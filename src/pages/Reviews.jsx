import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Assuming you have firebase configured
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

// --- SVG Icons ---
const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg 
        className={`w-6 h-6 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        fill="currentColor" 
        viewBox="0 0 20 20"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const VerifiedIcon = () => (
    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a.75.75 0 00-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" />
    </svg>
);

// --- The Main Reviews Component ---
function Reviews() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ name: '', email: '', review: '', rating: 0 });
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsCollection = await getDocs(collection(db, "website-reviews"));
                const reviewsData = reviewsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReviews(reviewsData);
            } catch (err) {
                console.error("Error fetching reviews: ", err);
                setError("Failed to load reviews.");
            }
        };
        fetchReviews();
    }, []);

    useEffect(() => {
        if (user) {
            setNewReview(prev => ({ ...prev, name: user.displayName || '', email: user.email || '' }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setNewReview(prev => ({ ...prev, [id]: value }));
    };

    const handleRatingClick = (rate) => {
        setNewReview(prev => ({ ...prev, rating: rate }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.review || newReview.rating === 0) {
            setError("Please provide a rating and a review.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const reviewData = {
                review: newReview.review,
                rating: newReview.rating,
                createdAt: serverTimestamp(),
                authorId: user ? user.uid : null,
                authorName: user ? user.displayName : newReview.name,
                authorEmail: user ? user.email : newReview.email,
                avatar: user ? user.photoURL : `https://i.pravatar.cc/150?u=${newReview.email}`
            };

            const docRef = await addDoc(collection(db, "website-reviews"), reviewData);
            setReviews(prev => [...prev, { id: docRef.id, ...reviewData, createdAt: new Date() }]);
            setNewReview({ name: user ? user.displayName : '', email: user ? user.email : '', review: '', rating: 0 });
        } catch (err) {
            console.error("Error submitting review: ", err);
            setError("Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="reviews" className="py-20 sm:py-32 bg-gray-50 dark:bg-black">
            <style>{`.custom-scrollbar::-webkit-scrollbar{height:8px;}.custom-scrollbar::-webkit-scrollbar-track{background:#f1f5f9;border-radius:10px;}.dark .custom-scrollbar::-webkit-scrollbar-track{background:#1e293b;}.custom-scrollbar::-webkit-scrollbar-thumb{background:#94a3b8;border-radius:10px;}.dark .custom-scrollbar::-webkit-scrollbar-thumb{background:#475569;}.custom-scrollbar::-webkit-scrollbar-thumb:hover{background:#64748b;}.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover{background:#64748b;}`}</style>

            <div className="container w-[90vw] m-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    
                    <div className="lg:pr-8">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800 dark:text-white text-center lg:text-left">
                            Loved by Students & Developers
                        </h2>
                        <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 text-center lg:text-left">
                            See what our users are saying about their learning experience.
                        </p>

                        <div className="mt-12 w-full custom-scrollbar flex gap-6 pb-4 overflow-x-auto">
                            {reviews.map((review) => (
                                <div key={review.id} className="flex-shrink-0 w-[85vw] sm:w-80 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} />)}
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6">"{review.review}"</p>
                                    <div className="flex items-center">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{review.authorName}</p>
                                            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                                                <VerifiedIcon />
                                                <span className="ml-1">Verified Review</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="group relative bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
                        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center sm:text-left">Share Your Experience</h3>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">Name</label>
                                <input type="text" id="name" value={newReview.name} onChange={handleInputChange} disabled={!!user} className=" dark:text-white mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition text-base" placeholder="Jane Doe" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input type="email" id="email" value={newReview.email} onChange={handleInputChange} disabled={!!user} className=" dark:text-white mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition text-base" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => {
                                        const rate = index + 1;
                                        return (
                                            <StarIcon 
                                                key={rate}
                                                filled={rate <= (hoverRating || newReview.rating)}
                                                onClick={() => handleRatingClick(rate)}
                                                onMouseEnter={() => setHoverRating(rate)}
                                                onMouseLeave={() => setHoverRating(0)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="review" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Review</label>
                                <textarea id="review" rows="4" value={newReview.review} onChange={handleInputChange} className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition text-base" placeholder="Your feedback is invaluable..."></textarea>
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <button type="submit" disabled={loading} className="w-full px-6 py-3 text-base sm:text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition-all duration-300">
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Reviews;
