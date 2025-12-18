import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const DoctorDashboard = () => {
  useEffect(() => {
    // Initialize charts if needed
    if (typeof window !== 'undefined' && window.$) {
      // Initialize any carousels or charts here
    }
  }, [])

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* Sidebar is handled by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="row">
              <div className="col-xl-4 d-flex">
                <div className="dashboard-box-col w-100">
                  <div className="dashboard-widget-box">
                    <div className="dashboard-content-info">
                      <h6>Total Patient</h6>
                      <h4>978</h4>
                      <span className="text-success"><i className="fa-solid fa-arrow-up"></i>15% From Last Week</span>
                    </div>
                    <div className="dashboard-widget-icon">
                      <span className="dash-icon-box"><i className="fa-solid fa-user-injured"></i></span>
                    </div>
                  </div>
                  <div className="dashboard-widget-box">
                    <div className="dashboard-content-info">
                      <h6>Patients Today</h6>
                      <h4>80</h4>
                      <span className="text-danger"><i className="fa-solid fa-arrow-up"></i>15% From Yesterday</span>
                    </div>
                    <div className="dashboard-widget-icon">
                      <span className="dash-icon-box"><i className="fa-solid fa-user-clock"></i></span>
                    </div>
                  </div>
                  <div className="dashboard-widget-box">
                    <div className="dashboard-content-info">
                      <h6>Appointments Today</h6>
                      <h4>50</h4>
                      <span className="text-success"><i className="fa-solid fa-arrow-up"></i>20% From Yesterday</span>
                    </div>
                    <div className="dashboard-widget-icon">
                      <span className="dash-icon-box"><i className="fa-solid fa-calendar-days"></i></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8 d-flex">
                <div className="dashboard-card w-100">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Appointment</h5>
                    </div>
                    <div className="dropdown header-dropdown">
                      <a className="dropdown-toggle nav-tog" data-bs-toggle="dropdown" href="javascript:void(0);">
                        Last 7 Days
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">Today</a>
                        <a href="javascript:void(0);" className="dropdown-item">This Month</a>
                        <a href="javascript:void(0);" className="dropdown-item">Last 7 Days</a>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="table-responsive">
                      <table className="table dashboard-table appoint-table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="patient-info-profile">
                                <Link to="/appointments" className="table-avatar">
                                  <img src="/assets/img/doctors-dashboard/profile-01.jpg" alt="Img" />
                                </Link>
                                <div className="patient-name-info">
                                  <span>#Apt0001</span>
                                  <h5><Link to="/appointments">Adrian Marshall</Link></h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="appointment-date-created">
                                <h6>11 Nov 2024 10.45 AM</h6>
                                <span className="badge table-badge">General</span>
                              </div>
                            </td>
                            <td>
                              <div className="apponiment-actions d-flex align-items-center">
                                <a href="#" className="text-success-icon me-2"><i className="fa-solid fa-check"></i></a>
                                <a href="#" className="text-danger-icon"><i className="fa-solid fa-xmark"></i></a>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="patient-info-profile">
                                <Link to="/appointments" className="table-avatar">
                                  <img src="/assets/img/doctors-dashboard/profile-02.jpg" alt="Img" />
                                </Link>
                                <div className="patient-name-info">
                                  <span>#Apt0002</span>
                                  <h5><Link to="/appointments">Kelly Stevens</Link></h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="appointment-date-created">
                                <h6>10 Nov 2024 11.00 AM</h6>
                                <span className="badge table-badge">Clinic Consulting</span>
                              </div>
                            </td>
                            <td>
                              <div className="apponiment-actions d-flex align-items-center">
                                <a href="#" className="text-success-icon me-2"><i className="fa-solid fa-check"></i></a>
                                <a href="#" className="text-danger-icon"><i className="fa-solid fa-xmark"></i></a>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="patient-info-profile">
                                <Link to="/appointments" className="table-avatar">
                                  <img src="/assets/img/doctors-dashboard/profile-03.jpg" alt="Img" />
                                </Link>
                                <div className="patient-name-info">
                                  <span>#Apt0003</span>
                                  <h5><Link to="/appointments">Samuel Anderson</Link></h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="appointment-date-created">
                                <h6>03 Nov 2024 02.00 PM</h6>
                                <span className="badge table-badge">General</span>
                              </div>
                            </td>
                            <td>
                              <div className="apponiment-actions d-flex align-items-center">
                                <a href="#" className="text-success-icon me-2"><i className="fa-solid fa-check"></i></a>
                                <a href="#" className="text-danger-icon"><i className="fa-solid fa-xmark"></i></a>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="patient-info-profile">
                                <Link to="/appointments" className="table-avatar">
                                  <img src="/assets/img/doctors-dashboard/profile-04.jpg" alt="Img" />
                                </Link>
                                <div className="patient-name-info">
                                  <span>#Apt0004</span>
                                  <h5><Link to="/appointments">Catherine Griffin</Link></h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="appointment-date-created">
                                <h6>01 Nov 2024 04.00 PM</h6>
                                <span className="badge table-badge">Clinic Consulting</span>
                              </div>
                            </td>
                            <td>
                              <div className="apponiment-actions d-flex align-items-center">
                                <a href="#" className="text-success-icon me-2"><i className="fa-solid fa-check"></i></a>
                                <a href="#" className="text-danger-icon"><i className="fa-solid fa-xmark"></i></a>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="patient-info-profile">
                                <Link to="/appointments" className="table-avatar">
                                  <img src="/assets/img/doctors-dashboard/profile-05.jpg" alt="Img" />
                                </Link>
                                <div className="patient-name-info">
                                  <span>#Apt0005</span>
                                  <h5><Link to="/appointments">Robert Hutchinson</Link></h5>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="appointment-date-created">
                                <h6>28 Oct 2024 05.30 PM</h6>
                                <span className="badge table-badge">General</span>
                              </div>
                            </td>
                            <td>
                              <div className="apponiment-actions d-flex align-items-center">
                                <a href="#" className="text-success-icon me-2"><i className="fa-solid fa-check"></i></a>
                                <a href="#" className="text-danger-icon"><i className="fa-solid fa-xmark"></i></a>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-5 d-flex">
                <div className="dashboard-chart-col w-100">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head border-0">
                      <div className="header-title">
                        <h5>Weekly Overview</h5>
                      </div>
                      <div className="chart-create-date">
                        <h6>Mar 14 - Mar 21</h6>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="chart-tab">
                        <ul className="nav nav-pills product-licence-tab" id="pills-tab2" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="pills-revenue-tab" data-bs-toggle="pill" data-bs-target="#pills-revenue" type="button" role="tab" aria-controls="pills-revenue" aria-selected="false">Revenue</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-appointment-tab" data-bs-toggle="pill" data-bs-target="#pills-appointment" type="button" role="tab" aria-controls="pills-appointment" aria-selected="true">Appointments</button>
                          </li>
                        </ul>
                        <div className="tab-content w-100" id="v-pills-tabContent">
                          <div className="tab-pane fade show active" id="pills-revenue" role="tabpanel" aria-labelledby="pills-revenue-tab">
                            <div id="revenue-chart"></div>
                          </div>
                          <div className="tab-pane fade" id="pills-appointment" role="tabpanel" aria-labelledby="pills-appointment-tab">
                            <div id="appointment-chart"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Recent Patients</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="/my-patients">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="d-flex recent-patient-grid-boxes">
                        <div className="recent-patient-grid">
                          <Link to="/patient-details" className="patient-img">
                            <img src="/assets/img/doctors-dashboard/profile-01.jpg" alt="Img" />
                          </Link>
                          <h5><Link to="/patient-details">Adrian Marshall</Link></h5>
                          <span>Patient ID : P0001</span>
                          <div className="date-info">
                            <p>Last Appointment<br />15 Mar 2024</p>
                          </div>
                        </div>
                        <div className="recent-patient-grid">
                          <Link to="/patient-details" className="patient-img">
                            <img src="/assets/img/doctors-dashboard/profile-02.jpg" alt="Img" />
                          </Link>
                          <h5><Link to="/patient-details">Kelly Stevens</Link></h5>
                          <span>Patient ID : P0002</span>
                          <div className="date-info">
                            <p>Last Appointment<br />13 Mar 2024</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-7 d-flex">
                <div className="dashboard-main-col w-100">
                  <div className="upcoming-appointment-card">
                    <div className="title-card">
                      <h5>Upcoming Appointment</h5>
                    </div>
                    <div className="upcoming-patient-info">
                      <div className="info-details">
                        <span className="img-avatar"><img src="/assets/img/doctors-dashboard/profile-01.jpg" alt="Img" /></span>
                        <div className="name-info">
                          <span>#Apt0001</span>
                          <h6>Adrian Marshall</h6>
                        </div>
                      </div>
                      <div className="date-details">
                        <span>General visit</span>
                        <h6>Today, 10:45 AM</h6>
                      </div>
                      <div className="circle-bg">
                        <img src="/assets/img/bg/dashboard-circle-bg.png" alt="Img" />
                      </div>
                    </div>
                    <div className="appointment-card-footer">
                      <h5><i className="fa-solid fa-video"></i>Video Appointment</h5>
                      <div className="btn-appointments">
                        <Link to="/chat" className="btn">Chat Now</Link>
                        <Link to="/doctor-appointment-start" className="btn">Start Appointment</Link>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Recent Invoices</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="/invoices">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link to="/invoices" className="table-avatar">
                                    <img src="/assets/img/doctors-dashboard/profile-01.jpg" alt="Img" />
                                  </Link>
                                  <div className="patient-name-info">
                                    <h5><Link to="/invoices">Adrian</Link></h5>
                                    <span>#Apt0001</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>$450</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>11 Nov 2024</h6>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-view d-flex align-items-center">
                                  <Link to="/invoice-view"><i className="isax isax-eye4"></i></Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <a href="#" className="table-avatar">
                                    <img src="/assets/img/doctors-dashboard/profile-02.jpg" alt="Img" />
                                  </a>
                                  <div className="patient-name-info">
                                    <h5><a href="#">Kelly</a></h5>
                                    <span>#Apt0002</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>10 Nov 2024</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>$500</h6>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-view d-flex align-items-center">
                                  <a href="#"><i className="isax isax-eye4"></i></a>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <a href="#" className="table-avatar">
                                    <img src="/assets/img/doctors-dashboard/profile-03.jpg" alt="Img" />
                                  </a>
                                  <div className="patient-name-info">
                                    <h5><a href="#">Samuel</a></h5>
                                    <span>#Apt0003</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>03 Nov 2024</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>$320</h6>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-view d-flex align-items-center">
                                  <a href="#"><i className="isax isax-eye4"></i></a>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <a href="#" className="table-avatar">
                                    <img src="/assets/img/doctors-dashboard/profile-04.jpg" alt="Img" />
                                  </a>
                                  <div className="patient-name-info">
                                    <h5><a href="#">Catherine</a></h5>
                                    <span>#Apt0004</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>01 Nov 2024</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>$240</h6>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-view d-flex align-items-center">
                                  <a href="#"><i className="isax isax-eye4"></i></a>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <a href="#" className="table-avatar">
                                    <img src="/assets/img/doctors-dashboard/profile-05.jpg" alt="Img" />
                                  </a>
                                  <div className="patient-name-info">
                                    <h5><a href="#">Robert</a></h5>
                                    <span>#Apt0005</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>28 Oct 2024</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>$380</h6>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-view d-flex align-items-center">
                                  <a href="#"><i className="isax isax-eye4"></i></a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-7 d-flex">
                <div className="dashboard-card w-100">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Notifications</h5>
                    </div>
                    <div className="card-view-link">
                      <a href="#">View All</a>
                    </div>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="table-responsive">
                      <table className="table dashboard-table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="table-noti-info">
                                <div className="table-noti-icon color-violet">
                                  <i className="fa-solid fa-bell"></i>
                                </div>
                                <div className="table-noti-message">
                                  <h6><a href="#">Booking Confirmed on <span> 21 Mar 2024 </span> 10:30 AM</a></h6>
                                  <span className="message-time">Just Now</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="table-noti-info">
                                <div className="table-noti-icon color-blue">
                                  <i className="fa-solid fa-star"></i>
                                </div>
                                <div className="table-noti-message">
                                  <h6><a href="#">You have a  <span> New </span> Review for your Appointment </a></h6>
                                  <span className="message-time">5 Days ago</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="table-noti-info">
                                <div className="table-noti-icon color-red">
                                  <i className="fa-solid fa-calendar-check"></i>
                                </div>
                                <div className="table-noti-message">
                                  <h6><a href="#">You have Appointment with <span> Ahmed </span> by 01:20 PM </a></h6>
                                  <span className="message-time">12:55 PM</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="table-noti-info">
                                <div className="table-noti-icon color-yellow">
                                  <i className="fa-solid fa-money-bill-1-wave"></i>
                                </div>
                                <div className="table-noti-message">
                                  <h6><a href="#">Sent an amount of <span> $200 </span> for an Appointment  by 01:20 PM </a></h6>
                                  <span className="message-time">2 Days ago</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="table-noti-info">
                                <div className="table-noti-icon color-blue">
                                  <i className="fa-solid fa-star"></i>
                                </div>
                                <div className="table-noti-message">
                                  <h6><a href="#">You have a  <span> New </span> Review for your Appointment </a></h6>
                                  <span className="message-time">5 Days ago</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-5 d-flex">
                <div className="dashboard-card w-100">
                  <div className="dashboard-card-head">
                    <div className="header-title">
                      <h5>Clinics & Availability</h5>
                    </div>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="clinic-available">
                      <div className="clinic-head">
                        <div className="clinic-info">
                          <span className="clinic-img">
                            <img src="/assets/img/doctors-dashboard/clinic-02.jpg" alt="Img" />
                          </span>
                          <h6>Sofi's Clinic</h6>
                        </div>
                        <div className="clinic-charge">
                          <span>$900</span>
                        </div>
                      </div>
                      <div className="available-time">
                        <ul>
                          <li>
                            <span>Tue :</span>
                            07:00 AM - 09:00 PM
                          </li>
                          <li>
                            <span>Wed : </span>
                            07:00 AM - 09:00 PM
                          </li>
                        </ul>
                        <div className="change-time">
                          <a href="#">Change </a>
                        </div>
                      </div>
                    </div>
                    <div className="clinic-available mb-0">
                      <div className="clinic-head">
                        <div className="clinic-info">
                          <span className="clinic-img">
                            <img src="/assets/img/doctors-dashboard/clinic-01.jpg" alt="Img" />
                          </span>
                          <h6>The Family Dentistry Clinic</h6>
                        </div>
                        <div className="clinic-charge">
                          <span>$600</span>
                        </div>
                      </div>
                      <div className="available-time">
                        <ul>
                          <li>
                            <span>Sat :</span>
                            07:00 AM - 09:00 PM
                          </li>
                          <li>
                            <span>Tue : </span>
                            07:00 AM - 09:00 PM
                          </li>
                        </ul>
                        <div className="change-time">
                          <a href="#">Change </a>
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
    </div>
  )
}

export default DoctorDashboard
