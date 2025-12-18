import { Link } from 'react-router-dom'

const DoctorUpcomingAppointment = () => {
  return (
    <>
      <div className="dashboard-header">
        <div className="header-back">
          <Link to="/appointments" className="back-arrow"><i className="fa-solid fa-arrow-left"></i></Link>
          <h3>Appointment Details</h3>
        </div>
      </div>
      <div className="appointment-details-wrap">
        {/* Appointment Detail Card */}
        <div className="appointment-wrap appointment-detail-card">
          <ul>
            <li>
              <div className="patinet-information">
                <a href="#">
                  <img src="/public/assets/img/doctors-dashboard/profile-02.jpg" alt="User Image" />
                </a>
                <div className="patient-info">
                  <p>#Apt0001</p>
                  <h6><a href="#">Kelly Joseph </a></h6>
                  <div className="mail-info-patient">
                    <ul>
                      <li><i className="fa-solid fa-envelope"></i>kelly@example.com</li>
                      <li><i className="fa-solid fa-phone"></i>+1 504 368 6874</li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li className="appointment-info">
              <div className="person-info">
                <p>Type of Appointment</p>
                <ul className="d-flex apponitment-types">
                  <li><i className="fa-solid fa-hospital text-green"></i>Direct Visit</li>
                </ul>
              </div>
            </li>
            <li className="appointment-action">
              <div className="detail-badge-info">
                <span className="badge bg-grey me-2">New Patient</span>
                <span className="badge bg-yellow">Upcoming</span>
              </div>
              <div className="consult-fees">
                <h6>Consultation Fees : $200</h6>
              </div>
              <ul>
                <li>
                  <a href="#"><i className="fa-solid fa-comments"></i></a>
                </li>
                <li>
                  <a href="#"><i className="fa-solid fa-xmark"></i></a>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="detail-card-bottom-info">
            <li>
              <h6>Appointment Date & Time</h6>
              <span>22 Jul 2023 - 12:00 pm</span>
            </li>
            <li>
              <h6>Clinic Location</h6>
              <span>Adrian's Dentistry</span>
            </li>
            <li>
              <h6>Location</h6>
              <span>Newyork, United States</span>
            </li>
            <li>
              <h6>Visit Type</h6>
              <span>General</span>
            </li>
            <li>
              <div className="start-btn">
                <Link to="/doctor-appointment-start" className="btn btn-secondary">Start Session</Link>
              </div>
            </li>
          </ul>
        </div>
        {/* /Appointment Detail Card */}

        <div className="recent-appointments">
          <h5 className="head-text">Recent Appointments</h5>
          {/* Appointment List */}
          <div className="appointment-wrap">
            <ul>
              <li>
                <div className="patinet-information">
                  <a href="#">
                    <img src="/public/assets/img/doctors-dashboard/profile-01.jpg" alt="User Image" />
                  </a>
                  <div className="patient-info">
                    <p>#Apt0001</p>
                    <h6><a href="#">Adrian</a></h6>
                  </div>
                </div>
              </li>
              <li className="appointment-info">
                <p><i className="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM</p>
                <ul className="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Chat</li>
                </ul>
              </li>
              <li className="mail-info-patient">
                <ul>
                  <li><i className="fa-solid fa-envelope"></i>adran@example.com</li>
                  <li><i className="fa-solid fa-phone"></i>+1 504 368 6874</li>
                </ul>
              </li>
              <li className="appointment-action">
                <ul>
                  <li>
                    <a href="#"><i className="fa-solid fa-eye"></i></a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          {/* /Appointment List */}
          {/* Appointment List */}
          <div className="appointment-wrap">
            <ul>
              <li>
                <div className="patinet-information">
                  <a href="#">
                    <img src="/public/assets/img/doctors-dashboard/profile-03.jpg" alt="User Image" />
                  </a>
                  <div className="patient-info">
                    <p>#Apt0003</p>
                    <h6><a href="#">Samuel</a></h6>
                  </div>
                </div>
              </li>
              <li className="appointment-info">
                <p><i className="fa-solid fa-clock"></i>27 Oct 2024 09.30 AM</p>
                <ul className="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Video Call</li>
                </ul>
              </li>
              <li className="mail-info-patient">
                <ul>
                  <li><i className="fa-solid fa-envelope"></i>samuel@example.com</li>
                  <li><i className="fa-solid fa-phone"></i> +1 749 104 6291</li>
                </ul>
              </li>
              <li className="appointment-action">
                <ul>
                  <li>
                    <a href="#"><i className="fa-solid fa-eye"></i></a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          {/* /Appointment List */}
        </div>
      </div>
    </>
  )
}

export default DoctorUpcomingAppointment

