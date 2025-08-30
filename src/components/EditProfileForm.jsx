
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const EditProfileForm = ({ onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(data);
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
        email: user.email,
      }, { merge: true });

      await updateProfile(user, { 
        displayName: newDisplayName,
      });

      if (onSave) onSave();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

export default EditProfileForm;
