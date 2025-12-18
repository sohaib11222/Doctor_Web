import { Link } from 'react-router-dom'

const DoctorAppointments = () => {
  return (
    <>
      <div className="dashboard-header">
        <h3>Appointments</h3>
        <ul className="header-list-btns">
          <li>
            <div className="input-block dash-search-input">
              <input type="text" className="form-control" placeholder="Search" />
              <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
            </div>
          </li>
          <li>
            <div className="view-icons">
              <Link to="/appointments" className="active"><i className="fa-solid fa-list"></i></Link>
            </div>
          </li>
          <li>
            <div className="view-icons">
              <Link to="/doctor-appointments-grid"><i className="fa-solid fa-th"></i></Link>
            </div>
          </li>
          <li>
            <div className="view-icons">
              <a href="#"><i className="fa-solid fa-calendar-check"></i></a>
            </div>
          </li>
        </ul>
      </div>
      <div className="appointment-tab-head">
        <div className="appointment-tabs">
          <ul className="nav nav-pills inner-tab" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="pills-upcoming-tab" data-bs-toggle="pill" data-bs-target="#pills-upcoming" type="button" role="tab" aria-controls="pills-upcoming" aria-selected="false">Upcoming<span>21</span></button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-cancel-tab" data-bs-toggle="pill" data-bs-target="#pills-cancel" type="button" role="tab" aria-controls="pills-cancel" aria-selected="true">Cancelled<span>16</span></button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-complete-tab" data-bs-toggle="pill" data-bs-target="#pills-complete" type="button" role="tab" aria-controls="pills-complete" aria-selected="true">Completed<span>214</span></button>
            </li>
          </ul>
        </div>
        <div className="filter-head">
          <div className="position-relative daterange-wraper me-2">
            <div className="input-groupicon calender-input">
              <input type="text" className="form-control date-range bookingrange" placeholder="From Date - To Date " />
            </div>
            <i className="fa-solid fa-calendar-days"></i>
          </div>
          <div className="form-sorts dropdown">
            <a href="javascript:void(0);" className="dropdown-toggle" id="table-filter"><i className="fa-solid fa-filter me-2"></i>Filter By</a>
            <div className="filter-dropdown-menu">
              <div className="filter-set-view">
                <div className="accordion" id="accordionExample">
                  <div className="filter-set-content">
                    <div className="filter-set-content-head">
                      <a href="#" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">Name<i className="fa-solid fa-chevron-right"></i></a>
                    </div>
                    <div className="filter-set-contents accordion-collapse collapse show" id="collapseTwo" data-bs-parent="#accordionExample">
                      <ul>
                        <li>
                          <div className="input-block dash-search-input w-100">
                            <input type="text" className="form-control" placeholder="Search" />
                            <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="filter-set-content">
                    <div className="filter-set-content-head">
                      <a href="#" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Appointment Type<i className="fa-solid fa-chevron-right"></i></a>
                    </div>
                    <div className="filter-set-contents accordion-collapse collapse show" id="collapseOne" data-bs-parent="#accordionExample">
                      <ul>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" defaultChecked />
                              <span className="checkmarks"></span>
                              <span className="check-title">All Type</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks"></span>
                              <span className="check-title">Video Call</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks"></span>
                              <span className="check-title">Audio Call</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks"></span>
                              <span className="check-title">Chat</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks"></span>
                              <span className="check-title">Direct Visit</span>
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="filter-set-content">
                    <div className="filter-set-content-head">
                      <a href="#" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">Visit Type<i className="fa-solid fa-chevron-right"></i></a>
                    </div>
                    <div className="filter-set-contents accordion-collapse collapse show" id="collapseThree" data-bs-parent="#accordionExample">
                      <ul>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" defaultChecked />
                              <span className="checkmarks"></span>
                              <span className="check-title">All Visit</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks"></span>
                              <span className="check-title">General</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks"></span>
                              <span className="check-title">Consultation</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks"></span>
                              <span className="check-title">Follow-up</span>
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="filter-checks">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks"></span>
                              <span className="check-title">Direct Visit</span>
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="filter-reset-btns">
                  <Link to="/appointments" className="btn btn-light">Reset</Link>
                  <Link to="/appointments" className="btn btn-primary">Filter Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-content appointment-tab-content">
        <div className="tab-pane fade show active" id="pills-upcoming" role="tabpanel" aria-labelledby="pills-upcoming-tab">
          {/* Appointment List */}
          <div className="appointment-wrap">
            <ul>
              <li>
                <div className="patinet-information">
                  <Link to="/doctor-upcoming-appointment">
                    <img src="/public/assets/img/doctors-dashboard/profile-01.jpg" alt="User Image" />
                  </Link>
                  <div className="patient-info">
                    <p>#Apt0001</p>
                    <h6><Link to="/doctor-upcoming-appointment">Adrian</Link></h6>
                  </div>
                </div>
              </li>
              <li className="appointment-info">
                <p><i className="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM</p>
                <ul className="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Video Call</li>
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
                    <Link to="/doctor-upcoming-appointment"><i className="fa-solid fa-eye"></i></Link>
                  </li>
                  <li>
                    <a href="#"><i className="fa-solid fa-comments"></i></a>
                  </li>
                  <li>
                    <a href="#"><i className="fa-solid fa-xmark"></i></a>
                  </li>
                </ul>
              </li>
              <li className="appointment-start">
                <Link to="/doctor-appointment-start" className="start-link">Start Now</Link>
              </li>
            </ul>
          </div>
          {/* /Appointment List */}

          {/* Appointment List */}
          <div className="appointment-wrap">
            <ul>
              <li>
                <div className="patinet-information">
                  <Link to="/doctor-upcoming-appointment">
                    <img src="/public/assets/img/doctors-dashboard/profile-02.jpg" alt="User Image" />
                  </Link>
                  <div className="patient-info">
                    <p>#Apt0002</p>
                    <h6><Link to="/doctor-upcoming-appointment">Kelly</Link><span className="badge new-tag">New</span></h6>
                  </div>
                </div>
              </li>
              <li className="appointment-info">
                <p><i className="fa-solid fa-clock"></i>05 Nov 2024 11.50 AM</p>
                <ul className="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Audio Call</li>
                </ul>
              </li>
              <li className="mail-info-patient">
                <ul>
                  <li><i className="fa-solid fa-envelope"></i>kelly@example.com</li>
                  <li><i className="fa-solid fa-phone"></i> +1 832 891 8403</li>
                </ul>
              </li>
              <li className="appointment-action">
                <ul>
                  <li>
                    <Link to="/doctor-upcoming-appointment"><i className="fa-solid fa-eye"></i></Link>
                  </li>
                  <li>
                    <a href="#"><i className="fa-solid fa-comments"></i></a>
                  </li>
                  <li>
                    <a href="#"><i className="fa-solid fa-xmark"></i></a>
                  </li>
                </ul>
              </li>
              <li className="appointment-start">
                <Link to="/doctor-appointment-start" className="start-link">Start Now</Link>
              </li>
            </ul>
          </div>
          {/* /Appointment List */}

          {/* More appointment lists would continue here... */}
          {/* Pagination */}
          <div className="pagination dashboard-pagination">
            <ul>
              <li>
                <a href="#" className="page-link"><i className="fa-solid fa-chevron-left"></i></a>
              </li>
              <li>
                <a href="#" className="page-link">1</a>
              </li>
              <li>
                <a href="#" className="page-link active">2</a>
              </li>
              <li>
                <a href="#" className="page-link">3</a>
              </li>
              <li>
                <a href="#" className="page-link">4</a>
              </li>
              <li>
                <a href="#" className="page-link">...</a>
              </li>
              <li>
                <a href="#" className="page-link"><i className="fa-solid fa-chevron-right"></i></a>
              </li>
            </ul>
          </div>
          {/* /Pagination */}
        </div>
        <div className="tab-pane fade" id="pills-cancel" role="tabpanel" aria-labelledby="pills-cancel-tab">
          {/* Cancelled appointments list */}
          <div className="appointment-wrap">
            <ul>
              <li>
                <div className="patinet-information">
                  <Link to="/doctor-cancelled-appointment">
                    <img src="/public/assets/img/doctors-dashboard/profile-01.jpg" alt="User Image" />
                  </Link>
                  <div className="patient-info">
                    <p>#Apt0001</p>
                    <h6><Link to="/doctor-cancelled-appointment">Adrian</Link></h6>
                  </div>
                </div>
              </li>
              <li className="appointment-info">
                <p><i className="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM</p>
                <ul className="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Video Call</li>
                </ul>
              </li>
              <li className="appointment-detail-btn">
                <Link to="/doctor-cancelled-appointment" className="start-link">View Details</Link>
              </li>
            </ul>
          </div>
          {/* Pagination */}
          <div className="pagination dashboard-pagination">
            <ul>
              <li>
                <a href="#" className="page-link"><i className="fa-solid fa-chevron-left"></i></a>
              </li>
              <li>
                <a href="#" className="page-link">1</a>
              </li>
              <li>
                <a href="#" className="page-link active">2</a>
              </li>
              <li>
                <a href="#" className="page-link">3</a>
              </li>
              <li>
                <a href="#" className="page-link">4</a>
              </li>
              <li>
                <a href="#" className="page-link">...</a>
              </li>
              <li>
                <a href="#" className="page-link"><i className="fa-solid fa-chevron-right"></i></a>
              </li>
            </ul>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-complete" role="tabpanel" aria-labelledby="pills-complete-tab">
          {/* Completed appointments list */}
          <div className="appointment-wrap">
            <ul>
              <li>
                <div className="patinet-information">
                  <Link to="/doctor-completed-appointment">
                    <img src="/public/assets/img/doctors-dashboard/profile-01.jpg" alt="User Image" />
                  </Link>
                  <div className="patient-info">
                    <p>#Apt0001</p>
                    <h6><Link to="/doctor-completed-appointment">Adrian</Link></h6>
                  </div>
                </div>
              </li>
              <li className="appointment-info">
                <p><i className="fa-solid fa-clock"></i>11 Nov 2024 10.45 AM</p>
                <ul className="d-flex apponitment-types">
                  <li>General Visit</li>
                  <li>Video Call</li>
                </ul>
              </li>
              <li className="appointment-detail-btn">
                <Link to="/doctor-completed-appointment" className="start-link">View Details</Link>
              </li>
            </ul>
          </div>
          {/* Pagination */}
          <div className="pagination dashboard-pagination">
            <ul>
              <li>
                <a href="#" className="page-link"><i className="fa-solid fa-chevron-left"></i></a>
              </li>
              <li>
                <a href="#" className="page-link">1</a>
              </li>
              <li>
                <a href="#" className="page-link active">2</a>
              </li>
              <li>
                <a href="#" className="page-link">3</a>
              </li>
              <li>
                <a href="#" className="page-link">4</a>
              </li>
              <li>
                <a href="#" className="page-link">...</a>
              </li>
              <li>
                <a href="#" className="page-link"><i className="fa-solid fa-chevron-right"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default DoctorAppointments

