import { Outlet } from "react-router-dom";
import DsaHome from "./pages/dsaHome";
import DsaTopicsList from "./pages/dsaTopics";
import Reviews from "./pages/Reviews";
import Footer from "./pages/Footer";




function DsaAlgorithmLayout() {
  return (
    <main className="min-h-full bg-white dark:bg-black transition-colors duration-300">
      <DsaHome />
      <DsaTopicsList />
      <Reviews />
      <Footer />
      {/* <Outlet /> Nested DSA pages render here */}
    </main>
  );
}

export default DsaAlgorithmLayout;
