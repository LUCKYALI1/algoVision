import { Outlet } from "react-router-dom";
import Home from "./pages/home";
import Features from "./pages/Features";
import Reviews from "./pages/Reviews";
import Footer from "./pages/Footer";

function Layout() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Optional: you can render Home or other default content */}
      <Home />
      <Features />
      <Reviews />
      <Footer />

      {/* Nested routes will render here */}
      {/* <Outlet /> */}
    </main>
  );
}

export default Layout;
