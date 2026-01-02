import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as weeklyScheduleApi from '../../api/weeklySchedule'
import TimeSlotModal from '../../components/doctor/TimeSlotModal'
import { to12Hour } from '../../utils/timeFormat'

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const APPOINTMENT_DURATIONS = [15, 30, 45, 60]

const AvailableTimings = () => {
  const [activeDay, setActiveDay] = useState('Monday')
  const [activeTab, setActiveTab] = useState('general')
  const [showSlotModal, setShowSlotModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedDayForModal, setSelectedDayForModal] = useState('Monday')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [dayToDelete, setDayToDelete] = useState(null)

  const queryClient = useQueryClient()

  // Fetch weekly schedule
  const { data: scheduleData, isLoading, error } = useQuery({
    queryKey: ['weeklySchedule'],
    queryFn: async () => {
      const response = await weeklyScheduleApi.getWeeklySchedule()
      return response.data || response
    }
  })

  // Get schedule data or default
  const schedule = scheduleData || {
    appointmentDuration: 30,
    days: []
  }

  // Get time slots for a specific day
  const getDaySlots = (dayOfWeek) => {
    const daySchedule = schedule.days?.find(day => day.dayOfWeek === dayOfWeek)
    return daySchedule?.timeSlots || []
  }

  // Add time slot mutation
  const addSlotMutation = useMutation({
    mutationFn: ({ dayOfWeek, timeSlot }) =>
      weeklyScheduleApi.addTimeSlot(dayOfWeek, timeSlot),
    onSuccess: () => {
      queryClient.invalidateQueries(['weeklySchedule'])
      toast.success('Time slot added successfully!')
      setShowSlotModal(false)
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add time slot'
      toast.error(errorMessage)
    }
  })

  // Update time slot mutation
  const updateSlotMutation = useMutation({
    mutationFn: ({ dayOfWeek, slotId, updates }) =>
      weeklyScheduleApi.updateTimeSlot(dayOfWeek, slotId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['weeklySchedule'])
      toast.success('Time slot updated successfully!')
      setShowSlotModal(false)
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update time slot'
      toast.error(errorMessage)
    }
  })

  // Delete time slot mutation
  const deleteSlotMutation = useMutation({
    mutationFn: ({ dayOfWeek, slotId }) =>
      weeklyScheduleApi.deleteTimeSlot(dayOfWeek, slotId),
    onSuccess: () => {
      queryClient.invalidateQueries(['weeklySchedule'])
      toast.success('Time slot deleted successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete time slot'
      toast.error(errorMessage)
    }
  })

  // Delete all slots for a day mutation
  const deleteAllSlotsMutation = useMutation({
    mutationFn: (dayOfWeek) =>
      weeklyScheduleApi.upsertWeeklySchedule({ dayOfWeek, timeSlots: [] }),
    onSuccess: () => {
      queryClient.invalidateQueries(['weeklySchedule'])
      toast.success('All slots deleted successfully!')
      setShowDeleteConfirm(false)
      setDayToDelete(null)
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete slots'
      toast.error(errorMessage)
    }
  })

  // Update appointment duration mutation
  const updateDurationMutation = useMutation({
    mutationFn: (duration) =>
      weeklyScheduleApi.updateAppointmentDuration(duration),
    onSuccess: () => {
      queryClient.invalidateQueries(['weeklySchedule'])
      toast.success('Appointment duration updated successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update duration'
      toast.error(errorMessage)
    }
  })

  // Save entire day schedule mutation
  const saveDayScheduleMutation = useMutation({
    mutationFn: ({ dayOfWeek, timeSlots }) =>
      weeklyScheduleApi.upsertWeeklySchedule({ dayOfWeek, timeSlots }),
    onSuccess: () => {
      queryClient.invalidateQueries(['weeklySchedule'])
      toast.success('Schedule saved successfully!')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save schedule'
      toast.error(errorMessage)
    }
  })

  // Handle add slot
  const handleAddSlot = (dayOfWeek) => {
    setSelectedDayForModal(dayOfWeek)
    setModalMode('add')
    setSelectedSlot(null)
    setShowSlotModal(true)
  }

  // Handle edit slot
  const handleEditSlot = (dayOfWeek, slot) => {
    setSelectedDayForModal(dayOfWeek)
    setModalMode('edit')
    setSelectedSlot(slot)
    setShowSlotModal(true)
  }

  // Handle delete slot
  const handleDeleteSlot = (dayOfWeek, slotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      deleteSlotMutation.mutate({ dayOfWeek, slotId })
    }
  }

  // Handle delete all slots
  const handleDeleteAllSlots = (dayOfWeek) => {
    setDayToDelete(dayOfWeek)
    setShowDeleteConfirm(true)
  }

  // Confirm delete all
  const confirmDeleteAll = () => {
    if (dayToDelete) {
      deleteAllSlotsMutation.mutate(dayToDelete)
    }
  }

  // Handle body scroll lock for delete modal
  useEffect(() => {
    if (showDeleteConfirm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [showDeleteConfirm])

  // Handle save slot from modal
  const handleSaveSlot = (slotData) => {
    if (modalMode === 'edit' && selectedSlot?._id) {
      updateSlotMutation.mutate({
        dayOfWeek: selectedDayForModal,
        slotId: selectedSlot._id,
        updates: slotData
      })
    } else {
      addSlotMutation.mutate({
        dayOfWeek: selectedDayForModal,
        timeSlot: slotData
      })
    }
  }

  // Handle duration change
  const handleDurationChange = (duration) => {
    updateDurationMutation.mutate(parseInt(duration))
  }

  // Render day tabs
  const renderDayTabs = () => {
    return DAYS_OF_WEEK.map((day) => {
      const isActive = activeDay === day
      const dayId = day.toLowerCase()
      return (
        <li key={day}>
          <a
            href="#"
            className={isActive ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault()
              setActiveDay(day)
            }}
          >
            {day}
          </a>
        </li>
      )
    })
  }

  // Render time slots for a day
  const renderTimeSlots = (dayOfWeek) => {
    const slots = getDaySlots(dayOfWeek)

    if (slots.length === 0) {
      return <p>No Slots Available</p>
    }

    return (
      <ul className="time-slots">
        {slots.map((slot) => (
          <li 
            key={slot._id || slot.startTime + slot.endTime} 
            className="d-flex align-items-center justify-content-between"
            style={{ 
              padding: '10px',
              marginBottom: '8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              position: 'relative',
              zIndex: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa'
            }}
          >
            <span className="d-flex align-items-center">
              <i className="isax isax-clock me-2" style={{ fontSize: '16px', color: '#6c757d' }}></i>
              <span style={{ fontWeight: '500', color: '#212529' }}>
                {to12Hour(slot.startTime)} - {to12Hour(slot.endTime)}
              </span>
              {!slot.isAvailable && (
                <span className="badge bg-secondary ms-2">Unavailable</span>
              )}
            </span>
            <div className="d-flex align-items-center gap-2" style={{ position: 'relative', zIndex: 10 }}>
              <button
                type="button"
                className="btn btn-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditSlot(dayOfWeek, slot)
                }}
                disabled={deleteSlotMutation.isLoading || updateSlotMutation.isLoading}
                style={{
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #0d6efd',
                  backgroundColor: '#ffffff',
                  color: '#0d6efd',
                  borderRadius: '50%',
                  position: 'relative',
                  zIndex: 10,
                  flexShrink: 0
                }}
                title="Edit slot"
              >
                <i className="fe fe-edit" style={{ fontSize: '14px', display: 'block', lineHeight: '1' }}></i>
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteSlot(dayOfWeek, slot._id)
                }}
                disabled={deleteSlotMutation.isLoading || updateSlotMutation.isLoading}
                style={{
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #dc3545',
                  backgroundColor: '#ffffff',
                  color: '#dc3545',
                  borderRadius: '50%',
                  position: 'relative',
                  zIndex: 10,
                  flexShrink: 0
                }}
                title="Delete slot"
              >
                <i className="fe fe-trash-2" style={{ fontSize: '14px', display: 'block', lineHeight: '1' }}></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  // Render day content
  const renderDayContent = () => {
    return DAYS_OF_WEEK.map((day) => {
      const isActive = activeDay === day
      const dayId = day.toLowerCase()
      return (
        <div
          key={day}
          className={`tab-pane ${isActive ? 'active show' : 'fade'}`}
          id={dayId}
        >
          <div className="slot-box">
            <div className="slot-header">
              <h5>{day}</h5>
              <ul>
                <li>
                  <a
                    href="#"
                    className="add-slot"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddSlot(day)
                    }}
                  >
                    Add Slots
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="del-slot"
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteAllSlots(day)
                    }}
                  >
                    Delete All
                  </a>
                </li>
              </ul>
            </div>
            <div className="slot-body">
              {isLoading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                renderTimeSlots(day)
              )}
            </div>
          </div>
        </div>
      )
    })
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5>Error Loading Schedule</h5>
        <p>{error.response?.data?.message || error.message || 'Failed to load schedule'}</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .time-slots li {
          transition: none !important;
          position: relative !important;
        }
        .time-slots li:hover {
          background-color: #f8f9fa !important;
          transform: none !important;
          box-shadow: none !important;
        }
        .time-slots li:hover::before {
          display: none !important;
          content: none !important;
        }
        .time-slots li::before {
          display: none !important;
          content: none !important;
        }
        .time-slots li button {
          position: relative !important;
          z-index: 10 !important;
        }
        .time-slots li button:hover {
          opacity: 0.8;
        }
        .time-slots li button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .time-slots li button i {
          display: inline-block !important;
          visibility: visible !important;
        }
      `}</style>
      <div className="dashboard-header">
        <h3>Available Timings</h3>
      </div>

      <div className="appointment-tabs">
        <ul className="nav available-nav">
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setActiveTab('general')
              }}
            >
              General Availability
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${activeTab === 'clinic' ? 'active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setActiveTab('clinic')
              }}
            >
              Clinic Availability
            </a>
          </li>
        </ul>
      </div>

      <div className="tab-content pt-0 timing-content">
        {/* General Availability */}
        <div className={`tab-pane fade ${activeTab === 'general' ? 'show active' : ''}`} id="general-availability">
          <div className="card custom-card">
            <div className="card-body">
              <div className="card-header">
                <h3>Select Available Slots</h3>
              </div>

              <div className="available-tab">
                <label className="form-label">Select Available days</label>
                <ul className="nav">
                  {renderDayTabs()}
                </ul>
              </div>

              <div className="tab-content pt-0">
                {renderDayContent()}
              </div>

              <div className="form-wrap mt-4">
                <label className="col-form-label">Appointment Duration (minutes) <span className="text-danger">*</span></label>
                <select
                  className="form-control"
                  value={schedule.appointmentDuration || 30}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  disabled={updateDurationMutation.isLoading}
                >
                  {APPOINTMENT_DURATIONS.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration} minutes
                    </option>
                  ))}
                </select>
                <small className="text-muted">Default duration for appointments</small>
              </div>
            </div>
          </div>
        </div>
        {/* /General Availability */}

        {/* Clinic Availability - Placeholder for future implementation */}
        <div className={`tab-pane fade ${activeTab === 'clinic' ? 'show active' : ''}`} id="clinic-availability">
          <div className="card custom-card">
            <div className="card-body">
              <div className="alert alert-info">
                <h5>Clinic Availability</h5>
                <p>This feature will allow you to set different availability schedules for different clinics. Coming soon!</p>
              </div>
            </div>
          </div>
        </div>
        {/* /Clinic Availability */}
      </div>

      {/* Time Slot Modal */}
      <TimeSlotModal
        show={showSlotModal}
        onClose={() => {
          setShowSlotModal(false)
          setSelectedSlot(null)
        }}
        onSave={handleSaveSlot}
        dayOfWeek={selectedDayForModal}
        slot={selectedSlot}
        mode={modalMode}
      />

      {/* Delete All Confirmation Modal */}
      {showDeleteConfirm && (
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
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDayToDelete(null)
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete all time slots for <strong>{dayToDelete}</strong>?</p>
                  <p className="text-muted small">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDayToDelete(null)
                    }}
                    disabled={deleteAllSlotsMutation.isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDeleteAll}
                    disabled={deleteAllSlotsMutation.isLoading}
                  >
                    {deleteAllSlotsMutation.isLoading ? 'Deleting...' : 'Delete All'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="modal-backdrop fade show" 
            onClick={() => {
              setShowDeleteConfirm(false)
              setDayToDelete(null)
            }}
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
      )}
    </>
  )
}

export default AvailableTimings
