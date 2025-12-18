import { Link } from 'react-router-dom'

const PatientUpcomingAppointment = () => {
  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <div className="header-back">
                <Link to="/patient-appointments" className="back-arrow"><i className="fa-solid fa-arrow-left"></i></Link>
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
                        <img src="/assets/img/doctors-dashboard/doctor-profile-img.jpg" alt="User Image" />
                      </a>
                      <div className="patient-info">
                        <p>#Apt0001</p>
                        <h6><a href="#">Dr Edalin Hendry</a></h6>
                        <div className="mail-info-patient">
                          <ul>
                            <li><i className="isax isax-sms5"></i>edalin@example.com</li>
                            <li><i className="isax isax-call5"></i> +1 504 368 6874</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="appointment-info">
                    <div className="person-info">
                      <p>Type of Appointment</p>
                      <ul className="d-flex apponitment-types">
                        <li><i className="isax isax-hospital5 text-green"></i>Direct Visit</li>
                      </ul>
                    </div>
                  </li>
                  <li className="appointment-action">
                    <div className="detail-badge-info">
                      <span className="badge bg-secondary">Upcoming</span>
                    </div>
                    <div className="consult-fees">
                      <h6>Consultation Fees : $200</h6>
                    </div>
                    <ul>
                      <li>
                        <a href="#"><i className="isax isax-messages-25"></i></a>
                      </li>
                      <li>
                        <a href="#"><i className="isax isax-close-circle5"></i></a>
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
                      <a href="#" className="btn btn-md btn-primary-gradient rounded-pill">Start Session</a>
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
                          <img src="/assets/img/doctors/doctor-15.jpg" alt="User Image" />
                        </a>
                        <div className="patient-info">
                          <p>#Apt0002</p>
                          <h6><a href="#">Dr.Shanta Nesmith</a></h6>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p><i className="isax isax-clock5"></i>11 Nov 2024 10.45 AM</p>
                      <ul className="d-flex apponitment-types">
                        <li>General Visit</li>
                        <li>Chat</li>
                      </ul>
                    </li>
                    <li className="mail-info-patient">
                      <ul>
                        <li><i className="isax isax-sms5"></i>shanta@example.com</li>
                        <li><i className="isax isax-call5"></i> +1 504 368 6874</li>
                      </ul>
                    </li>
                    <li className="appointment-action">
                      <ul>
                        <li>
                          <a href="#"><i className="isax isax-eye4"></i></a>
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
                          <img src="/assets/img/doctors/doctor-thumb-02.jpg" alt="User Image" />
                        </a>
                        <div className="patient-info">
                          <p>#Apt0003</p>
                          <h6><a href="#">Dr.John Ewel</a></h6>
                        </div>
                      </div>
                    </li>
                    <li className="appointment-info">
                      <p><i className="isax isax-clock5"></i>27 Oct 2024 09.30 AM</p>
                      <ul className="d-flex apponitment-types">
                        <li>General Visit</li>
                        <li>Video Call</li>
                      </ul>
                    </li>
                    <li className="mail-info-patient">
                      <ul>
                        <li><i className="isax isax-sms5"></i>john@example.com</li>
                        <li><i className="isax isax-call5"></i> +1 749 104 6291</li>
                      </ul>
                    </li>
                    <li className="appointment-action">
                      <ul>
                        <li>
                          <a href="#"><i className="isax isax-eye4"></i></a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                {/* /Appointment List */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientUpcomingAppointment

