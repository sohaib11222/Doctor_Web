import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

const DoctorVideoCallRoom = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [callActive, setCallActive] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  // Get patient info from location state or use defaults
  const patientInfo = location.state?.patient || {
    name: 'Kelly Joseph',
    image: '/assets/img/patients/patient1.jpg',
    appointmentId: '#Apt0001'
  }

  useEffect(() => {
    // Initialize WebRTC (placeholder - actual implementation would use WebRTC API)
    // TODO: Implement actual WebRTC connection
    // Example: const peerConnection = new RTCPeerConnection()
    
    // Start call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    // Request camera and microphone permissions
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        })
        .catch(err => {
          console.error('Error accessing media devices:', err)
        })
    }

    return () => {
      clearInterval(timer)
      // Cleanup: stop all tracks
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    setCallActive(false)
    // Stop all media tracks
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
    navigate('/doctor/appointments')
  }

  const toggleVideo = () => {
    setVideoEnabled(prev => {
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getVideoTracks().forEach(track => {
          track.enabled = !prev
        })
      }
      return !prev
    })
  }

  const toggleAudio = () => {
    setAudioEnabled(prev => {
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getAudioTracks().forEach(track => {
          track.enabled = !prev
        })
      }
      return !prev
    })
  }

  if (!callActive) {
    return (
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="call-ended text-center py-5">
                <div className="call-ended-icon mb-4">
                  <i className="fe fe-phone-off" style={{ fontSize: '64px', color: '#dc3545' }}></i>
                </div>
                <h3>Call Ended</h3>
                <p className="text-muted">The video consultation has been ended.</p>
                <Link to="/doctor/appointments" className="btn btn-primary mt-3">
                  Back to Appointments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            {/* Call Wrapper */}
            <div className="call-wrapper">
              <div className="call-main-row">
                <div className="call-main-wrapper">
                  <div className="call-view">
                    <div className="call-window">
                      {/* Call Header */}
                      <div className="fixed-header">
                        <div className="navbar">
                          <div className="user-details">
                            <div className="float-start user-img">
                              <Link to="/doctor/my-patients" className="avatar avatar-sm me-2" title={patientInfo.name}>
                                <img src={patientInfo.image} alt="User Image" className="rounded-circle" />
                                <span className="status online"></span>
                              </Link>
                            </div>
                            <div className="user-info float-start">
                              <Link to="/doctor/my-patients"><span>{patientInfo.name}</span></Link>
                              <span className="last-seen">Appointment: {patientInfo.appointmentId}</span>
                            </div>
                          </div>
                          <ul className="nav float-end custom-menu">
                            <li className="nav-item dropdown dropdown-action">
                              <a href="javascript:void(0)" className="user-icon"><i className="isax isax-user-add"></i></a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* /Call Header */}

                      {/* Call Contents */}
                      <div className="call-contents">
                        <div className="call-content-wrap">
                          <div className="user-video">
                            <video
                              ref={remoteVideoRef}
                              autoPlay
                              playsInline
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            >
                              {/* Remote video stream will be displayed here */}
                            </video>
                            {!remoteVideoRef.current?.srcObject && (
                              <img src="/assets/img/video-call.jpg" alt="User Image" />
                            )}
                          </div>
                          <div className="my-video">
                            <ul>
                              <li>
                                <video
                                  ref={localVideoRef}
                                  autoPlay
                                  playsInline
                                  muted
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                >
                                  {/* Local video stream will be displayed here */}
                                </video>
                                {!localVideoRef.current?.srcObject && (
                                  <img src="/assets/img/doctors/doctor-thumb-01.jpg" className="img-fluid" alt="User Image" />
                                )}
                              </li>
                            </ul>
                          </div>
                          <div className="call-timer">
                            <span>{formatTime(callDuration)}</span>
                          </div>
                        </div>
                      </div>
                      {/* /Call Contents */}

                      {/* Call Footer */}
                      <div className="call-footer">
                        <div className="call-icons">
                          <ul className="call-items">
                            <li className="call-item">
                              <a
                                href="javascript:void(0)"
                                className={`mute-video ${!videoEnabled ? 'muted' : ''}`}
                                title={videoEnabled ? 'Disable Video' : 'Enable Video'}
                                onClick={toggleVideo}
                              >
                                <i className={`isax ${videoEnabled ? 'isax-video' : 'isax-video-slash'}`}></i>
                              </a>
                            </li>
                            <li className="call-item">
                              <a
                                href="javascript:void(0)"
                                className="call-end"
                                onClick={handleEndCall}
                                title="End Call"
                              >
                                <i className="isax isax-call"></i>
                              </a>
                            </li>
                            <li className="call-item">
                              <a
                                href="javascript:void(0)"
                                className={`mute-bt ${!audioEnabled ? 'muted' : ''}`}
                                title={audioEnabled ? 'Mute' : 'Unmute'}
                                onClick={toggleAudio}
                              >
                                <i className={`isax ${audioEnabled ? 'isax-microphone-2' : 'isax-microphone-slash'}`}></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* /Call Footer */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Call Wrapper */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorVideoCallRoom

