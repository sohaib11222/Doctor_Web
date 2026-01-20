/**
 * Profile Settings Tab Order
 * Defines the sequence of tabs for doctor profile completion flow
 */
export const PROFILE_SETTINGS_TABS = [
  {
    path: '/doctor-profile-settings',
    name: 'Basic Details',
    key: 'basic'
  },
  {
    path: '/doctor-specialities',
    name: 'Specialties & Services',
    key: 'specialties'
  },
  {
    path: '/doctor-experience-settings',
    name: 'Experience',
    key: 'experience'
  },
  {
    path: '/doctor-education-settings',
    name: 'Education',
    key: 'education'
  },
  {
    path: '/doctor-awards-settings',
    name: 'Awards',
    key: 'awards'
  },
  {
    path: '/doctor-clinics-settings',
    name: 'Clinics',
    key: 'clinics'
  },
  {
    path: '/doctor-insurance-settings',
    name: 'Insurance',
    key: 'insurance'
  },
  {
    path: '/doctor-business-settings',
    name: 'Business Hours',
    key: 'business'
  }
]

/**
 * Get the next tab path in the sequence
 * @param {string} currentPath - Current tab path
 * @returns {string|null} Next tab path or null if current is last
 */
export const getNextTabPath = (currentPath) => {
  const currentIndex = PROFILE_SETTINGS_TABS.findIndex(tab => tab.path === currentPath)
  if (currentIndex === -1 || currentIndex === PROFILE_SETTINGS_TABS.length - 1) {
    return null // Current tab not found or is the last tab
  }
  return PROFILE_SETTINGS_TABS[currentIndex + 1].path
}

/**
 * Get the current tab index
 * @param {string} currentPath - Current tab path
 * @returns {number} Tab index or -1 if not found
 */
export const getCurrentTabIndex = (currentPath) => {
  return PROFILE_SETTINGS_TABS.findIndex(tab => tab.path === currentPath)
}
