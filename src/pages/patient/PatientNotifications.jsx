import { Link } from 'react-router-dom'

const PatientNotifications = () => {
  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            <div className="profile-sidebar patient-sidebar profile-sidebar-new">
              <div className="widget-profile pro-widget-content">
                <div className="profile-info-widget">
                  <Link to="/profile-settings" className="booking-doc-img">
                    <img src="/assets/img/doctors-dashboard/profile-06.jpg" alt="User Image" />
                  </Link>
                  <div className="profile-det-info">
                    <h3>
                      <Link to="/profile-settings">Hendrita Hayes</Link>
                    </h3>
                    <div className="patient-details">
                      <h5 className="mb-0">Patient ID : PT254654</h5>
                    </div>
                    <span>Female <i className="fa-solid fa-circle"></i> 32 years 03 Months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Notifications</h3>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="notification-list">
                  <div className="notification-item">
                    <div className="notification-icon">
                      <i className="isax isax-notification"></i>
                    </div>
                    <div className="notification-content">
                      <h5>Appointment Reminder</h5>
                      <p>Your appointment with Dr. John Doe is scheduled for tomorrow at 10:00 AM</p>
                      <span className="notification-time">2 hours ago</span>
                    </div>
                    <div className="notification-action">
                      <a href="javascript:void(0);" className="text-danger"><i className="isax isax-trash"></i></a>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon">
                      <i className="isax isax-sms"></i>
                    </div>
                    <div className="notification-content">
                      <h5>New Message</h5>
                      <p>You have a new message from Dr. Sarah Smith</p>
                      <span className="notification-time">5 hours ago</span>
                    </div>
                    <div className="notification-action">
                      <a href="javascript:void(0);" className="text-danger"><i className="isax isax-trash"></i></a>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon">
                      <i className="isax isax-document-text"></i>
                    </div>
                    <div className="notification-content">
                      <h5>Prescription Ready</h5>
                      <p>Your prescription is ready for download</p>
                      <span className="notification-time">1 day ago</span>
                    </div>
                    <div className="notification-action">
                      <a href="javascript:void(0);" className="text-danger"><i className="isax isax-trash"></i></a>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon">
                      <i className="isax isax-calendar-1"></i>
                    </div>
                    <div className="notification-content">
                      <h5>Appointment Confirmed</h5>
                      <p>Your appointment with Dr. Michael Brown has been confirmed</p>
                      <span className="notification-time">2 days ago</span>
                    </div>
                    <div className="notification-action">
                      <a href="javascript:void(0);" className="text-danger"><i className="isax isax-trash"></i></a>
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

export default PatientNotifications

