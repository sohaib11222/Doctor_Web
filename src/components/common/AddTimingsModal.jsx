import { useNavigate } from 'react-router-dom'

const AddTimingsModal = ({ show, onClose }) => {
  const navigate = useNavigate()

  const handleGoToTimings = () => {
    navigate('/available-timings')
    onClose()
  }

  if (!show) return null

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{
          display: 'block',
          zIndex: 1055,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target.classList.contains('modal')) {
            onClose()
          }
        }}
      >
        <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1056 }} onClick={(e) => e.stopPropagation()}>
          <div className="modal-content" style={{ position: 'relative', zIndex: 1057 }}>
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fa-solid fa-clock text-warning me-2"></i>
                Add Available Timings
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="text-center mb-4">
                <i className="fa-solid fa-calendar-day" style={{ fontSize: '64px', color: '#ffc107' }}></i>
              </div>
              <h6 className="text-center mb-3">Your profile is complete!</h6>
              <p className="text-muted text-center mb-4">
                To allow patients to book appointments, please set your available timings. This will let patients know when you're available for consultations.
              </p>
              <div className="alert alert-info mb-0">
                <i className="fa-solid fa-info-circle me-2"></i>
                <strong>Note:</strong> Patients cannot book appointments until you set your available timings.
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                I'll Do It Later
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGoToTimings}
              >
                <i className="fa-solid fa-calendar-day me-2"></i>
                Add Timings Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddTimingsModal
