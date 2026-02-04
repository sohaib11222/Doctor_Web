import { useState, useEffect, useRef } from 'react'

const SLIDE_DURATION_MS = 5000
const FADE_DURATION_MS = 400

const slideContent = [
  {
    title: 'Private Chat',
    text: 'Send private messages to your specialist doctor and easily resolve your doubts.',
    imgSrc: '/assets/img/message-chat.jpeg',
    imgFallback: '/assets/img/message-chat.jpeg',
    alt: 'Private Chat Interface'
  },
  {
    title: 'Video Consultation',
    text: "Speak privately with your doctor from any location without having to physically reach your doctor's office.",
    imgSrc: '/assets/img/vedio-chat.jpeg',
    imgFallback: '/assets/img/vedio-chat.jpeg',
    alt: 'Video Consultation Interface'
  }
]

const TelemedicineModal = ({ open, onClose }) => {
  const [slide, setSlide] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!open) setSlide(0)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    intervalRef.current = setInterval(() => {
      setSlide((prev) => (prev === 0 ? 1 : 0))
    }, SLIDE_DURATION_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [open])

  const goToSlide = (index) => {
    if (index === slide) return
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setSlide((prev) => (prev === 0 ? 1 : 0))
      }, SLIDE_DURATION_MS)
    }
    setSlide(index)
  }

  if (!open) return null

  return (
    <div
      className="modal fade show"
      style={{
        display: 'block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1050
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div
            className="modal-header"
            style={{
              borderBottom: '1px solid #e5e5e5',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h5
              className="modal-title"
              style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}
            >
              Telemedicine
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '24px',
                cursor: 'pointer',
                padding: 0,
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="fa-solid fa-times" style={{ color: '#666' }}></i>
            </button>
          </div>
          <div
            className="modal-body telemedicine-modal-body"
            style={{
              padding: 0,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <style>{`
              .telemedicine-modal-body .slide-track {
                position: relative;
              }
              .telemedicine-modal-body .slide-panel {
                padding: 30px;
                padding-bottom: 0;
                opacity: 0;
                pointer-events: none;
                transition: opacity ${FADE_DURATION_MS}ms ease-in-out;
                will-change: opacity;
              }
              .telemedicine-modal-body .slide-panel.active {
                position: relative;
                opacity: 1;
                pointer-events: auto;
              }
              .telemedicine-modal-body .slide-panel:not(.active) {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
              }
              .telemedicine-modal-body .slide-panel img {
                width: 100%;
                height: auto;
                display: block;
                backface-visibility: hidden;
              }
            `}</style>
            <div className="slide-track">
              {slideContent.map((item, index) => (
                <div
                  key={index}
                  className={`slide-panel ${index === slide ? 'active' : ''}`}
                  aria-hidden={index !== slide}
                >
                  <div className="slide-inner">
                    <div style={{ marginBottom: '24px' }}>
                      <h3
                        style={{
                          fontSize: '28px',
                          fontWeight: '600',
                          marginBottom: '12px',
                          color: '#0A0A0A'
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '16px',
                          color: '#666',
                          lineHeight: '1.6',
                          margin: 0
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                    <div
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #e5e5e5',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <img
                        src={item.imgSrc}
                        alt={item.alt}
                        loading="eager"
                        decoding="async"
                        onError={(e) => {
                          const el = e.target
                          if (el.dataset.fallback) return
                          el.dataset.fallback = '1'
                          el.src = item.imgFallback
                          el.onerror = () => { el.style.display = 'none' }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                padding: '20px 30px',
                borderTop: '1px solid #e5e5e5',
                position: 'relative',
                zIndex: 2,
                background: '#fff'
              }}
            >
              {[0, 1].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: slide === index ? '#0E82FD' : '#ccc',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    padding: 0
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TelemedicineModal
