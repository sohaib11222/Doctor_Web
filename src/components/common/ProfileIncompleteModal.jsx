import { useNavigate } from 'react-router-dom'

const ProfileIncompleteModal = ({ show, onClose }) => {
  const navigate = useNavigate()

  const handleGoToProfile = () => {
    navigate('/doctor-profile-settings')
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
                <i className="fa-solid fa-exclamation-triangle text-warning me-2"></i>
                Profile Incomplete
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
                <i className="fa-solid fa-user-circle" style={{ fontSize: '64px', color: '#ffc107' }}></i>
              </div>
              <h6 className="text-center mb-3">Your doctor profile is not complete</h6>
              <p className="text-muted text-center mb-4">
                To start accepting appointments, please complete your profile by filling in the following required information:
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2">
                  <i className="fa-solid fa-check-circle text-success me-2"></i>
                  <strong>Title/Designation</strong> (e.g., MD, MBBS)
                </li>
                <li className="mb-2">
                  <i className="fa-solid fa-check-circle text-success me-2"></i>
                  <strong>Biography</strong> (Professional background and expertise)
                </li>
                <li className="mb-2">
                  <i className="fa-solid fa-check-circle text-success me-2"></i>
                  <strong>Specialization</strong>
                </li>
                <li className="mb-2">
                  <i className="fa-solid fa-check-circle text-success me-2"></i>
                  <strong>At least one Clinic</strong> (Location and address)
                </li>
                <li className="mb-2">
                  <i className="fa-solid fa-check-circle text-success me-2"></i>
                  <strong>At least one Service</strong>
                </li>
              </ul>
              <div className="alert alert-warning mb-0">
                <i className="fa-solid fa-info-circle me-2"></i>
                <strong>Note:</strong> You cannot accept appointments until your profile is complete.
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGoToProfile}
              >
                <i className="fa-solid fa-user-edit me-2"></i>
                Complete Profile Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileIncompleteModal
