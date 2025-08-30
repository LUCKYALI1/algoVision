import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import { MailIcon, LockIcon, GoogleIcon } from '../components/icons';
import { validateEmail, validatePassword } from '../utils/validation';

import { db } from '../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const { login, googleSignIn, user } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveUserToFirestore = async (userObj) => {
    if (!userObj || !userObj.uid) return;

    const userRef = doc(db, "users", userObj.uid);

    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: userObj.uid,
          email: userObj.email,
          displayName: userObj.displayName || "Anonymous",
          createdAt: new Date()
        });
        console.log("✅ User saved in Firestore:", userObj.uid);
      } else {
        console.log("ℹ️ User already exists in Firestore:", userObj.uid);
      }
    } catch (err) {
      console.error("❌ Error saving user to Firestore:", err);
      setServerError("Failed to save user. Please try again.");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      console.log("Login result:", result);

      if (result.success && result.user) {
        await saveUserToFirestore(result.user);
        navigate('/');
      } else {
        handleFirebaseAuthError(result.error);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleSignIn();
      console.log("Google sign-in result:", result);

      if (result.user) {
        await saveUserToFirestore(result.user);
        navigate('/');
      }
    } catch (err) {
      console.error("❌ Google sign-in failed:", err);
      setServerError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseAuthError = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        setServerError("Invalid email or password.");
        break;
      case 'auth/invalid-email':
        setErrors({ email: "Invalid email format." });
        break;
      default:
        setServerError("An error occurred during login. Please try again.");
        break;
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue" error={serverError}>
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="relative">
          <MailIcon />
          <input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email Address"
            onChange={handleChange}
            disabled={loading}
            className={`w-full pl-10 pr-4 py-3 bg-white text-black dark:bg-black dark:text-white border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>
        <div className="relative">
          <LockIcon />
          <input
            name="password"
            type="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            disabled={loading}
            className={`w-full pl-10 pr-4 py-3 bg-white text-black dark:bg-black dark:text-white border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50`}
          />
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="flex items-center justify-center my-6">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="mx-4 text-sm text-gray-400">OR</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 font-medium text-gray-800 bg-gray-200 hover:bg-gray-300 dark:bg-white dark:hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      <p className="mt-6 text-sm text-center text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-blue-400 hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
