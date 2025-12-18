import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Public Pages - Home
import Index from './pages/Index'

// Public Pages - General
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Pricing from './pages/Pricing'
import FAQ from './pages/FAQ'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsCondition from './pages/TermsCondition'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import DoctorSignup from './pages/auth/DoctorSignup'
import DoctorRegister from './pages/auth/DoctorRegister'
import DoctorRegisterStep1 from './pages/auth/DoctorRegisterStep1'
import DoctorRegisterStep2 from './pages/auth/DoctorRegisterStep2'
import DoctorRegisterStep3 from './pages/auth/DoctorRegisterStep3'
import DoctorVerificationUpload from './pages/auth/DoctorVerificationUpload'
import PendingApprovalStatus from './pages/auth/PendingApprovalStatus'
import PharmacyRegister from './pages/auth/PharmacyRegister'
import PharmacyRegisterStep1 from './pages/auth/PharmacyRegisterStep1'
import PharmacyRegisterStep2 from './pages/auth/PharmacyRegisterStep2'
import PharmacyRegisterStep3 from './pages/auth/PharmacyRegisterStep3'

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorProfile from './pages/doctor/DoctorProfile'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorAppointmentsGrid from './pages/doctor/DoctorAppointmentsGrid'
import DoctorUpcomingAppointment from './pages/doctor/DoctorUpcomingAppointment'
import DoctorCompletedAppointment from './pages/doctor/DoctorCompletedAppointment'
import DoctorCancelledAppointment from './pages/doctor/DoctorCancelledAppointment'
import DoctorAppointmentDetails from './pages/doctor/DoctorAppointmentDetails'
import DoctorAppointmentStart from './pages/doctor/DoctorAppointmentStart'
import AvailableTimings from './pages/doctor/AvailableTimings'
import MyPatients from './pages/doctor/MyPatients'
import Reviews from './pages/doctor/Reviews'
import Invoices from './pages/doctor/Invoices'
import DoctorSpecialities from './pages/doctor/DoctorSpecialities'
import DoctorRequest from './pages/doctor/DoctorRequest'
import DoctorProfileSettings from './pages/doctor/DoctorProfileSettings'
import DoctorPayment from './pages/doctor/DoctorPayment'
import InvoiceView from './pages/doctor/InvoiceView'
import DoctorChangePassword from './pages/doctor/DoctorChangePassword'
import DoctorExperienceSettings from './pages/doctor/DoctorExperienceSettings'
import DoctorEducationSettings from './pages/doctor/DoctorEducationSettings'
import DoctorAwardsSettings from './pages/doctor/DoctorAwardsSettings'
import DoctorInsuranceSettings from './pages/doctor/DoctorInsuranceSettings'
import DoctorClinicsSettings from './pages/doctor/DoctorClinicsSettings'
import DoctorBusinessSettings from './pages/doctor/DoctorBusinessSettings'
import SocialMedia from './pages/doctor/SocialMedia'
import SubscriptionPlans from './pages/doctor/SubscriptionPlans'
import DoctorAnnouncements from './pages/doctor/DoctorAnnouncements'
import AdminDoctorChat from './pages/doctor/AdminDoctorChat'
import DoctorChat from './pages/doctor/DoctorChat'
import DoctorVideoCallRoom from './pages/doctor/DoctorVideoCallRoom'

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard'
import PatientProfile from './pages/patient/PatientProfile'
import PatientAppointments from './pages/patient/PatientAppointments'
import PatientAppointmentsGrid from './pages/patient/PatientAppointmentsGrid'
import PatientUpcomingAppointment from './pages/patient/PatientUpcomingAppointment'
import PatientCompletedAppointment from './pages/patient/PatientCompletedAppointment'
import PatientCancelledAppointment from './pages/patient/PatientCancelledAppointment'
import PatientAppointmentDetails from './pages/patient/PatientAppointmentDetails'
import PatientAccounts from './pages/patient/PatientAccounts'
import ProfileSettings from './pages/patient/ProfileSettings'
import ChangePassword from './pages/patient/ChangePassword'
import Favourites from './pages/patient/Favourites'
import Chat from './pages/patient/Chat'
import Dependent from './pages/patient/Dependent'
import MedicalRecords from './pages/patient/MedicalRecords'
import MedicalDetails from './pages/patient/MedicalDetails'
import PatientDetails from './pages/patient/PatientDetails'
import PatientOtherDetails from './pages/patient/PatientOtherDetails'
import PatientPersonalize from './pages/patient/PatientPersonalize'
import PatientFamilyDetails from './pages/patient/PatientFamilyDetails'
import PatientDependantDetails from './pages/patient/PatientDependantDetails'
import PatientEmail from './pages/patient/PatientEmail'
import PatientRegisterStep1 from './pages/patient/PatientRegisterStep1'
import PatientRegisterStep2 from './pages/patient/PatientRegisterStep2'
import PatientRegisterStep3 from './pages/patient/PatientRegisterStep3'
import PatientRegisterStep4 from './pages/patient/PatientRegisterStep4'
import PatientRegisterStep5 from './pages/patient/PatientRegisterStep5'
import PaitentDetails from './pages/patient/PaitentDetails'
import AddDependent from './pages/patient/AddDependent'
import EditDependent from './pages/patient/EditDependent'
import PatientRegister from './pages/patient/PatientRegister'
import PatientBilling from './pages/patient/PatientBilling'
import PatientNotifications from './pages/patient/PatientNotifications'
import PatientReports from './pages/patient/PatientReports'
import TwoFactorAuthentication from './pages/patient/TwoFactorAuthentication'
import PatientInvoices from './pages/patient/PatientInvoices'
import VideoCallRoom from './pages/patient/VideoCallRoom'
import ClinicNavigation from './pages/patient/ClinicNavigation'
import OrderHistory from './pages/patient/OrderHistory'
import DocumentsDownload from './pages/patient/DocumentsDownload'

