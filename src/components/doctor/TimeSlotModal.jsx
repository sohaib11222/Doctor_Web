import { useState, useEffect } from 'react'
import { isValidTime, isStartBeforeEnd, to12Hour, to24Hour } from '../../utils/timeFormat'

const TimeSlotModal = ({ show, onClose, onSave, dayOfWeek, slot = null, mode = 'add' }) => {
  // Internal state for 12-hour format with AM/PM
  const [startHour, setStartHour] = useState('9')
  const [startMinute, setStartMinute] = useState('00')
  const [startPeriod, setStartPeriod] = useState('AM')
  const [endHour, setEndHour] = useState('10')
  const [endMinute, setEndMinute] = useState('00')
  const [endPeriod, setEndPeriod] = useState('AM')
  
  // 24-hour format for backend
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [errors, setErrors] = useState({})

  // Convert 24-hour to 12-hour components
  const parse24To12 = (time24) => {
    if (!time24) return { hour: '9', minute: '00', period: 'AM' }
    
    const [hours, minutes] = time24.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const hours12 = hours % 12 || 12
    
    return {
      hour: hours12.toString(),
      minute: minutes.toString().padStart(2, '0'),
      period
    }
  }

  // Convert 12-hour components to 24-hour format
  const convert12To24 = (hour, minute, period) => {
    let hours = parseInt(hour, 10)
    const minutes = minute.padStart(2, '0')
    
    if (period === 'PM' && hours !== 12) {
      hours += 12
    } else if (period === 'AM' && hours === 12) {
      hours = 0
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`
  }

  // Update 24-hour time when 12-hour components change
  useEffect(() => {
    if (startHour && startMinute && startPeriod) {
      const time24 = convert12To24(startHour, startMinute, startPeriod)
      setStartTime(time24)
    }
  }, [startHour, startMinute, startPeriod])

  useEffect(() => {
    if (endHour && endMinute && endPeriod) {
      const time24 = convert12To24(endHour, endMinute, endPeriod)
      setEndTime(time24)
    }
  }, [endHour, endMinute, endPeriod])

  useEffect(() => {
    if (show) {
      if (slot && mode === 'edit') {
        const start12 = parse24To12(slot.startTime || '')
        const end12 = parse24To12(slot.endTime || '')
        
        setStartHour(start12.hour)
        setStartMinute(start12.minute)
        setStartPeriod(start12.period)
        setEndHour(end12.hour)
        setEndMinute(end12.minute)
        setEndPeriod(end12.period)
        
        setStartTime(slot.startTime || '')
        setEndTime(slot.endTime || '')
        setIsAvailable(slot.isAvailable !== undefined ? slot.isAvailable : true)
      } else {
        // Default values
        setStartHour('9')
        setStartMinute('00')
        setStartPeriod('AM')
        setEndHour('10')
        setEndMinute('00')
        setEndPeriod('AM')
        setStartTime('09:00')
        setEndTime('10:00')
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
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className={`form-select ${errors.startTime ? 'is-invalid' : ''}`}
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      style={{ flex: '0 0 80px' }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <span className="fw-bold">:</span>
                    <select
                      className={`form-select ${errors.startTime ? 'is-invalid' : ''}`}
                      value={startMinute}
                      onChange={(e) => setStartMinute(e.target.value)}
                      style={{ flex: '0 0 80px' }}
                    >
                      {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')).map((min) => (
                        <option key={min} value={min}>
                          {min}
                        </option>
                      ))}
                    </select>
                    <select
                      className={`form-select ${errors.startTime ? 'is-invalid' : ''}`}
                      value={startPeriod}
                      onChange={(e) => setStartPeriod(e.target.value)}
                      style={{ flex: '0 0 80px' }}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  {errors.startTime && (
                    <div className="invalid-feedback d-block">{errors.startTime}</div>
                  )}
                  <small className="text-muted">Selected: {startTime && to12Hour(startTime)}</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    End Time <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className={`form-select ${errors.endTime ? 'is-invalid' : ''}`}
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      style={{ flex: '0 0 80px' }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <span className="fw-bold">:</span>
                    <select
                      className={`form-select ${errors.endTime ? 'is-invalid' : ''}`}
                      value={endMinute}
                      onChange={(e) => setEndMinute(e.target.value)}
                      style={{ flex: '0 0 80px' }}
                    >
                      {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')).map((min) => (
                        <option key={min} value={min}>
                          {min}
                        </option>
                      ))}
                    </select>
                    <select
                      className={`form-select ${errors.endTime ? 'is-invalid' : ''}`}
                      value={endPeriod}
                      onChange={(e) => setEndPeriod(e.target.value)}
                      style={{ flex: '0 0 80px' }}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  {errors.endTime && (
                    <div className="invalid-feedback d-block">{errors.endTime}</div>
                  )}
                  <small className="text-muted">Selected: {endTime && to12Hour(endTime)}</small>
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

