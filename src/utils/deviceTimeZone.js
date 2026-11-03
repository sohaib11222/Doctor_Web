const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/
const clockPattern = /^(\d{1,2}):(\d{2})$/

/**
 * Read the browser/device time zone instead of assuming the server's or a
 * country-specific zone. `Intl` follows the time-zone configured on the
 * device, including a user in one country whose computer is configured for a
 * different region.
 */
export const getDeviceTimeZone = () => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!timeZone) return null
    Intl.DateTimeFormat('en-US', { timeZone }).format()
    return timeZone
  } catch {
    return null
  }
}

/**
 * Return the device offset for the actual appointment clock, not today's
 * offset. This preserves daylight-saving changes for future appointments.
 */
export const getDeviceOffsetForAppointment = (dateValue, timeValue) => {
  const dateMatch = String(dateValue || '').match(datePattern)
  const timeMatch = String(timeValue || '').match(clockPattern)
  if (!dateMatch || !timeMatch) return -new Date().getTimezoneOffset()

  const [year, month, day] = dateMatch.slice(1).map(Number)
  const [hours, minutes] = timeMatch.slice(1).map(Number)
  const localAppointment = new Date(year, month - 1, day, hours, minutes, 0, 0)
  return -localAppointment.getTimezoneOffset()
}

export const getDeviceAppointmentTimeZone = (dateValue, timeValue) => ({
  timezone: getDeviceTimeZone(),
  timezoneOffset: getDeviceOffsetForAppointment(dateValue, timeValue),
})
