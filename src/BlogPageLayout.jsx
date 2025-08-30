import React from 'react'
import BlogHome from './pages/BlogHome'
import FAQ from './pages/FAQ'
import Footer from './pages/Footer'
import Reviews from './pages/Reviews'

function BlogPageLayout() {
  return (
    <div>
         <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
            <BlogHome />
            <FAQ />
            <Reviews />
            <Footer />

         </main>
      
    </div>
  )
}

export default BlogPageLayout
