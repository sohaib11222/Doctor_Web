import { Link } from 'react-router-dom'

const MyPatients = () => {
  return (
    <>
      <div className="dashboard-header">
        <h3>My Patients</h3>
        <ul className="header-list-btns">
          <li>
            <div className="input-block dash-search-input">
              <input type="text" className="form-control" placeholder="Search" />
              <span className="search-icon"><i className="isax isax-search-normal"></i></span>
            </div>
          </li>
        </ul>
      </div>
      <div className="appointment-tab-head">
        <div className="appointment-tabs">
          <ul className="nav nav-pills inner-tab" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="pills-upcoming-tab" data-bs-toggle="pill" data-bs-target="#pills-upcoming" type="button" role="tab" aria-controls="pills-upcoming" aria-selected="false">Active<span>200</span></button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-cancel-tab" data-bs-toggle="pill" data-bs-target="#pills-cancel" type="button" role="tab" aria-controls="pills-cancel" aria-selected="true">InActive<span>22</span></button>
            </li>
          </ul>
        </div>
        <div className="filter-head">
          <div className="position-relative daterange-wraper me-2">
            <div className="input-groupicon calender-input">
              <input type="text" className="form-control date-range bookingrange" placeholder="From Date - To Date " />
            </div>
            <i className="isax isax-calendar-1"></i>
          </div>
          <div className="form-sorts dropdown">
            <a href="javascript:void(0);" className="dropdown-toggle" id="table-filter"><i className="isax isax-filter me-2"></i>Filter By</a>
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
                  <a href="#" className="btn btn-light">Reset</a>
                  <a href="#" className="btn btn-primary">Filter Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-content appointment-tab-content grid-patient">
        <div className="tab-pane fade show active" id="pills-upcoming" role="tabpanel" aria-labelledby="pills-upcoming-tab">
          <div className="row">
            {/* Patient Grid */}
            <div className="col-xl-4 col-lg-6 col-md-6 d-flex">
              <div className="appointment-wrap appointment-grid-wrap">
                <ul>
                  <li>
                    <div className="appointment-grid-head">
                      <div className="patinet-information">
                        <Link to="/patient-profile">
                          <img src="/public/assets/img/doctors-dashboard/profile-01.jpg" alt="User Image" />
                        </Link>
                        <div className="patient-info">
                          <p>#Apt0001</p>
                          <h6><Link to="/patient-profile">Adrian</Link></h6>
                          <ul>
                            <li>Age : 42</li>
                            <li>Male</li>
                            <li>AB+</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="appointment-info">
                    <p><i className="isax isax-clock5"></i>11 Nov 2024 10.45 AM</p>
                    <p className="mb-0"><i className="isax isax-location5"></i>Alabama, USA</p>
                  </li>
                  <li className="appointment-action">
                    <div className="patient-book">
                      <p><i className="isax isax-calendar-1"></i>Last Booking <span>27 Feb 2024</span></p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Patient Grid */}

            {/* More patient grids would continue here... */}
            <div className="col-md-12">
              <div className="loader-item text-center">
                <a href="javascript:void(0);" className="btn btn-load">Load More</a>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-cancel" role="tabpanel" aria-labelledby="pills-cancel-tab">
          <div className="row">
            {/* Inactive patients grid */}
            <div className="col-xl-4 col-lg-6 col-md-6 d-flex">
              <div className="appointment-wrap appointment-grid-wrap">
                <ul>
                  <li>
                    <div className="appointment-grid-head">
                      <div className="patinet-information">
                        <Link to="/patient-profile">
                          <img src="/public/assets/img/doctors-dashboard/profile-01.jpg" alt="User Image" />
                        </Link>
                        <div className="patient-info">
                          <p>#Apt0001</p>
                          <h6><Link to="/patient-profile">Adrian</Link></h6>
                          <ul>
                            <li>Age : 42</li>
                            <li>Male</li>
                            <li>AB+</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="appointment-info">
                    <p><i className="isax isax-clock5"></i>11 Nov 2024 10.45 AM</p>
                    <p className="mb-0"><i className="isax isax-location5"></i>Alabama, USA</p>
                  </li>
                  <li className="appointment-action">
                    <div className="patient-book">
                      <p><i className="isax isax-calendar-1"></i>Last Booking <span>27 Feb 2024</span></p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-12">
              <div className="loader-item text-center">
                <a href="javascript:void(0);" className="btn btn-load">Load More</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyPatients

