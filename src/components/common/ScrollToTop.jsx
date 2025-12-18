import { useEffect } from 'react'

const ScrollToTop = () => {
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0)
  }, [])

  return null
}

export default ScrollToTop

