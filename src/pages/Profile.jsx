import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, collectionGroup, orderBy, doc, getDoc, deleteDoc } from 'firebase/firestore';
import UserAvatar from '../components/UserAvatar';
import EditProfileForm from '../components/EditProfileForm';
import { deleteUser } from "firebase/auth";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch user profile
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }

        // Fetch user's posts
        const postsQuery = query(collection(db, 'posts'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);
        setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [user]);

  const fetchReviews = async () => {
    if (!user || reviews.length > 0) return; // Don't refetch if already loaded
    setLoading(true);
    try {
      // Fetch user's website reviews
      const websiteReviewsQuery = query(collection(db, 'website-reviews'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));
      const websiteReviewsSnapshot = await getDocs(websiteReviewsQuery);
      const websiteReviews = websiteReviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setReviews(websiteReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    if (!user || questions.length > 0) return; // Don't refetch if already loaded
    setLoading(true);
    try {
      const questionsQuery = query(collection(db, 'questions'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));
      const questionsSnapshot = await getDocs(questionsQuery);
      setQuestions(questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'reviews') {
      fetchReviews();
    } else if (tab === 'questions') {
      fetchQuestions();
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      try {
        // Delete user's posts, reviews, questions etc.
        const postsQuery = query(collection(db, 'posts'), where('authorId', '==', user.uid));
        const postsSnapshot = await getDocs(postsQuery);
        postsSnapshot.forEach(async (postDoc) => {
          await deleteDoc(doc(db, 'posts', postDoc.id));
        });

        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(user);
        window.location.href = "/";
      } catch (error) {
        console.error("Error deleting account: ", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  if (authLoading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const renderContent = () => {
    if (loading && (activeTab === 'reviews' || activeTab === 'questions')) return <div className="p-10 text-center">Loading content...</div>;

    switch (activeTab) {
      case 'posts':
        return posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col">
                <div className="flex-grow">
                  <h3 className="font-bold text-xl mb-2 text-black dark:text-white">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{post.createdAt?.toDate().toLocaleDateString()}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{post.content?.substring(0, 100) + '...'}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button onClick={() => {}} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Edit</button>
                  <button onClick={() => handleDeletePost(post.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : <p>You haven't created any posts yet.</p>;
      case 'reviews':
        return reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <p><strong>Rating: {review.rating}/5</strong></p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{review.text || review.review}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Reviewed on {review.createdAt?.toDate().toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : <p>You haven't written any reviews yet.</p>;
      case 'questions':
        return questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map(question => (
              <div key={question.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <p className="text-gray-700 dark:text-gray-300">{question.question}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Asked on {question.createdAt?.toDate().toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : <p>You haven't asked any questions yet.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen pt-20">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p>{message}</p>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center">
          <UserAvatar name={profileData?.displayName || user.email} size="h-24 w-24" />
          <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{profileData?.displayName || 'Anonymous User'}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">{user.email}</p>
            <p className="text-md text-gray-600 dark:text-gray-300 mt-2">{profileData?.profession}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profileData?.city}</p>
            <div className="mt-4 space-x-2">
              <button onClick={() => setIsEditModalOpen(true)} className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">Edit Profile</button>
              <button onClick={handleDeleteAccount} className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg">Delete Account</button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('posts')} className={`${activeTab === 'posts' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>My Posts</button>
              <button onClick={() => handleTabClick('reviews')} className={`${activeTab === 'reviews' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>My Reviews</button>
              <button onClick={() => handleTabClick('questions')} className={`${activeTab === 'questions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>My Questions</button>
            </nav>
          </div>
        </div>

        <div>
          {renderContent()}
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Edit Profile</h2>
              <EditProfileForm onSave={() => {
                setIsEditModalOpen(false);
                fetchData();
              }} />
              <button onClick={() => setIsEditModalOpen(false)} className="mt-4 w-full py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-lg">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;