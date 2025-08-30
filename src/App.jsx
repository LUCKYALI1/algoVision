import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import { AuthProvider } from './contexts/AuthContext.jsx';

import MainLayout from "./layout";
import DSAAlgorithmLayout from "./dsaAlgorithmLayout";
import Navbar from "../src/components/navbar";
import VisualizerLayout from "./visualizerLayout";
import BlogPageLayout from "./BlogPageLayout.jsx";

import Home from "./pages/home";
import Features from "./pages/Features";
import Reviews from "./pages/Reviews";
import Footer from "./pages/Footer";
import DsaHome from "./pages/dsaHome";
import BinarySearch from "./visu_component/Binarysearch";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import EditProfilePage from "./pages/EditProfilePage";
import GuestGuard from "./components/GuestGuard.jsx";


function App() {
  return (
  
    <AuthProvider>
      <ThemeProvider>
        <Navbar />
        <Routes>
          {/* Main Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="features" element={<Features />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="footer" element={<Footer />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<GuestGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:postId" element={<BlogPost />} />
          <Route path="/faq" element={<FAQ />} />

          {/* DSA Layout Routes */}
          <Route path="/dsa" element={<DSAAlgorithmLayout />}>
            <Route index element={<DsaHome />} />
          </Route>
          <Route path="/visualizer" element={<VisualizerLayout />}>
            <Route index element={<BinarySearch />} />
          </Route>
          <Route path="/blog" element={<BlogPageLayout />}>
          </Route>

          {/* Fallback for 404 */}
          <Route path="*" element={<div className="p-10 text-center">Page Not Found</div>} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
