import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as rescheduleApi from '../../api/rescheduleRequest'

const RequestReschedule = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const appointmentIdFromUrl = searchParams.get('appointmentId')

  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [reason, setReason] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')

  // Fetch eligible appointments
  const { data: eligibleAppointmentsData, isLoading, error: eligibleError } = useQuery({
    queryKey: ['eligibleRescheduleAppointments'],
    queryFn: () => rescheduleApi.getEligibleAppointments(),
    enabled: !!user,
    retry: 1,
    onError: (error) => {
      console.error('Error fetching eligible appointments:', error)
    }
  })

  const eligibleAppointments = eligibleAppointmentsData?.data || eligibleAppointmentsData || []

  // If appointmentId is in URL, select it automatically
  useEffect(() => {
    if (appointmentIdFromUrl && eligibleAppointments.length > 0) {
      const apt = eligibleAppointments.find(a => a._id === appointmentIdFromUrl)
      if (apt) {
        setSelectedAppointment(apt)
      }
    }
  }, [appointmentIdFromUrl, eligibleAppointments])

  // Create reschedule request mutation
  const createRequestMutation = useMutation({
    mutationFn: (data) => rescheduleApi.createRescheduleRequest(data),
    onSuccess: () => {
      toast.success('Reschedule request submitted successfully')
      queryClient.invalidateQueries(['eligibleRescheduleAppointments'])
      queryClient.invalidateQueries(['rescheduleRequests'])
      queryClient.invalidateQueries(['patientAppointments'])
      // Reset form
      setSelectedAppointment(null)
      setReason('')
      setPreferredDate('')
      setPreferredTime('')
      navigate('/patient/reschedule-requests')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit reschedule request'
      toast.error(errorMessage)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedAppointment) {
      toast.error('Please select an appointment')
      return
    }
    if (reason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters')
      return
    }

    // Build request payload - only include preferredDate/preferredTime if they have values
    const payload = {
      appointmentId: selectedAppointment._id,
      reason: reason.trim()
    }

    // Only add preferredDate if it has a value
    if (preferredDate && preferredDate.trim()) {
      payload.preferredDate = preferredDate.trim()
    }

    // Only add preferredTime if it has a value
    if (preferredTime && preferredTime.trim()) {
      payload.preferredTime = preferredTime.trim()
    }

    createRequestMutation.mutate(payload)
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="container">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Request Appointment Reschedule</h3>
              </div>
            </div>
          </div>

          {/* Eligible Appointments List */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Select Missed Appointment</h5>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : eligibleError ? (
                <div className="text-center py-4">
                  <div className="alert alert-warning">
                    <h6>Unable to Load Eligible Appointments</h6>
                    <p className="text-muted small mb-2">
                      {eligibleError.response?.status === 404 
                        ? 'The reschedule request feature is not available. Please ensure the backend server has been restarted.'
                        : eligibleError.response?.data?.message || eligibleError.message || 'An error occurred'}
                    </p>
                    <p className="text-muted small">
                      If you see a 404 error, please restart the backend server to load the new routes.
                    </p>
                  </div>
                </div>
              ) : eligibleAppointments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No appointments eligible for reschedule</p>
                  <p className="text-muted small">Only confirmed appointments that have passed without you joining the video call can be rescheduled.</p>
                </div>
              ) : (
                <div className="list-group">
                  {eligibleAppointments.map(apt => (
                    <div
                      key={apt._id}
                      className={`list-group-item list-group-item-action ${selectedAppointment?._id === apt._id ? 'active' : ''}`}
                      onClick={() => setSelectedAppointment(apt)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">Dr. {apt.doctorId?.fullName || 'Unknown Doctor'}</h6>
                          <small className="text-muted">
                            {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                          </small>
                          {apt.appointmentNumber && (
                            <small className="text-muted d-block">Appointment #: {apt.appointmentNumber}</small>
                          )}
                        </div>
                        <div>
                          <span className="badge bg-warning text-dark">Missed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reschedule Form */}
          {selectedAppointment && (
            <div className="card mt-4">
              <div className="card-header">
                <h5 className="card-title">Reschedule Request Form</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Reason for Missing Appointment <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please provide a detailed reason for missing the appointment (minimum 10 characters)"
                      required
                      minLength={10}
                      maxLength={500}
                    />
                    <small className="text-muted">
                      {reason.length}/500 characters (minimum 10 required)
                    </small>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Preferred New Date (Optional)</label>
                      <input
                        type="date"
                        className="form-control"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <small className="text-muted">This is just a suggestion. The doctor will set the final date.</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Preferred New Time (Optional)</label>
                      <input
                        type="time"
                        className="form-control"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <strong>Note:</strong> Your request will be reviewed by the doctor. 
                    If approved, you will need to pay a reschedule fee (typically 50% of the original fee) 
                    to confirm the new appointment.
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={createRequestMutation.isLoading || reason.trim().length < 10}
                    >
                      {createRequestMutation.isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Submitting...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/patient/appointments')}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestReschedule
