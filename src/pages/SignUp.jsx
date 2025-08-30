import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import { UserIcon, MailIcon, LockIcon, GoogleIcon } from '../components/icons';
import { validateName, validateEmail, validatePassword } from '../utils/validation';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";


const SignUp = () => {
  const navigate = useNavigate();
  const { signup, googleSignIn, user } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);


  

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveUserToFirestore = async (userObj, isGoogleSignIn = false) => {
    if (!userObj || !userObj.uid) return;

    const userRef = doc(db, "users", userObj.uid);

    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        let userData = {
          uid: userObj.uid,
          email: userObj.email,
          createdAt: new Date(),
        };

        if (isGoogleSignIn) {
          const [firstName, lastName] = userObj.displayName.split(' ');
          userData.firstName = firstName || '';
          userData.lastName = lastName || '';
          userData.displayName = userObj.displayName;
        } else {
          const [firstName, lastName] = form.name.split(' ');
          userData.firstName = firstName || '';
          userData.lastName = lastName || '';
          userData.displayName = form.name;
        }

        await setDoc(userRef, userData);
        console.log("✅ User saved to Firestore:", userObj.uid);
        return true; // New user
      } else {
        console.log("ℹ️ User already exists in Firestore:", userObj.uid);
        return false; // Existing user
      }
    } catch (err) {
      console.error("❌ Firestore save error:", err);
      setServerError("Failed to save user. Please try again.");
      return false;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    if (nameError || emailError || passwordError) {
      setErrors({ name: nameError, email: emailError, password: passwordError });
      return;
    }

    setLoading(true);
    try {
      const result = await signup(form.email, form.password);
      if (result.user) {
        const isNewUser = await saveUserToFirestore(result.user);
        if (isNewUser) {
          navigate('/profile', { state: { message: `Hello ${form.name}, please complete your profile in the profile section.` } });
        } else {
          navigate('/');
        }
      } else {
        setServerError("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleSignIn();
      if (result.user) {
        const isNewUser = await saveUserToFirestore(result.user, true);
        if (isNewUser) {
          navigate('/profile', { state: { message: `Hello ${result.user.displayName}, please complete your profile in the profile section.` } });
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error("❌ Google sign-in error:", err);
      setServerError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an Account" subtitle="Join us to get started" error={serverError}>
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="relative">
          <UserIcon />
          <input name="name" type="text" value={form.name} placeholder="Full Name" onChange={handleChange}
            disabled={loading}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-600'}`} />
          {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
        </div>
        <div className="relative">
          <MailIcon />
          <input name="email" type="email" value={form.email} placeholder="Email" onChange={handleChange}
            disabled={loading}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-600'}`} />
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>
        <div className="relative">
          <LockIcon />
          <input name="password" type="password" value={form.password} placeholder="Password" onChange={handleChange}
            disabled={loading}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-600'}`} />
          {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg">
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="my-6 flex items-center justify-center">
        <span className="mx-4 text-sm text-gray-400">OR</span>
      </div>

      <button onClick={handleGoogleSignIn} disabled={loading} className="w-full py-3 bg-gray-200 text-black rounded-lg flex items-center justify-center">
        <GoogleIcon /> Sign up with Google
      </button>

      <p className="mt-6 text-center text-gray-400">
        Already have an account? <Link to="/login" className="text-blue-400">Login</Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
