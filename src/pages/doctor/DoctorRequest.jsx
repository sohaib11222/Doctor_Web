import { Link } from 'react-router-dom'

const DoctorRequest = () => {
  return (
    <>
      <div className="dashboard-header">
        <h3>Requests</h3>
        <ul>
          <li>
            <div className="dropdown header-dropdown">
              <a className="dropdown-toggle nav-tog" data-bs-toggle="dropdown" href="javascript:void(0);">
                Last 7 Days
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <a href="javascript:void(0);" className="dropdown-item">
                  Today
                </a>
                <a href="javascript:void(0);" className="dropdown-item">
                  This Month
                </a>
                <a href="javascript:void(0);" className="dropdown-item">
                  Last 7 Days
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* Request List */}
      <div className="appointment-wrap">
        <ul>
          <li>
            <div className="patinet-information">
              <Link to="/patient-profile">
                <img src="/public/assets/img/doctors-dashboard/profile-01.jpg" alt="User Image" />
              </Link>
              <div className="patient-info">
                <p>#Apt0001</p>
                <h6><Link to="/patient-profile">Adrian</Link><span className="badge new-tag">New</span></h6>
              </div>
            </div>
          </li>
          <li className="appointment-info">
            <p><i className="isax isax-clock5"></i>11 Nov 2024 10.45 AM</p>
            <p className="md-text">General Visit</p>
          </li>
          <li className="appointment-type">
            <p className="md-text">Type of Appointment</p>
            <p><i className="isax isax-video5 text-blue"></i>Video Call</p>
          </li>
          <li>
            <ul className="request-action">
              <li>
                <a href="#" className="accept-link" data-bs-toggle="modal" data-bs-target="#accept_appointment"><i className="fa-solid fa-check"></i>Accept</a>
              </li>
              <li>
                <a href="#" className="reject-link" data-bs-toggle="modal" data-bs-target="#cancel_appointment"><i className="fa-solid fa-xmark"></i>Reject</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      {/* /Request List */}

      {/* Request List */}
      <div className="appointment-wrap">
        <ul>
          <li>
            <div className="patinet-information">
              <Link to="/patient-profile">
                <img src="/public/assets/img/doctors-dashboard/profile-02.jpg" alt="User Image" />
              </Link>
              <div className="patient-info">
                <p>#Apt0002</p>
                <h6><Link to="/patient-profile">Kelly</Link></h6>
              </div>
            </div>
          </li>
          <li className="appointment-info">
            <p><i className="isax isax-clock5"></i>10 Nov 2024 02.00 PM</p>
            <p className="md-text">General Visit</p>
          </li>
          <li className="appointment-type">
            <p className="md-text">Type of Appointment</p>
            <p><i className="isax isax-building5 text-green"></i>Direct Visit <i className="fa-solid fa-circle-info" data-bs-toggle="tooltip" title="Clinic Location Sofia's Clinic"></i></p>
          </li>
          <li>
            <ul className="request-action">
              <li>
                <a href="#" className="accept-link" data-bs-toggle="modal" data-bs-target="#accept_appointment"><i className="fa-solid fa-check"></i>Accept</a>
              </li>
              <li>
                <a href="#" className="reject-link" data-bs-toggle="modal" data-bs-target="#cancel_appointment"><i className="fa-solid fa-xmark"></i>Reject</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      {/* /Request List */}

      {/* Request List */}
      <div className="appointment-wrap">
        <ul>
          <li>
            <div className="patinet-information">
              <Link to="/patient-profile">
                <img src="/public/assets/img/doctors-dashboard/profile-03.jpg" alt="User Image" />
              </Link>
              <div className="patient-info">
                <p>#Apt0003</p>
                <h6><Link to="/patient-profile">Samuel</Link></h6>
              </div>
            </div>
          </li>
          <li className="appointment-info">
            <p><i className="isax isax-clock5"></i>08 Nov 2024 08.30 AM</p>
            <p className="md-text">Consultation for Cardio</p>
          </li>
          <li className="appointment-type">
            <p className="md-text">Type of Appointment</p>
            <p><i className="isax isax-call5 text-indigo"></i>Audio Call</p>
          </li>
          <li>
            <ul className="request-action">
              <li>
                <a href="#" className="accept-link" data-bs-toggle="modal" data-bs-target="#accept_appointment"><i className="fa-solid fa-check"></i>Accept</a>
              </li>
              <li>
                <a href="#" className="reject-link" data-bs-toggle="modal" data-bs-target="#cancel_appointment"><i className="fa-solid fa-xmark"></i>Reject</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      {/* /Request List */}

      <div className="row">
        <div className="col-md-12">
          <div className="loader-item text-center">
            <a href="javascript:void(0);" className="btn btn-load">Load More</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default DoctorRequest

