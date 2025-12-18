import { Link } from 'react-router-dom'

const PatientAppointments = () => {
  const upcomingAppointments = [
    { id: '#Apt0001', doctor: 'Dr Edalin', doctorImg: '/assets/img/doctors/doctor-thumb-21.jpg', date: '11 Nov 2024 10.45 AM', types: ['General Visit', 'Video Call'], email: 'edalin@example.com', phone: '+1 504 368 6874' },
    { id: '#Apt0002', doctor: 'Dr.Shanta', doctorImg: '/assets/img/doctors/doctor-thumb-13.jpg', date: '05 Nov 2024 11.50 AM', types: ['General Visit', 'Audio Call'], email: 'shanta@example.com', phone: '+1 832 891 8403', isNew: true },
    { id: '#Apt0003', doctor: 'Dr.John', doctorImg: '/assets/img/doctors/doctor-thumb-14.jpg', date: '27 Oct 2024 09.30 AM', types: ['General Visit', 'Video Call'], email: 'john@example.com', phone: '+1 749 104 6291' },
    { id: '#Apt0004', doctor: 'Dr.Susan', doctorImg: '/assets/img/doctors/doctor-thumb-15.jpg', date: '18 Oct 2024 12.20 PM', types: ['General Visit', 'Direct Visit'], email: 'susan@example.com', phone: '+1 584 920 7183' }
  ]

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
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
                    <Link to="/patient-appointments" className="active"><i className="isax isax-grid-7"></i></Link>
                  </div>
                </li>
                <li>
                  <div className="view-icons">
                    <Link to="/patient-appointments-grid"><i className="fa-solid fa-th"></i></Link>
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

            <div className="tab-content appointment-tab-content">
              <div className="tab-pane fade show active" id="pills-upcoming" role="tabpanel">
                {upcomingAppointments.map((apt, index) => (
                  <div key={index} className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/patient-upcoming-appointment">
                            <img src={apt.doctorImg} alt="User Image" />
                          </Link>
                          <div className="patient-info">
                            <p>{apt.id}</p>
                            <h6>
                              <Link to="/patient-upcoming-appointment">{apt.doctor}</Link>
                              {apt.isNew && <span className="badge new-tag">New</span>}
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p><i className="isax isax-clock5"></i>{apt.date}</p>
                        <ul className="d-flex apponitment-types">
                          {apt.types.map((type, i) => (
                            <li key={i}>{type}</li>
                          ))}
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li><i className="isax isax-sms5"></i>{apt.email}</li>
                          <li><i className="isax isax-call5"></i>{apt.phone}</li>
                        </ul>
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
                      </li>
                      <li className="appointment-detail-btn">
                        <a href="#" className="btn btn-md btn-primary-gradient"><i className="isax isax-calendar-tick5 me-1"></i>Attend</a>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientAppointments

