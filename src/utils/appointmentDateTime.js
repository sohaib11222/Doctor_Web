const dateAtUtcMidnight = (value) => {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Appointment dates are calendar dates stored at UTC midnight. Formatting in
 * UTC prevents a browser west of UTC from rendering the previous day.
 */
export const formatAppointmentDate = (value, options = {}) => {
  const date = dateAtUtcMidnight(value)
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date)
}

/** Appointment clocks are stored as wall-clock HH:mm values. */
export const formatAppointmentTime = (value) => {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return value || '—'
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return value
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(Date.UTC(2000, 0, 1, hours, minutes)))
}

export const formatAppointmentDateTime = (date, time) =>
  `${formatAppointmentDate(date)}${time ? ` · ${formatAppointmentTime(time)}` : ''}`

