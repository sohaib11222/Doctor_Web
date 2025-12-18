import { useLocation } from 'react-router-dom'
import Header from '../components/common/Header'
import DoctorSidebar from '../components/common/DoctorSidebar'
import PatientSidebar from '../components/common/PatientSidebar'
import Footer from '../components/common/Footer'
import Breadcrumb from '../components/common/Breadcrumb'

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
  const isPatientRoute = location.pathname.startsWith('/patient') ||
                        location.pathname === '/patient-appointments' ||
                        location.pathname === '/patient-appointments-grid' ||
                        location.pathname === '/patient-upcoming-appointment' ||
                        location.pathname === '/patient-completed-appointment' ||
                        location.pathname === '/patient-cancelled-appointment' ||
                        location.pathname === '/patient-appointment-details' ||
                        location.pathname === '/patient-profile' ||
                        location.pathname === '/patient-invoices' ||
                        location.pathname === '/patient-accounts' ||
                        location.pathname === '/profile-settings' ||
                        location.pathname === '/change-password' ||
                        location.pathname === '/favourites' ||
                        location.pathname === '/chat' ||
                        location.pathname === '/dependent' ||
                        location.pathname === '/medical-records' ||
                        location.pathname === '/medical-details'
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isPharmacyAdminRoute = location.pathname.startsWith('/pharmacy-admin')
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
              <div className={(isDoctorRoute || isPatientRoute) && !isChatRoute
                ? "col-lg-8 col-xl-9"
                : "col-12"
              }>
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default DashboardLayout

