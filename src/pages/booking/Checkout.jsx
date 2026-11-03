import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import * as appointmentApi from '../../api/appointments'
import * as paymentApi from '../../api/payment'
import { formatCurrency } from '../../utils/currency'

const PENDING_BOOKING_KEY = 'pendingBooking'
const PENDING_APPOINTMENT_KEY = 'pendingBookingAppointmentId'

const readStoredBooking = () => {
  try {
    const raw = sessionStorage.getItem(PENDING_BOOKING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const formatAppointmentDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatAppointmentTime = (timeString) => {
  if (!timeString) return 'N/A'
  const [hours, minutes] = String(timeString).split(':').map(Number)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return timeString
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const Checkout = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const booking = useMemo(() => {
    const fromState = location.state?.booking
    if (fromState) return fromState
    return readStoredBooking()
  }, [location.state])

  const [paymentMethod, setPaymentMethod] = useState(booking?.paymentMethod || 'DUMMY')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [createdAppointmentId, setCreatedAppointmentId] = useState(() => {
    try {
      return sessionStorage.getItem(PENDING_APPOINTMENT_KEY) || null
    } catch {
      return null
    }
  })

  // Persist the booking so reloading checkout keeps the same selection.
  useEffect(() => {
    if (!booking) return
    try {
      sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(booking))
    } catch {
      // Storage can be unavailable in private mode; state remains in memory.
    }
  }, [booking])

  const {
    data: quoteData,
    isLoading: quoteLoading,
    error: quoteError
  } = useQuery({
    queryKey: [
      'checkoutQuote',
      booking?.doctorId,
      booking?.bookingType,
      (booking?.selectedServices || []).join('|')
    ],
    queryFn: () => appointmentApi.getBookingQuote({
      doctorId: booking.doctorId,
      bookingType: booking.bookingType || 'VISIT',
      selectedServices: booking.selectedServices || []
    }),
    enabled: !!booking?.doctorId,
    retry: 1
  })

  const quote = useMemo(() => {
    if (!quoteData) return null
    return quoteData.data || quoteData
  }, [quoteData])

  const patientName = user?.fullName || ''
  const [firstName = '', ...restName] = patientName.split(' ')
  const lastName = restName.join(' ')

  const handleConfirm = async (event) => {
    event.preventDefault()

    if (!booking?.doctorId) {
      setSubmitError('Your booking details are missing. Please start the booking again.')
      return
    }

    if (!quote) {
      setSubmitError('The booking price is still loading. Please wait a moment and try again.')
      return
    }

    if (!acceptedTerms) {
      setSubmitError('Please accept the Terms & Conditions before paying.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      let appointmentId = createdAppointmentId

      if (!appointmentId) {
        const response = await appointmentApi.createAppointment({
          doctorId: booking.doctorId,
          patientId: user?._id,
          appointmentDate: booking.appointmentDate,
          appointmentTime: booking.appointmentTime,
          appointmentDuration: quote.appointmentDuration || booking.appointmentDuration,
          bookingType: booking.bookingType || 'VISIT',
          selectedServices: booking.selectedServices || [],
          patientNotes: booking.patientNotes || undefined,
          clinicName: booking.clinicName || undefined,
          timezone: booking.timezone,
          timezoneOffset: booking.timezoneOffset
        })

        const appointment = response?.data || response
        appointmentId = appointment?._id

        if (!appointmentId) {
          throw new Error('The appointment could not be created. Please try again.')
        }

        setCreatedAppointmentId(appointmentId)
        try {
          sessionStorage.setItem(PENDING_APPOINTMENT_KEY, appointmentId)
        } catch {
          // Ignore storage errors; the id is kept in component state.
        }
      }

      // The backend derives the charged amount from the stored appointment.
      await paymentApi.processAppointmentPayment(
        appointmentId,
        quote.totalAmount,
        paymentMethod
      )

      try {
        sessionStorage.removeItem(PENDING_BOOKING_KEY)
        sessionStorage.removeItem(PENDING_APPOINTMENT_KEY)
      } catch {
        // Ignore storage errors.
      }

      toast.success('Payment successful. Your appointment request has been sent.')
      navigate(`/booking-success?appointmentId=${appointmentId}`)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Payment failed. Please try again.'
      setSubmitError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!booking) {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card">
                <div className="card-body text-center py-5">
                  <h4>No booking to check out</h4>
                  <p className="text-muted">
                    Please choose a doctor, date and time before continuing to checkout.
                  </p>
                  <Link to="/search" className="btn btn-primary">Browse Doctors</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-md-7 col-lg-8">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleConfirm}>
                  <div className="info-widget">
                    <h4 className="card-title">Patient Information</h4>
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <div className="mb-3 card-label">
                          <label className="mb-2">First Name</label>
                          <input className="form-control" type="text" value={firstName} readOnly />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="mb-3 card-label">
                          <label className="mb-2">Last Name</label>
                          <input className="form-control" type="text" value={lastName} readOnly />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="mb-3 card-label">
                          <label className="mb-2">Email</label>
                          <input className="form-control" type="email" value={user?.email || ''} readOnly />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="mb-3 card-label">
                          <label className="mb-2">Phone</label>
                          <input className="form-control" type="text" value={user?.phone || ''} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="info-widget">
                    <h4 className="card-title">Appointment Details</h4>
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-2"><strong>Doctor:</strong> {booking.doctorName || 'Doctor'}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-2"><strong>Type:</strong> {booking.bookingType === 'ONLINE' ? 'Online Consultation' : 'In-Person Visit'}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-2"><strong>Date:</strong> {formatAppointmentDate(booking.appointmentDate)}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-2"><strong>Time:</strong> {formatAppointmentTime(booking.appointmentTime)}</p>
                      </div>
                      {booking.clinicName && (
                        <div className="col-md-6">
                          <p className="mb-2"><strong>Clinic:</strong> {booking.clinicName}</p>
                        </div>
                      )}
                      {booking.patientNotes && (
                        <div className="col-12">
                          <p className="mb-2"><strong>Notes:</strong> {booking.patientNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="payment-widget">
                    <h4 className="card-title">Payment Method</h4>

                    <div className="payment-list">
                      <label className="payment-radio credit-card-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="DUMMY"
                          checked={paymentMethod === 'DUMMY'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="checkmark"></span>
                        Test Payment (Dummy)
                      </label>
                      <label className="payment-radio credit-card-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="CARD"
                          checked={paymentMethod === 'CARD'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="checkmark"></span>
                        Credit/Debit Card
                      </label>
                      <label className="payment-radio paypal-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="PAYPAL"
                          checked={paymentMethod === 'PAYPAL'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="checkmark"></span>
                        PayPal
                      </label>
                      <label className="payment-radio paypal-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="BANK"
                          checked={paymentMethod === 'BANK'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="checkmark"></span>
                        Bank Transfer
                      </label>
                    </div>

                    <div className="alert alert-info mt-3">
                      <p className="mb-0">
                        The payment amount is calculated by the server from the doctor&apos;s
                        consultation fee and the selected services. It cannot be edited here.
                      </p>
                    </div>

                    <div className="terms-accept">
                      <div className="custom-checkbox">
                        <input
                          type="checkbox"
                          id="terms_accept"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                        <label htmlFor="terms_accept">
                          I have read and accept <Link to="/terms-condition">Terms &amp; Conditions</Link>
                        </label>
                      </div>
                    </div>

                    {submitError && (
                      <div className="alert alert-danger mt-3" role="alert">
                        {submitError}
                      </div>
                    )}

                    <div className="submit-section mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary submit-btn"
                        disabled={submitting || quoteLoading || !quote || !!quoteError}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Processing payment...
                          </>
                        ) : 'Confirm and Pay'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-5 col-lg-4 theiaStickySidebar">
            <div className="card booking-card">
              <div className="card-header">
                <h4 className="card-title">Booking Summary</h4>
              </div>
              <div className="card-body">
                <div className="booking-doc-info">
                  <span className="booking-doc-img">
                    <img
                      src={booking.doctorImage || '/assets/img/clients/client-15.jpg'}
                      alt={booking.doctorName || 'Doctor'}
                      onError={(e) => { e.target.src = '/assets/img/clients/client-15.jpg' }}
                    />
                  </span>
                  <div className="booking-info">
                    <h4>{booking.doctorName || 'Doctor'}</h4>
                    <p className="mb-0 text-muted">{booking.specializationName || 'General Consultation'}</p>
                    <div className="clinic-details">
                      <p className="doc-location mb-0">
                        <i className="fas fa-map-marker-alt"></i> {booking.doctorLocation || 'Location not available'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="booking-summary">
                  <div className="booking-item-wrap">
                    <ul className="booking-date">
                      <li>Date :<span>{formatAppointmentDate(booking.appointmentDate)}</span></li>
                      <li>Time :<span>{formatAppointmentTime(booking.appointmentTime)}</span></li>
                    </ul>

                    {quoteLoading ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                      </div>
                    ) : quoteError ? (
                      <div className="alert alert-danger mb-0">
                        {quoteError.response?.data?.message || quoteError.message || 'Could not calculate the price.'}
                      </div>
                    ) : quote && (
                      <>
                        <ul className="booking-fee">
                          <li>Consultation Fee <span>{formatCurrency(quote.consultationFee, quote.currency)}</span></li>
                          {(quote.selectedServices || []).map((service, index) => (
                            <li key={`${service.name}-${index}`}>
                              {service.name}
                              <span>{formatCurrency(service.price, quote.currency)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="booking-total">
                          <ul className="booking-total-list">
                            <li>
                              <span>Total</span>
                              <span className="total-cost">{formatCurrency(quote.totalAmount, quote.currency)}</span>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
