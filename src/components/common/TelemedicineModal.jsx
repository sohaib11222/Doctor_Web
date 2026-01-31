import { useState, useEffect } from 'react'

const TelemedicineModal = ({ open, onClose }) => {
  const [slide, setSlide] = useState(0)

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
    const interval = setInterval(() => {
      setSlide((prev) => (prev === 0 ? 1 : 0))
    }, 5000)
    return () => clearInterval(interval)
  }, [open])

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
          <div className="modal-body" style={{ padding: 0, position: 'relative' }}>
            {slide === 0 && (
              <div style={{ padding: '30px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3
                    style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: '#0A0A0A'
                    }}
                  >
                    Private Chat
                  </h3>
                  <p
                    style={{
                      fontSize: '16px',
                      color: '#666',
                      lineHeight: '1.6',
                      margin: 0
                    }}
                  >
                    Send private messages to your specialist doctor and easily resolve your doubts.
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
                    src="/assets/img/message-chat.jpg"
                    alt="Private Chat Interface"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    onError={(e) => {
                      e.target.src = '/assets/img/message-chat.png'
                      e.target.onError = () => {
                        e.target.style.display = 'none'
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {slide === 1 && (
              <div style={{ padding: '30px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3
                    style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: '#0A0A0A'
                    }}
                  >
                    Video Consultation
                  </h3>
                  <p
                    style={{
                      fontSize: '16px',
                      color: '#666',
                      lineHeight: '1.6',
                      margin: 0
                    }}
                  >
                    Speak privately with your doctor from any location without having to physically
                    reach your doctor's office.
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
                    src="/assets/img/vedio-chat.png"
                    alt="Video Consultation Interface"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    onError={(e) => {
                      e.target.src = '/assets/img/vedio-chat.jpg'
                      e.target.onError = () => {
                        e.target.style.display = 'none'
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                padding: '20px 30px',
                borderTop: '1px solid #e5e5e5'
              }}
            >
              <button
                onClick={() => setSlide(0)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: slide === 0 ? '#0E82FD' : '#ccc',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  padding: 0
                }}
                aria-label="Go to slide 1"
              />
              <button
                onClick={() => setSlide(1)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: slide === 1 ? '#0E82FD' : '#ccc',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  padding: 0
                }}
                aria-label="Go to slide 2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TelemedicineModal
