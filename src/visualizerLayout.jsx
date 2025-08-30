import React from 'react'
import AlgorithmHub from './pages/visualizerhub'
import Home from './pages/home'
import Reviews from './pages/Reviews'
import Footer from './pages/Footer'

function visualizerLayout() {
  return (
    <div>
       <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        {/* <Home /> */}
       <AlgorithmHub />
       <Reviews />
       <Footer />
      {/* <Outlet /> Nested DSA pages render here */}
    </main>
    </div>
  )
}

export default visualizerLayout
