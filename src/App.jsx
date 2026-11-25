import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NoticeBar from './components/NoticeBar'
import { ContentProvider } from './content/ContentContext'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Research from './pages/Research'
import Membership from './pages/Membership'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import News from './pages/News'
import NewsArticle from './pages/NewsArticle'

// The admin dashboard is only downloaded when someone opens /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'))

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
      className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-accent-gold text-deep-purple flex items-center justify-center shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-200"
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
      // Wait for the page transition before scrolling to the section
      const timer = setTimeout(() => {
        try { document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch { /* invalid selector */ }
      }, 400)
      return () => clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function PublicSite() {
  const location = useLocation()
  return (
    <ContentProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-accent-gold focus:text-deep-purple focus:px-4 focus:py-2 font-rajdhani font-bold">
        Skip to content
      </a>
      <ScrollHandler />
      <Navbar />
      <div className="pt-16" id="main">
        <NoticeBar />
        <AnimatePresence mode="sync">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/research" element={<Research />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsArticle />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
      <ScrollToTop />
    </ContentProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-deep-purple" />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  )
}
