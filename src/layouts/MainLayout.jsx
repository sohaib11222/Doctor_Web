import { useEffect } from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import ScrollToTop from '../components/common/ScrollToTop'

const MainLayout = ({ children, showHeader = true, showFooter = true }) => {
  useEffect(() => {
    // Initialize AOS animations
    if (typeof window !== 'undefined') {
      import('aos').then((AOS) => {
        AOS.init({
          duration: 1000,
          once: true,
        })
      })
    }

    // Initialize theme script
    if (typeof window !== 'undefined' && window.themeScript) {
      window.themeScript()
    }
  }, [])

  return (
    <div className="main-wrapper">
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
      <ScrollToTop />
    </div>
  )
}

export default MainLayout

