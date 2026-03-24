import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Research from './pages/Research'
import Membership from './pages/Membership'
import Contact from './pages/Contact'

function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-accent-gold text-deep-purple flex items-center justify-center shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[4px_6px_0_rgba(0,0,0,0.35)] transition-all duration-200"
      aria-label="Scroll to top"
    >
      <FiArrowUp size={20} strokeWidth={2.5} />
    </button>
  )
}

function ScrollHandler() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Wait for page transition + render before scrolling
      const timer = setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) {
          const offset = 80
          const top = el.getBoundingClientRect().top + window.scrollY - offset
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }, 350)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/research" element={<Research />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollHandler />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <ScrollToTop />
    </BrowserRouter>
  )
}