// Pharmacy Admin Pages
import PharmacyAdminDashboard from './pages/pharmacy-admin/PharmacyAdminDashboard'

// Search & Booking Pages
import Search from './pages/search/Search'
import Search2 from './pages/search/Search2'
import DoctorGrid from './pages/search/DoctorGrid'
import DoctorSearchGrid from './pages/search/DoctorSearchGrid'
import MapGrid from './pages/search/MapGrid'
import MapList from './pages/search/MapList'
import MapListAvailability from './pages/search/MapListAvailability'
import Booking from './pages/booking/Booking'
import BookingSuccess from './pages/booking/BookingSuccess'
import Checkout from './pages/booking/Checkout'
import Consultation from './pages/booking/Consultation'

// Pharmacy Pages
import PharmacyIndex from './pages/pharmacy/PharmacyIndex'
import PharmacyDetails from './pages/pharmacy/PharmacyDetails'
import PharmacySearch from './pages/pharmacy/PharmacySearch'
import ProductAll from './pages/pharmacy/ProductAll'
import ProductDescription from './pages/pharmacy/ProductDescription'
import Cart from './pages/pharmacy/Cart'
import ProductCheckout from './pages/pharmacy/ProductCheckout'
import PaymentSuccess from './pages/pharmacy/PaymentSuccess'

// Error Pages
import Error404 from './pages/Error404'
import Error500 from './pages/Error500'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Home Pages */}
            <Route path="/" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/index" element={<MainLayout><Index /></MainLayout>} />

            {/* Public General Pages */}
            <Route path="/about-us" element={<MainLayout><AboutUs /></MainLayout>} />
            <Route path="/contact-us" element={<MainLayout><ContactUs /></MainLayout>} />
            <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
            <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />
            <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
            <Route path="/terms-condition" element={<MainLayout><TermsCondition /></MainLayout>} />
            <Route path="/doctor-profile" element={<MainLayout><DoctorProfile /></MainLayout>} />

                {/* Auth Pages */}
                <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
                <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
                <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
                <Route path="/doctor-signup" element={<AuthLayout><DoctorSignup /></AuthLayout>} />
                <Route path="/doctor-register" element={<AuthLayout><DoctorRegister /></AuthLayout>} />
                <Route path="/doctor-register-step1" element={<AuthLayout><DoctorRegisterStep1 /></AuthLayout>} />
                <Route path="/doctor-register-step2" element={<AuthLayout><DoctorRegisterStep2 /></AuthLayout>} />
                <Route path="/doctor-register-step3" element={<AuthLayout><DoctorRegisterStep3 /></AuthLayout>} />
                <Route path="/doctor-verification-upload" element={<AuthLayout><DoctorVerificationUpload /></AuthLayout>} />
                <Route path="/pending-approval" element={<AuthLayout><PendingApprovalStatus /></AuthLayout>} />
                <Route path="/pharmacy-register" element={<AuthLayout><PharmacyRegister /></AuthLayout>} />
                <Route path="/pharmacy-register-step1" element={<AuthLayout><PharmacyRegisterStep1 /></AuthLayout>} />
                <Route path="/pharmacy-register-step2" element={<AuthLayout><PharmacyRegisterStep2 /></AuthLayout>} />
                <Route path="/pharmacy-register-step3" element={<AuthLayout><PharmacyRegisterStep3 /></AuthLayout>} />

            {/* Doctor Routes - Public */}
            <Route path="/doctor/dashboard" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Dashboard", li2: "Dashboard" }}><DoctorDashboard /></DashboardLayout>} />
            <Route path="/doctor-request" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Requests", li2: "Requests" }}><DoctorRequest /></DashboardLayout>} />
            <Route path="/appointments" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Appointments", li2: "Appointments" }}><DoctorAppointments /></DashboardLayout>} />
            <Route path="/doctor-appointments-grid" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Appointments", li2: "Appointments" }}><DoctorAppointmentsGrid /></DashboardLayout>} />
            <Route path="/doctor-upcoming-appointment" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Appointment Details", li2: "Appointment Details" }}><DoctorUpcomingAppointment /></DashboardLayout>} />
            <Route path="/doctor-completed-appointment" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Appointment Details", li2: "Appointment Details" }}><DoctorCompletedAppointment /></DashboardLayout>} />
            <Route path="/doctor-cancelled-appointment" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Appointment Details", li2: "Appointment Details" }}><DoctorCancelledAppointment /></DashboardLayout>} />
            <Route path="/doctor-appointment-details" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Appointment Details", li2: "Appointment Details" }}><DoctorAppointmentDetails /></DashboardLayout>} />
            <Route path="/doctor-appointment-start" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Appointment Details", li2: "Appointment Details" }}><DoctorAppointmentStart /></DashboardLayout>} />
            <Route path="/available-timings" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Available Timings", li2: "Available Timings" }}><AvailableTimings /></DashboardLayout>} />
            <Route path="/my-patients" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "My Patients", li2: "My Patients" }}><MyPatients /></DashboardLayout>} />
            <Route path="/doctor-specialities" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Speciality & Services", li2: "Speciality & Services" }}><DoctorSpecialities /></DashboardLayout>} />
            <Route path="/reviews" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Reviews", li2: "Reviews" }}><Reviews /></DashboardLayout>} />
            <Route path="/invoices" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Invoices", li2: "Invoices" }}><Invoices /></DashboardLayout>} />
            <Route path="/doctor-profile-settings" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Doctor Profile", li2: "Doctor Profile" }}><DoctorProfileSettings /></DashboardLayout>} />
            <Route path="/doctor-payment" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Payout Settings", li2: "Payout Settings" }}><DoctorPayment /></DashboardLayout>} />
            <Route path="/invoice-view" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Invoice View", li2: "Invoice View" }}><InvoiceView /></DashboardLayout>} />
            <Route path="/doctor-change-password" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Change Password", li2: "Change Password" }}><DoctorChangePassword /></DashboardLayout>} />
            <Route path="/doctor-experience-settings" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Doctor Profile", li2: "Doctor Profile" }}><DoctorExperienceSettings /></DashboardLayout>} />
            <Route path="/doctor-education-settings" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Doctor Profile", li2: "Doctor Profile" }}><DoctorEducationSettings /></DashboardLayout>} />
            <Route path="/doctor-awards-settings" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Doctor Profile", li2: "Doctor Profile" }}><DoctorAwardsSettings /></DashboardLayout>} />
            <Route path="/doctor-insurance-settings" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Doctor Profile", li2: "Doctor Profile" }}><DoctorInsuranceSettings /></DashboardLayout>} />
            <Route path="/doctor-clinics-settings" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Doctor Profile", li2: "Doctor Profile" }}><DoctorClinicsSettings /></DashboardLayout>} />
            <Route path="/doctor-business-settings" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Doctor Profile", li2: "Doctor Profile" }}><DoctorBusinessSettings /></DashboardLayout>} />
            <Route path="/social-media" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Social Media", li2: "Social Media" }}><SocialMedia /></DashboardLayout>} />
            <Route path="/doctor/subscription-plans" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Subscription Plans", li2: "Subscription Plans" }}><SubscriptionPlans /></DashboardLayout>} />
            <Route path="/doctor/announcements" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Announcements", li2: "Announcements" }}><DoctorAnnouncements /></DashboardLayout>} />
            <Route path="/chat-doctor" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Message", li2: "Message" }}><DoctorChat /></DashboardLayout>} />
            <Route path="/doctor/admin-chat" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Admin Messages", li2: "Admin Messages" }}><AdminDoctorChat /></DashboardLayout>} />
            <Route path="/doctor/video-call" element={<DoctorVideoCallRoom />} />

                {/* Patient Routes - Public */}
                <Route path="/patient/dashboard" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Patient Dashboard", li2: "Patient Dashboard" }}><PatientDashboard /></DashboardLayout>} />
                <Route path="/patient-profile" element={<DashboardLayout breadcrumb={{ title: "Doctor", li1: "Patients Profile", li2: "Patients Profile" }}><PatientProfile /></DashboardLayout>} />
                <Route path="/patient-appointments" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Patient Appointments", li2: "Patient Appointments" }}><PatientAppointments /></DashboardLayout>} />
                <Route path="/patient-appointments-grid" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Appointments", li2: "Appointments" }}><PatientAppointmentsGrid /></DashboardLayout>} />
                <Route path="/patient-upcoming-appointment" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Appointments", li2: "Appointments" }}><PatientUpcomingAppointment /></DashboardLayout>} />
                <Route path="/patient-completed-appointment" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Appointments", li2: "Appointments" }}><PatientCompletedAppointment /></DashboardLayout>} />
                <Route path="/patient-cancelled-appointment" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Appointments", li2: "Appointments" }}><PatientCancelledAppointment /></DashboardLayout>} />
                <Route path="/patient-appointment-details" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Patient Appointments", li2: "Patient Appointments" }}><PatientAppointmentDetails /></DashboardLayout>} />
                <Route path="/patient-accounts" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Wallet", li2: "Wallet" }}><PatientAccounts /></DashboardLayout>} />
                <Route path="/profile-settings" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Settings", li2: "Settings" }}><ProfileSettings /></DashboardLayout>} />
                <Route path="/change-password" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Settings", li2: "Settings" }}><ChangePassword /></DashboardLayout>} />
                <Route path="/favourites" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Favourites", li2: "Favourites" }}><Favourites /></DashboardLayout>} />
                <Route path="/chat" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Message", li2: "Message" }}><Chat /></DashboardLayout>} />
                <Route path="/dependent" element={<DashboardLayout breadcrumb={{ title: "Dependants", li1: "Patient", li2: "Dependants" }}><Dependent /></DashboardLayout>} />
                <Route path="/medical-records" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Medical Records", li2: "Medical Records" }}><MedicalRecords /></DashboardLayout>} />
                <Route path="/medical-details" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Vitals", li2: "Vitals" }}><MedicalDetails /></DashboardLayout>} />
                <Route path="/patient-invoices" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Invoices", li2: "Invoices" }}><PatientInvoices /></DashboardLayout>} />
                <Route path="/video-call" element={<VideoCallRoom />} />
                <Route path="/voice-call" element={<VideoCallRoom />} />
                <Route path="/clinic-navigation" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Clinic Navigation", li2: "Clinic Navigation" }}><ClinicNavigation /></DashboardLayout>} />
                <Route path="/order-history" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Order History", li2: "Order History" }}><OrderHistory /></DashboardLayout>} />
                <Route path="/documents-download" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Documents", li2: "Documents & Receipts" }}><DocumentsDownload /></DashboardLayout>} />

                {/* Patient Onboarding Pages (Special Layout - No DashboardLayout) */}
                <Route path="/patient-email" element={<PatientEmail />} />
                <Route path="/patient-Personalize" element={<PatientPersonalize />} />
                <Route path="/patient-details" element={<PatientDetails />} />
                <Route path="/patient-family-details" element={<PatientFamilyDetails />} />
                <Route path="/patient-dependant-details" element={<PatientDependantDetails />} />
                <Route path="/patient-other-details" element={<PatientOtherDetails />} />

                {/* Patient Registration Pages (Auth Layout) */}
                <Route path="/patient-register-step1" element={<AuthLayout><PatientRegisterStep1 /></AuthLayout>} />
                <Route path="/patient-register-step2" element={<AuthLayout><PatientRegisterStep2 /></AuthLayout>} />
                <Route path="/patient-register-step3" element={<AuthLayout><PatientRegisterStep3 /></AuthLayout>} />
                <Route path="/patient-register-step4" element={<AuthLayout><PatientRegisterStep4 /></AuthLayout>} />
                <Route path="/patient-register-step5" element={<AuthLayout><PatientRegisterStep5 /></AuthLayout>} />
                <Route path="/patient-register" element={<AuthLayout><PatientRegister /></AuthLayout>} />
                <Route path="/paitent-details" element={<MainLayout><PaitentDetails /></MainLayout>} />
                <Route path="/add-dependent" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Dependants", li2: "Add Dependant" }}><AddDependent /></DashboardLayout>} />
                <Route path="/edit-dependent" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Dependants", li2: "Edit Dependant" }}><EditDependent /></DashboardLayout>} />
                <Route path="/patient-billing" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Billing", li2: "Billing Information" }}><PatientBilling /></DashboardLayout>} />
                <Route path="/patient-notifications" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Notifications", li2: "Notifications" }}><PatientNotifications /></DashboardLayout>} />
                <Route path="/patient-reports" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Reports", li2: "Medical Reports" }}><PatientReports /></DashboardLayout>} />
                <Route path="/two-factor-authentication" element={<DashboardLayout breadcrumb={{ title: "Patient", li1: "Settings", li2: "2 Factor Authentication" }}><TwoFactorAuthentication /></DashboardLayout>} />

            {/* Pharmacy Admin Routes - Public */}
            <Route path="/pharmacy-admin/dashboard" element={<DashboardLayout><PharmacyAdminDashboard /></DashboardLayout>} />

            {/* Search & Booking Routes - Public */}
            <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
            <Route path="/search-2" element={<MainLayout><Search2 /></MainLayout>} />
            <Route path="/doctor-grid" element={<MainLayout><DoctorGrid /></MainLayout>} />
            <Route path="/doctor-search-grid" element={<MainLayout><DoctorSearchGrid /></MainLayout>} />
            <Route path="/map-grid" element={<MainLayout><MapGrid /></MainLayout>} />
            <Route path="/map-list" element={<MainLayout><MapList /></MainLayout>} />
            <Route path="/map-list-availability" element={<MainLayout><MapListAvailability /></MainLayout>} />
            <Route path="/booking" element={<MainLayout><Booking /></MainLayout>} />
            <Route path="/booking-success" element={<MainLayout><BookingSuccess /></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
            <Route path="/consultation" element={<MainLayout><Consultation /></MainLayout>} />

            {/* Pharmacy Routes - Public */}
            <Route path="/pharmacy-index" element={<MainLayout><PharmacyIndex /></MainLayout>} />
            <Route path="/pharmacy-details" element={<MainLayout><PharmacyDetails /></MainLayout>} />
            <Route path="/pharmacy-search" element={<MainLayout><PharmacySearch /></MainLayout>} />
            <Route path="/product-all" element={<MainLayout><ProductAll /></MainLayout>} />
            <Route path="/product-description" element={<MainLayout><ProductDescription /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/product-checkout" element={<MainLayout><ProductCheckout /></MainLayout>} />
            <Route path="/payment-success" element={<MainLayout><PaymentSuccess /></MainLayout>} />

            {/* Error Pages */}
            <Route path="/error-404" element={<Error404 />} />
            <Route path="/error-500" element={<Error500 />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
