/**
 * Script to create placeholder pages for all routes
 * Run this to generate all page files
 */

const fs = require('fs')
const path = require('path')

const pages = [
  // Index variations
  { name: 'Index3', path: 'Index3.jsx' },
  { name: 'Index4', path: 'Index4.jsx' },
  { name: 'Index5', path: 'Index5.jsx' },
  { name: 'Index6', path: 'Index6.jsx' },
  { name: 'Index7', path: 'Index7.jsx' },
  { name: 'Index8', path: 'Index8.jsx' },
  { name: 'Index9', path: 'Index9.jsx' },
  { name: 'Index10', path: 'Index10.jsx' },
  { name: 'Index11', path: 'Index11.jsx' },
  { name: 'Index12', path: 'Index12.jsx' },
  { name: 'Index13', path: 'Index13.jsx' },
  { name: 'Index14', path: 'Index14.jsx' },
  
  // General pages
  { name: 'AboutUs', path: 'AboutUs.jsx' },
  { name: 'ContactUs', path: 'ContactUs.jsx' },
  { name: 'Pricing', path: 'Pricing.jsx' },
  { name: 'FAQ', path: 'FAQ.jsx' },
  { name: 'PrivacyPolicy', path: 'PrivacyPolicy.jsx' },
  { name: 'TermsCondition', path: 'TermsCondition.jsx' },
  { name: 'Hospitals', path: 'Hospitals.jsx' },
  { name: 'Speciality', path: 'Speciality.jsx' },
  { name: 'Clinic', path: 'Clinic.jsx' },
  { name: 'DoctorGrid', path: 'DoctorGrid.jsx' },
  { name: 'DoctorSearchGrid', path: 'DoctorSearchGrid.jsx' },
  { name: 'Search', path: 'Search.jsx' },
  { name: 'Search2', path: 'Search2.jsx' },
  { name: 'MapGrid', path: 'MapGrid.jsx' },
  { name: 'MapList', path: 'MapList.jsx' },
  { name: 'MapListAvailability', path: 'MapListAvailability.jsx' },
  { name: 'Booking', path: 'Booking.jsx' },
  { name: 'Booking1', path: 'Booking1.jsx' },
  { name: 'Booking2', path: 'Booking2.jsx' },
  { name: 'BookingPopup', path: 'BookingPopup.jsx' },
  { name: 'BookingSuccess', path: 'BookingSuccess.jsx' },
  { name: 'BookingSuccessOne', path: 'BookingSuccessOne.jsx' },
  { name: 'Checkout', path: 'Checkout.jsx' },
  { name: 'Consultation', path: 'Consultation.jsx' },
  { name: 'Calendar', path: 'Calendar.jsx' },
  { name: 'VideoCall', path: 'VideoCall.jsx' },
  { name: 'VoiceCall', path: 'VoiceCall.jsx' },
  { name: 'ChatDoctor', path: 'ChatDoctor.jsx' },
  { name: 'ComingSoon', path: 'ComingSoon.jsx' },
  { name: 'Maintenance', path: 'Maintenance.jsx' },
  { name: 'Error404', path: 'Error404.jsx' },
  { name: 'Error500', path: 'Error500.jsx' },
  { name: 'BlankPage', path: 'BlankPage.jsx' },
  { name: 'Components', path: 'Components.jsx' },
  { name: 'TwoFactorAuthentication', path: 'TwoFactorAuthentication.jsx' },
  { name: 'DeleteAccount', path: 'DeleteAccount.jsx' },
  { name: 'SocialMedia', path: 'SocialMedia.jsx' },
]

const placeholderTemplate = (name) => `// Placeholder - Convert from resources/views/${name.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}.blade.php
import MainLayout from '../layouts/MainLayout'

const ${name} = () => {
  return (
    <MainLayout>
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>${name}</h1>
              <p>Convert from resources/views/${name.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}.blade.php</p>
              <p>Use Index.jsx as a template for conversion.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ${name}
`

const pagesDir = path.join(__dirname, 'src', 'pages')

// Create directories if they don't exist
const dirs = ['auth', 'blog', 'doctor', 'patient', 'admin', 'pharmacy', 'pharmacy-admin']
dirs.forEach(dir => {
  const dirPath = path.join(pagesDir, dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
})

// Create placeholder pages
pages.forEach(page => {
  const filePath = path.join(pagesDir, page.path)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, placeholderTemplate(page.name))
    console.log(`Created: ${filePath}`)
  }
})

console.log('Placeholder pages created!')
console.log('Now convert each page from the original Blade templates.')

