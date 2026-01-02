import { useState, useEffect } from 'react'
import { isValidTime, isStartBeforeEnd } from '../../utils/timeFormat'

const TimeSlotModal = ({ show, onClose, onSave, dayOfWeek, slot = null, mode = 'add' }) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (show) {
      if (slot && mode === 'edit') {
        setStartTime(slot.startTime || '')
        setEndTime(slot.endTime || '')
        setIsAvailable(slot.isAvailable !== undefined ? slot.isAvailable : true)
      } else {
        setStartTime('')
        setEndTime('')
        setIsAvailable(true)
      }
      setErrors({})
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = ''
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
    }
  }, [show, slot, mode])

  const validate = () => {
    const newErrors = {}

    if (!startTime) {
      newErrors.startTime = 'Start time is required'
    } else if (!isValidTime(startTime)) {
      newErrors.startTime = 'Invalid time format. Use HH:MM (e.g., 09:00)'
    }

    if (!endTime) {
      newErrors.endTime = 'End time is required'
    } else if (!isValidTime(endTime)) {
      newErrors.endTime = 'Invalid time format. Use HH:MM (e.g., 10:00)'
    }

    if (startTime && endTime && !isStartBeforeEnd(startTime, endTime)) {
      newErrors.endTime = 'End time must be after start time'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    onSave({
      startTime,
      endTime,
      isAvailable
    })
  }

  if (!show) return null

  return (
    <>
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
      >
        <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1056 }}>
          <div className="modal-content" style={{ position: 'relative', zIndex: 1057 }}>
            <div className="modal-header">
              <h5 className="modal-title">
                {mode === 'edit' ? 'Edit Time Slot' : 'Add Time Slot'} - {dayOfWeek}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Start Time <span className="text-danger">*</span>
                    <small className="text-muted d-block">Format: HH:MM (24-hour, e.g., 09:00, 14:30)</small>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.startTime ? 'is-invalid' : ''}`}
                    placeholder="09:00"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    maxLength={5}
                  />
                  {errors.startTime && (
                    <div className="invalid-feedback">{errors.startTime}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    End Time <span className="text-danger">*</span>
                    <small className="text-muted d-block">Format: HH:MM (24-hour, e.g., 10:00, 15:30)</small>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.endTime ? 'is-invalid' : ''}`}
                    placeholder="10:00"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    maxLength={5}
                  />
                  {errors.endTime && (
                    <div className="invalid-feedback">{errors.endTime}</div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isAvailable"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="isAvailable">
                      Available
                    </label>
                  </div>
                  <small className="text-muted">Uncheck to mark this slot as unavailable</small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {mode === 'edit' ? 'Update Slot' : 'Add Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose}
        style={{ 
          zIndex: 1054,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      ></div>
    </>
  )
}

export default TimeSlotModal

