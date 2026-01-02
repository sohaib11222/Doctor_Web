import { useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Breadcrumb from '../../components/common/Breadcrumb'
import * as appointmentApi from '../../api/appointments'

const BookingSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const appointmentId = searchParams.get('appointmentId')

  // Fetch appointment details
  const { data: appointmentData, isLoading } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => appointmentApi.getAppointmentById(appointmentId),
    enabled: !!appointmentId
  })

  const appointment = appointmentData?.data || appointmentData

  // Format date and time
  const formatDateTime = (date, time) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    return time ? `${dateStr} ${time}` : dateStr
  }

  if (isLoading) {
    return (
      <>
        <Breadcrumb title="Patient" li1="Booking" li2="Booking Success" />
        <div className="content success-page-cont">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!appointment) {
    return (
      <>
        <Breadcrumb title="Patient" li1="Booking" li2="Booking Success" />
        <div className="content success-page-cont">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="alert alert-danger">
                  <h5>Appointment Not Found</h5>
                  <p>The appointment details could not be loaded.</p>
                  <Link to="/patient-appointments" className="btn btn-primary">View My Appointments</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const doctor = appointment.doctorId
  const doctorName = doctor?.fullName || 'Unknown Doctor'
  const appointmentNumber = appointment.appointmentNumber || `#${appointment._id.slice(-6)}`
  const appointmentDateTime = formatDateTime(appointment.appointmentDate, appointment.appointmentTime)

  return (
    <>
      <Breadcrumb title="Patient" li1="Booking" li2="Booking Success" />
      <div className="content success-page-cont">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card success-card">
                <div className="card-body">
                  <div className="success-cont">
                    <i className="fas fa-check"></i>
                    <h3>Appointment Booked Successfully!</h3>
                    <p>
                      Appointment booked with <strong>{doctorName}</strong>
                      <br />
                      Appointment Number: <strong>{appointmentNumber}</strong>
                      <br />
                      Date & Time: <strong>{appointmentDateTime}</strong>
                      <br />
                      Status: <strong>{appointment.status}</strong>
                    </p>
                    {appointment.status === 'PENDING' && (
                      <div className="alert alert-info mt-3">
                        <p className="mb-0">
                          Your appointment request is pending confirmation from the doctor. 
                          You will be notified once the doctor accepts or rejects your request.
                        </p>
                      </div>
                    )}
                    <div className="d-flex gap-2 justify-content-center mt-4">
                      <Link to="/patient-appointments" className="btn btn-primary">
                        View My Appointments
                      </Link>
                      {appointment._id && (
                        <Link to={`/patient-appointment-details?id=${appointment._id}`} className="btn btn-outline-primary">
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookingSuccess
