import DashboardLayout from '../../layouts/DashboardLayout'

const TwoFactorAuthentication = () => {
  return (
    <DashboardLayout>
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-3 theiaStickySidebar">
              <div className="profile-sidebar patient-sidebar profile-sidebar-new">
                <div className="widget-profile pro-widget-content">
                  <div className="profile-info-widget">
                    <a href="/profile-settings" className="booking-doc-img">
                      <img src="/assets/img/doctors-dashboard/profile-06.jpg" alt="User Image" />
                    </a>
                    <div className="profile-det-info">
                      <h3>
                        <a href="/profile-settings">Hendrita Hayes</a>
                      </h3>
                      <div className="patient-details">
                        <h5 className="mb-0">Patient ID : PT254654</h5>
                      </div>
                      <span>
                        Female <i className="fa-solid fa-circle"></i> 32 years 03 Months
                      </span>
                    </div>
                  </div>
                </div>
                <div className="dashboard-widget">
                  <nav className="dashboard-menu">
                    <ul>
                      <li>
                        <a href="/patient/dashboard">
                          <i className="isax isax-category-2"></i>
                          <span>Dashboard</span>
                        </a>
                      </li>
                      <li>
                        <a href="/patient-appointments">
                          <i className="isax isax-calendar-1"></i>
                          <span>My Appointments</span>
                        </a>
                      </li>
                      <li>
                        <a href="/favourites">
                          <i className="isax isax-star-1"></i>
                          <span>Favourites</span>
                        </a>
                      </li>
                      <li>
                        <a href="/dependent">
                          <i className="isax isax-user-octagon"></i>
                          <span>Dependants</span>
                        </a>
                      </li>
                      <li>
                        <a href="/medical-records">
                          <i className="isax isax-note-21"></i>
                          <span>Medical Records</span>
                        </a>
                      </li>
                      <li>
                        <a href="/patient-accounts">
                          <i className="isax isax-wallet-2"></i>
                          <span>Wallet</span>
                        </a>
                      </li>
                      <li>
                        <a href="/patient-invoices">
                          <i className="isax isax-document-text"></i>
                          <span>Invoices</span>
                        </a>
                      </li>
                      <li>
                        <a href="/chat">
                          <i className="isax isax-messages-1"></i>
                          <span>Message</span>
                          <small className="unread-msg">7</small>
                        </a>
                      </li>
                      <li>
                        <a href="/medical-details">
                          <i className="isax isax-note-1"></i>
                          <span>Vitals</span>
                        </a>
                      </li>
                      <li className="active">
                        <a href="/profile-settings">
                          <i className="isax isax-setting-2"></i>
                          <span>Settings</span>
                        </a>
                      </li>
                      <li>
                        <a href="/login">
                          <i className="isax isax-logout"></i>
                          <span>Logout</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-xl-12">
              <nav className="settings-tab mb-1">
                <ul className="nav nav-tabs-bottom" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a className="nav-link" href="/profile-settings">
                      Profile
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a className="nav-link" href="/change-password">
                      Change Password
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a className="nav-link active" href="/two-factor-authentication">
                      2 Factor Authentication
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a className="nav-link" href="/delete-account">
                      Delete Account
                    </a>
                  </li>
                </ul>
              </nav>
              <div className="card mb-0">
                <div className="card-body">
                  <div className="border-bottom d-flex align-items-center justify-content-between gap-3 flex-wrap pb-3 mb-3">
                    <h5>2 Factor Authentication</h5>
                    <div className="status-toggle">
                      <input type="checkbox" id="status_2" className="check" defaultChecked />
                      <label htmlFor="status_2" className="checktoggle">
                        checkbox
                      </label>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <form action="/two-factor-authentication">
                        <div className="mb-3">
                          <h6 className="mb-1">Set up using an Email</h6>
                          <p className="fs-14">Enter your Email which we send you code</p>
                        </div>
                        <div className="mb-3 pb-3 border-bottom">
                          <label className="form-label">
                            Email Address <span className="text-danger">*</span>
                          </label>
                          <div className="d-flex align-items-center w-100 gap-2">
                            <div className="flex-grow-1">
                              <input type="text" className="form-control" />
                            </div>
                            <div>
                              <button className="btn btn-md btn-primary-gradient rounded-pill">Continue</button>
                            </div>
                          </div>
                        </div>
                        <label className="form-label">Enter the code generated by Email</label>
                        <div method="get" className="digit-group login-form-control" data-group-name="digits" data-autosubmit="false" autoComplete="off">
                          <div className="otp-box setting-otp">
                            <div className="mb-2">
                              <input type="text" id="digit-1" name="digit-1" data-next="digit-2" maxLength="1" />
                              <input type="text" id="digit-2" name="digit-2" data-next="digit-3" data-previous="digit-1" maxLength="1" />
                              <input type="text" id="digit-3" name="digit-3" data-next="digit-4" data-previous="digit-2" maxLength="1" />
                              <input type="text" id="digit-4" name="digit-4" data-next="digit-5" data-previous="digit-3" maxLength="1" />
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-md btn-primary-gradient rounded-pill">
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="card mb-0">
                    <div className="card-body">
                      <form action="/two-factor-authentication">
                        <div className="mb-3">
                          <h6 className="mb-1">Set up using an SMS</h6>
                          <p className="fs-14">Enter your phone number which we send you code</p>
                        </div>
                        <div className="mb-3 pb-3 border-bottom">
                          <label className="form-label">
                            Phone Number <span className="text-danger">*</span>
                          </label>
                          <div className="d-flex align-items-center w-100 gap-2">
                            <div className="flex-grow-1">
                              <input type="text" className="form-control" />
                            </div>
                            <div>
                              <a href="#" className="btn btn-md btn-primary-gradient rounded-pill" data-bs-target="#success-modal" data-bs-toggle="modal">
                                Continue
                              </a>
                            </div>
                          </div>
                        </div>
                        <label className="form-label">Enter the code generated by SMS</label>
                        <div method="get" className="digit-group login-form-control" data-group-name="digits" data-autosubmit="false" autoComplete="off">
                          <div className="otp-box setting-otp">
                            <div className="mb-2">
                              <input type="text" id="digit-1" name="digit-1" data-next="digit-2" maxLength="1" />
                              <input type="text" id="digit-2" name="digit-2" data-next="digit-3" data-previous="digit-1" maxLength="1" />
                              <input type="text" id="digit-3" name="digit-3" data-next="digit-4" data-previous="digit-2" maxLength="1" />
                              <input type="text" id="digit-4" name="digit-4" data-next="digit-5" data-previous="digit-3" maxLength="1" />
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-md btn-primary-gradient rounded-pill">
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TwoFactorAuthentication

