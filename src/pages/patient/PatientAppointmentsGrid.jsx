import { Link } from 'react-router-dom'

const PatientAppointmentsGrid = () => {
  const upcomingAppointments = [
    { id: '#Apt0001', doctor: 'Dr Edalin Hendry', doctorImg: '/assets/img/doctors/doctor-thumb-21.jpg', date: '11 Nov 2024', time: '10.45 AM', visitType: 'General Visit', icon: 'video' },
    { id: '#Apt0002', doctor: 'Dr.Shanta Nesmith', doctorImg: '/assets/img/doctors/doctor-thumb-13.jpg', date: '05 Nov 2024', time: '11.50 AM', visitType: 'General Visit', icon: 'hospital' },
    { id: '#Apt0003', doctor: 'Dr.John Ewel', doctorImg: '/assets/img/doctors/doctor-thumb-14.jpg', date: '27 Oct 2024', time: '09.30 AM', visitType: 'General Visit', icon: 'call' },
    { id: '#Apt0004', doctor: 'Dr.Susan Fenimore', doctorImg: '/assets/img/doctors/doctor-thumb-15.jpg', date: '18 Oct 2024', time: '12.20 PM', visitType: 'General Visit', icon: 'hospital' }
  ]

  const getIcon = (iconType) => {
    switch(iconType) {
      case 'video': return <i className="isax isax-video5"></i>
      case 'hospital': return <i className="isax isax-hospital5"></i>
      case 'call': return <i className="isax isax-call5"></i>
      default: return <i className="isax isax-video5"></i>
    }
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-8 col-xl-9">
            <div className="dashboard-header">
              <h3>Appointments</h3>
              <ul className="header-list-btns">
                <li>
                  <div className="input-block dash-search-input">
                    <input type="text" className="form-control" placeholder="Search" />
                    <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                  </div>
                </li>
                <li>
                  <div className="view-icons">
                    <Link to="/patient-appointments"><i className="isax isax-grid-7"></i></Link>
                  </div>
                </li>
                <li>
                  <div className="view-icons">
                    <Link to="/patient-appointments-grid" className="active"><i className="fa-solid fa-th"></i></Link>
                  </div>
                </li>
              </ul>
            </div>
            <div className="appointment-tab-head">
              <div className="appointment-tabs">
                <ul className="nav nav-pills inner-tab" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-upcoming-tab" data-bs-toggle="pill" data-bs-target="#pills-upcoming" type="button" role="tab">Upcoming<span>21</span></button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-cancel-tab" data-bs-toggle="pill" data-bs-target="#pills-cancel" type="button" role="tab">Cancelled<span>16</span></button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-complete-tab" data-bs-toggle="pill" data-bs-target="#pills-complete" type="button" role="tab">Completed<span>214</span></button>
                  </li>
                </ul>
              </div>
              <div className="filter-head">
                <div className="position-relative daterange-wraper me-2">
                  <div className="input-groupicon calender-input">
                    <input type="text" className="form-control date-range bookingrange" placeholder="From Date - To Date" />
                  </div>
                  <i className="isax isax-calendar-1"></i>
                </div>
                <div className="form-sorts dropdown">
                  <a href="javascript:void(0);" className="dropdown-toggle" id="table-filter"><i className="isax isax-filter me-2"></i>Filter By</a>
                </div>
              </div>
            </div>

            <div className="tab-content appointment-tab-content appoint-patient">
              <div className="tab-pane fade show active" id="pills-upcoming" role="tabpanel">
                <div className="row">
                  {upcomingAppointments.map((apt, index) => (
                    <div key={index} className="col-xl-4 col-lg-6 col-md-12 d-flex">
                      <div className="appointment-wrap appointment-grid-wrap">
                        <ul>
                          <li>
                            <div className="appointment-grid-head">
                              <div className="patinet-information">
                                <Link to="/patient-upcoming-appointment">
                                  <img src={apt.doctorImg} alt="User Image" />
                                </Link>
                                <div className="patient-info">
                                  <p>{apt.id}</p>
                                  <h6><Link to="/patient-upcoming-appointment">{apt.doctor}</Link></h6>
                                  <p className="visit">{apt.visitType}</p>
                                </div>
                              </div>
                              <div className="grid-user-msg">
                                <span className={`${apt.icon === 'video' ? 'video' : apt.icon === 'hospital' ? 'hospital' : 'telephone'}-icon`}>
                                  <a href="#">{getIcon(apt.icon)}</a>
                                </span>
                              </div>
                            </div>
                          </li>
                          <li className="appointment-info">
                            <p><i className="isax isax-calendar5"></i>{apt.date}</p>
                            <p><i className="isax isax-clock5"></i>{apt.time}</p>
                          </li>
                          <li className="appointment-action">
                            <ul>
                              <li>
                                <Link to="/patient-upcoming-appointment"><i className="isax isax-eye4"></i></Link>
                              </li>
                              <li>
                                <a href="#"><i className="isax isax-messages-25"></i></a>
                              </li>
                              <li>
                                <a href="#"><i className="isax isax-close-circle5"></i></a>
                              </li>
                            </ul>
                            <div className="appointment-detail-btn">
                              <a href="#" className="start-link"><i className="isax isax-calendar-tick5 me-1"></i>Attend</a>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientAppointmentsGrid

