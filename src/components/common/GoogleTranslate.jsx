import { useEffect, useRef, useState } from 'react'

// Global flag to ensure script is only loaded once
let scriptLoaded = false
let translateInitialized = false

const GoogleTranslate = () => {
  const translateElementRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let checkInterval = null
    let bannerInterval = null
    let observer = null
    let isMounted = true

    // Initialize Google Translate
    const initializeTranslate = () => {
      if (!isMounted || translateInitialized) return

      const element = translateElementRef.current
      if (!element) {
        // Element not ready yet, retry
        setTimeout(() => {
          if (isMounted && !translateInitialized) initializeTranslate()
        }, 50)
        return
      }

      // Check if already initialized globally or in this element
      if (element.querySelector('.goog-te-gadget') || translateInitialized) {
        if (isMounted) setIsLoading(false)
        translateInitialized = true
        return
      }

      if (window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'ar,zh-CN,zh-TW,fr,de,hi,id,it,ja,ko,pt,ru,es,th,tr,vi',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true
            },
            'google_translate_element'
          )
          translateInitialized = true
          if (isMounted) setIsLoading(false)
        } catch (error) {
          console.error('Error initializing Google Translate:', error)
          if (isMounted) setIsLoading(false)
        }
      }
    }

    // Set up global callback - only set once
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        // Wait a bit for the element to be ready
        setTimeout(() => {
          if (!translateInitialized) {
            const element = document.getElementById('google_translate_element')
            if (element && window.google && window.google.translate) {
              try {
                new window.google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'ar,zh-CN,zh-TW,fr,de,hi,id,it,ja,ko,pt,ru,es,th,tr,vi',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                    multilanguagePage: true
                  },
                  'google_translate_element'
                )
                translateInitialized = true
              } catch (error) {
                console.error('Error initializing Google Translate:', error)
              }
            }
          }
        }, 100)
      }
    }

    // Load Google Translate script - only once globally
    const addScript = () => {
      // Check if script already exists or is being loaded
      if (scriptLoaded || document.querySelector('script[src*="translate.google.com"]')) {
        scriptLoaded = true
        // Script exists, check if API is ready
        if (window.google && window.google.translate) {
          setTimeout(() => {
            if (isMounted && !translateInitialized) initializeTranslate()
          }, 100)
        }
        return
      }

      scriptLoaded = true
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      script.onerror = () => {
        console.error('Failed to load Google Translate script')
        scriptLoaded = false
        if (isMounted) setIsLoading(false)
      }
      document.body.appendChild(script)
    }

    // Try to initialize immediately if script is already loaded
    if (window.google && window.google.translate && !translateInitialized) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (isMounted && !translateInitialized) initializeTranslate()
      }, 100)
    } else if (!scriptLoaded) {
      addScript()
      // Also try to initialize after a short delay in case script loads quickly
      setTimeout(() => {
        if (isMounted && window.google && window.google.translate && !translateInitialized) {
          initializeTranslate()
        }
      }, 500)
    } else if (translateInitialized) {
      // Already initialized, just hide loading
      if (isMounted) setIsLoading(false)
    }

    // Polling to check if script loaded and initialize
    // Start with more frequent checks, then slow down
    let attempts = 0
    const maxAttempts = 40 // 20 seconds max
    let checkDelay = 100 // Start checking every 100ms
    
    const doCheck = () => {
      if (!isMounted) {
        clearInterval(checkInterval)
        return
      }

      attempts++
      if (attempts > maxAttempts) {
        clearInterval(checkInterval)
        if (isMounted) setIsLoading(false)
        return
      }
      
      // Slow down after first 10 attempts (1 second)
      if (attempts === 10) {
        clearInterval(checkInterval)
        checkDelay = 500
        checkInterval = setInterval(doCheck, checkDelay)
      }
      
      const element = translateElementRef.current
      if (element && window.google && window.google.translate) {
        if (!element.querySelector('.goog-te-gadget')) {
          initializeTranslate()
        } else {
          clearInterval(checkInterval)
          if (isMounted) setIsLoading(false)
        }
      }
    }
    
    checkInterval = setInterval(doCheck, checkDelay)

    // Cleanup function
    return () => {
      isMounted = false
      if (checkInterval) {
        clearInterval(checkInterval)
      }
    }
  }, [])

  return (
    <>
      <style>{`
        /* Hide Google Translate banner that appears at top */
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        body.top {
          padding-top: 0 !important;
        }
        
        /* Style the translate element - fixed position in header area */
        #google_translate_element {
          position: fixed !important;
          top: 80px !important;
          right: 20px !important;
          z-index: 9999 !important;
          display: inline-block !important;
          vertical-align: middle !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: auto !important;
          height: auto !important;
          background-color: #fff !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
          padding: 8px !important;
        }
        #google_translate_element .goog-te-gadget {
          font-family: 'Poppins', sans-serif !important;
          font-size: 13px !important;
          color: #333 !important;
          display: inline-block !important;
        }
        #google_translate_element .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 4px 8px !important;
          display: inline-block !important;
          cursor: pointer !important;
        }
        #google_translate_element .goog-te-gadget-simple .goog-te-menu-value {
          color: #333 !important;
        }
        #google_translate_element .goog-te-gadget-simple .goog-te-menu-value span {
          color: #333 !important;
        }
        .goog-te-menu-frame {
          max-width: 100% !important;
          z-index: 10000 !important;
        }
        .goog-te-menu-value {
          color: #333 !important;
        }
        .goog-te-menu2 {
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        
        /* Ensure header is not covered */
        .header {
          position: relative !important;
          z-index: 1000 !important;
        }
        
        @media (max-width: 768px) {
          #google_translate_element {
            font-size: 11px !important;
            top: 70px !important;
            right: 10px !important;
            padding: 4px !important;
          }
          #google_translate_element .goog-te-gadget-simple {
            padding: 2px 4px !important;
          }
        }
      `}</style>
      <div 
        id="google_translate_element"
        ref={translateElementRef}
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          minHeight: '20px',
          minWidth: '120px',
          lineHeight: '1',
          position: 'relative'
        }}
      >
        {isLoading && (
          <span style={{ 
            fontSize: '12px', 
            color: '#666',
            display: 'inline-block',
            padding: '4px 8px'
          }}>
            🌐
          </span>
        )}
      </div>
    </>
  )
}

export default GoogleTranslate

