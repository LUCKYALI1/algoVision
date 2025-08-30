import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, getDocs, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from '../components/UserAvatar';

const StarRating = ({ rating, setRating }) => (
  <div className="flex items-center">
    {[5, 4, 3, 2, 1].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating ? setRating(star) : null}
        className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} ${setRating ? 'cursor-pointer' : 'cursor-default'}`}
      >
        ★
      </button>
    ))}
  </div>
);

const BlogPost = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      const reviewsRef = collection(db, 'posts', postId, 'reviews');
      const q = query(reviewsRef, orderBy('createdAt', 'desc'));
      const reviewsSnap = await getDocs(q);
      const reviewsData = reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsData);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    const fetchPostAndReviews = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const postData = { id: postSnap.id, ...postSnap.data() };
          setPost(postData);

          // Fetch author data
          const authorRef = doc(db, 'users', postData.authorId);
          const authorSnap = await getDoc(authorRef);
          if (authorSnap.exists()) {
            setAuthor(authorSnap.data());
          }
        } else {
          setError('Post not found.');
        }

        await fetchReviews();

      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndReviews();
  }, [postId]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    if (!user) {
      alert('Please log in to leave a review.');
      return;
    }

    try {
      const reviewsRef = collection(db, 'posts', postId, 'reviews');
      await addDoc(reviewsRef, {
        text: newReview,
        rating,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      });

      setNewReview('');
      setRating(5);
      await fetchReviews();
    } catch (err) {
      console.error("Error adding review:", err);
      alert('Failed to add review.');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading post...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!post) return <div className="p-10 text-center">Post not found.</div>;

  return (
    <div className="bg-white dark:bg-black min-h-screen md:pt-20">
    <div className="bg-white dark:bg-black w-[90vw] md:w-[70vw] m-auto text-black dark:text-white">
      {/* Hero Section */}
      <div className="relative h-96 ">
        {/* Placeholder for featured image */}
        <div className="absolute inset-0 "></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-black dark:text-white tracking-tight">{post.title}</h1>
          <div className="mt-4 flex items-center">
            <UserAvatar name={post.authorName} />
            <div className="ml-4">
              <p className="font-semibold text-black dark:text-white">{post.authorName}</p>
              <p className="text-sm text-gray-500">{post.createdAt?.toDate().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-2">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About the Author</h3>
            <div className="flex items-center">
              <UserAvatar name={post.authorName} />
              <p className="ml-4 font-semibold text-gray-800 dark:text-gray-200">{post.authorName}</p>
            </div>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-12 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Community Reviews</h2>
        
        {/* Review Form */}
        {user && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium mb-2">Your Rating</label>
                <StarRating rating={rating} setRating={setRating} />
              </div>
              <div>
                <label htmlFor="review" className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  id="review"
                  rows={4}
                  value={newReview}
                  onChange={e => setNewReview(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Share your thoughts..."
                />
              </div>
              <button type="submit" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Submit Review
              </button>
            </form>
          </div>
        )}

        {/* Existing Reviews */}
        <div className="space-y-8">
          {reviews.map(review => (
            <div key={review.id} className="flex items-start space-x-4">
              <UserAvatar name={review.authorName} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{review.authorName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{review.createdAt?.toDate().toLocaleDateString()}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{review.text}</p>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">No reviews yet. Be the first to share your thoughts!</p>}
        </div>
      </section>
    </div>
    </div>
  );
};

export default BlogPost;