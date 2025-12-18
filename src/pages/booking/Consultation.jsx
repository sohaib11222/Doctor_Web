import { Link } from 'react-router-dom'

const Consultation = () => {
  return (
    <>
      <div className="doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="back-link">
                <Link to="/paitent-details"><i className="fa-solid fa-arrow-left-long"></i> Back</Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-6">
              <div className="paitent-header">
                <h4 className="paitent-title">Type of Consultation</h4>
              </div>
              <div className="consultation-grid">
                <div className="consultation-info">
                  <p>Online Consultation</p>
                  <div className="consultation-list">
                    <ul>
                      <li>
                        <div className="consultation-types active">
                          <a href="javascript:void(0);">
                            <i className="feather-video"></i> Video Consulting
                          </a>
                          <span><i className="fas fa-circle-check"></i></span>
                        </div>
                      </li>
                      <li>
                        <div className="consultation-types">
                          <a href="javascript:void(0);">
                            <i className="feather-mic"></i> Audio Consulting
                          </a>
                          <span><i className="fas fa-circle-check"></i></span>
                        </div>
                      </li>
                      <li>
                        <div className="consultation-types">
                          <a href="javascript:void(0);">
                            <i className="feather-message-square"></i> Chat Consulting
                          </a>
                          <span><i className="fas fa-circle-check"></i></span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="consultation-info">
                  <p>Home Visit</p>
                  <div className="consultation-list">
                    <ul>
                      <li>
                        <div className="consultation-types">
                          <a href="javascript:void(0);">
                            <i className="feather-home"></i> Home Visit
                          </a>
                          <span><i className="fas fa-circle-check"></i></span>
                        </div>
                      </li>
                      <li>
                        <div className="consultation-types">
                          <a href="javascript:void(0);">
                            <i className="feather-users"></i> Consult Instatly
                          </a>
                          <span><i className="fas fa-circle-check"></i></span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="booking-btn">
                <Link to="/checkout" className="btn btn-primary prime-btn justify-content-center align-items-center">
                  Next <i className="feather-arrow-right-circle"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="booking-header">
                <h4 className="booking-title">Booking Summary</h4>
              </div>
              <div className="card booking-card">
                <div className="card-body booking-card-body">
                  <div className="booking-doctor-details">
                    <div className="booking-doctor-left">
                      <div className="booking-doctor-img">
                        <Link to="/doctor-profile">
                          <img src="/assets/img/doctors/doctor-02.jpg" alt="John Doe" />
                        </Link>
                      </div>
                      <div className="booking-doctor-info">
                        <h4><Link to="/doctor-profile">Dr. John Doe</Link></h4>
                        <p>MBBS, Dentist</p>
                      </div>
                    </div>
                    <div className="booking-doctor-right">
                      <p>
                        <i className="fas fa-circle-check"></i>
                        <Link to="/doctor-profile-settings">Edit</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card booking-card">
                <div className="card-body booking-card-body booking-list-body">
                  <div className="booking-list">
                    <div className="booking-date-list">
                      <ul>
                        <li>Booking Date: <span>Sun, 30 Aug 2023</span></li>
                        <li>Booking Time: <span>10.00AM to 11:00AM</span></li>
                      </ul>
                    </div>
                    <div className="booking-doctor-right">
                      <p>
                        <Link to="/booking">Edit</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card booking-card">
                <div className="card-body booking-card-body">
                  <div className="booking-doctor-details">
                    <div className="booking-doctor-left">
                      <div className="booking-doctor-img">
                        <a href="javascript:void(0);">
                          <img src="/assets/img/patients/patient3.jpg" alt="John Smith" />
                        </a>
                      </div>
                      <div className="booking-doctor-info">
                        <h4><Link to="/profile-settings">John Smith</Link></h4>
                        <p>P123456</p>
                      </div>
                    </div>
                    <div className="booking-doctor-right">
                      <p>
                        <Link to="/profile-settings">Edit</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card booking-card">
                <div className="card-body booking-card-body">
                  <div className="booking-doctor-details">
                    <div className="booking-device">
                      <div className="booking-device-img">
                        <img src="/assets/img/icons/device-message.svg" alt="device-message-image" />
                      </div>
                      <div className="booking-doctor-info">
                        <h3>We can help you</h3>
                        <p className="device-text">Call us +1 888-888-8888 (or) chat with our customer support team.</p>
                        <Link to="/chat" className="btn">Chat With Us</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card booking-card mb-0">
                <div className="card-body booking-card-body">
                  <div className="booking-doctor-details">
                    <div className="booking-device">
                      <div className="booking-device-img">
                        <img src="/assets/img/icons/smart-phone.svg" alt="smart-phone" />
                      </div>
                      <div className="booking-doctor-info">
                        <h3>Get the App</h3>
                        <p className="device-text">Download our app for better experience and for more feature</p>
                        <div className="app-images">
                          <a href="javascript:void(0);">
                            <img src="/assets/img/google-img.svg" alt="google-image" />
                          </a>
                          <a href="javascript:void(0);">
                            <img src="/assets/img/app-img.svg" alt="app-image" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Consultation

