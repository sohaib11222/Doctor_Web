import { useLocation } from 'react-router-dom'
import Header from '../components/common/Header'
import DoctorSidebar from '../components/common/DoctorSidebar'
import PatientSidebar from '../components/common/PatientSidebar'
import PharmacySidebar from '../components/common/PharmacySidebar'
import Footer from '../components/common/Footer'
import Breadcrumb from '../components/common/Breadcrumb'
import IncomingCallNotifier from '../components/video/IncomingCallNotifier'
import PharmacySetupModal from '../components/common/PharmacySetupModal'

const DashboardLayout = ({ children, breadcrumb }) => {
  const location = useLocation()
  const isDoctorRoute = location.pathname.startsWith('/doctor') || 
                        location.pathname === '/appointments' ||
                        location.pathname === '/doctor-appointments-grid' ||
                        location.pathname === '/doctor-upcoming-appointment' ||
                        location.pathname === '/doctor-completed-appointment' ||
                        location.pathname === '/doctor-cancelled-appointment' ||
                        location.pathname === '/doctor-appointment-details' ||
                        location.pathname === '/doctor-appointment-start' ||
                        location.pathname === '/available-timings' ||
                        location.pathname === '/my-patients' ||
                        location.pathname === '/doctor-specialities' ||
                        location.pathname === '/reviews' ||
                        location.pathname === '/invoices' ||
                        location.pathname === '/doctor-request' ||
                        location.pathname === '/chat-doctor'
  const patientPaths = [
    '/patient-appointments', '/patient-appointments-grid', '/patient-upcoming-appointment',
    '/patient-completed-appointment', '/patient-cancelled-appointment', '/patient-appointment-details',
    '/patient-profile', '/patient-invoices', '/patient-accounts', '/patient-notifications',
    '/profile-settings', '/change-password', '/favourites', '/chat', '/dependent',
    '/medical-records', '/medical-details', '/patient/prescription',
    '/patient/request-reschedule', '/patient/reschedule-requests', '/map-view', '/clinic-navigation',
    '/order-history', '/order-details', '/documents-download', '/add-dependent', '/edit-dependent', '/patient-billing',
    '/patient-reports', '/two-factor-authentication', '/video-call', '/video-call-room', '/voice-call',
  ]
  const isPatientRoute = location.pathname.startsWith('/patient') ||
    location.pathname.startsWith('/support-tickets') ||
    patientPaths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`))
  const isPharmacyRoute = location.pathname.startsWith('/pharmacy/')
  const isChatRoute = location.pathname === '/chat' || location.pathname === '/chat-doctor' || location.pathname === '/doctor/admin-chat'

  return (
    <div className="main-wrapper">
      <Header />
      {breadcrumb && <Breadcrumb {...breadcrumb} />}
      <div className="content">
        {isChatRoute ? (
          children
        ) : (
          <div className="container">
            <div className="row">
              {isDoctorRoute && !isChatRoute && (
                <div className="col-lg-4 col-xl-3 theiaStickySidebar">
                  <DoctorSidebar />
                </div>
              )}
              {isPatientRoute && !isChatRoute && (
                <div className="col-lg-4 col-xl-3 theiaStickySidebar">
                  <PatientSidebar />
                </div>
              )}
              {isPharmacyRoute && !isChatRoute && (
                <div className="col-lg-4 col-xl-3 theiaStickySidebar">
                  <PharmacySidebar />
                </div>
              )}
              <div className={(isDoctorRoute || isPatientRoute || isPharmacyRoute) && !isChatRoute
                ? "col-lg-8 col-xl-9"
                : "col-12"
              }>
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
      <IncomingCallNotifier />
      <PharmacySetupModal />
      <Footer />
    </div>
  )
}

export default DashboardLayout

