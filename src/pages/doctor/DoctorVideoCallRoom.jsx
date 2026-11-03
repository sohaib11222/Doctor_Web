import { useSearchParams } from 'react-router-dom'
import AppointmentVideoCallRoom from '../../components/video/AppointmentVideoCallRoom'

const DoctorVideoCallRoom = () => {
  const [searchParams] = useSearchParams()

  return (
    <AppointmentVideoCallRoom
      backPath="/appointments"
      localRole="Doctor"
      remoteRole="Patient"
    />
  )
}

export default DoctorVideoCallRoom
