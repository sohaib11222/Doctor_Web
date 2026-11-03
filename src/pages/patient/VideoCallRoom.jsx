import { useSearchParams } from 'react-router-dom'
import AppointmentVideoCallRoom from '../../components/video/AppointmentVideoCallRoom'

const VideoCallRoom = () => {
  const [searchParams] = useSearchParams()

  return (
    <AppointmentVideoCallRoom
      backPath="/patient-appointments"
      localRole="Patient"
      remoteRole="Doctor"
    />
  )
}

export default VideoCallRoom
