
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef).then(docSnap => {
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          // Pre-fill with basic info if no profile exists
          setFormData({
            email: user.email,
            displayName: user.displayName || ''
          });
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const userRef = doc(db, 'users', user.uid);
      const newDisplayName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();

      await setDoc(userRef, {
        ...formData,
        displayName: newDisplayName,
        email: user.email, // ensure email is not changed
      }, { merge: true });

      if (newDisplayName) {
        await updateProfile(user, { displayName: newDisplayName });
      }

      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl p-8 m-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Edit Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="firstName" value={formData.firstName || ''} onChange={handleChange} placeholder="First Name" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg" />
            <input name="lastName" value={formData.lastName || ''} onChange={handleChange} placeholder="Last Name" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg" />
          </div>
          <input name="username" value={formData.username || ''} onChange={handleChange} placeholder="Username" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg" />
          <input name="email" value={formData.email || ''} disabled placeholder="Email" className="w-full p-3 bg-gray-200 dark:bg-gray-600 rounded-lg cursor-not-allowed" />
          <input name="profession" value={formData.profession || ''} onChange={handleChange} placeholder="Profession" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="city" value={formData.city || ''} onChange={handleChange} placeholder="City" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg" />
            <input name="age" type="number" value={formData.age || ''} onChange={handleChange} placeholder="Age" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg" />
            <select name="sex" value={formData.sex || ''} onChange={handleChange} className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <option value="" disabled>Sex</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
