/**
 * Time format utilities
 * Convert between 24-hour (HH:MM) and 12-hour (h:mm AM/PM) formats
 */

/**
 * Convert 24-hour format to 12-hour format
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} Time in 12-hour format (h:mm AM/PM)
 */
export const to12Hour = (time24) => {
  if (!time24) return ''
  
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const minutesStr = minutes.toString().padStart(2, '0')
  
  return `${hours12}:${minutesStr} ${period}`
}

/**
 * Convert 12-hour format to 24-hour format
 * @param {string} time12 - Time in 12-hour format (h:mm AM/PM)
 * @returns {string} Time in 24-hour format (HH:MM)
 */
export const to24Hour = (time12) => {
  if (!time12) return ''
  
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return ''
  
  let hours = parseInt(match[1], 10)
  const minutes = match[2]
  const period = match[3].toUpperCase()
  
  if (period === 'PM' && hours !== 12) {
    hours += 12
  } else if (period === 'AM' && hours === 12) {
    hours = 0
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

/**
 * Validate time format (HH:MM)
 * @param {string} time - Time string
 * @returns {boolean} True if valid
 */
export const isValidTime = (time) => {
  const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
  return regex.test(time)
}

/**
 * Check if start time is before end time
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {boolean} True if start < end
 */
export const isStartBeforeEnd = (startTime, endTime) => {
  if (!isValidTime(startTime) || !isValidTime(endTime)) return false
  
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  
  return startMinutes < endMinutes
}

