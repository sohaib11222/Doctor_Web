import { Link } from 'react-router-dom'

const DoctorProfile = () => {
  return (
    <>
      {/* Doctor Widget */}
      <div className="card doc-profile-card">
        <div className="card-body">
          <div className="doctor-widget doctor-profile-two">
            <div className="doc-info-left">
              <div className="doctor-img">
                <img src="/public/assets/img/doctors/doc-profile-02.jpg" className="img-fluid" alt="User Image" />
              </div>
              <div className="doc-info-cont">
                <span className="badge doc-avail-badge"><i className="fa-solid fa-circle"></i>Available </span>
                <h4 className="doc-name">Dr.Martin Adian <img src="/public/assets/img/icons/badge-check.svg" alt="Img" /><span className="badge doctor-role-badge"><i className="fa-solid fa-circle"></i>Dentist</span></h4>
                <p>BDS, MDS - Oral & Maxillofacial Surgery</p>
                <p>Speaks : English, French, German</p>
                <p className="address-detail"><span className="loc-icon"><i className="feather-map-pin"></i></span>No 14, 15th Cross, Old Trafford, UK <span className="view-text">( View Location )</span></p>
              </div>
            </div>
            <div className="doc-info-right">
              <ul className="doctors-activities">
                <li>
                  <div className="hospital-info">
                    <span className="list-icon"><img src="/public/assets/img/icons/watch-icon.svg" alt="Img" /></span>
                    <p>Full Time, Online Therapy Available</p>
                  </div>
                  <ul className="sub-links">
                    <li><a href="#"><i className="feather-heart"></i></a></li>
                    <li><a href="#"><i className="feather-share-2"></i></a></li>
                    <li><a href="#"><i className="feather-link"></i></a></li>
                  </ul>
                </li>
                <li>
                  <div className="hospital-info">
                    <span className="list-icon"><img src="/public/assets/img/icons/thumb-icon.svg" alt="Img" /></span>
                    <p><b>94% </b> Recommended</p>
                  </div>
                </li>
                <li>
                  <div className="hospital-info">
                    <span className="list-icon"><img src="/public/assets/img/icons/building-icon.svg" alt="Img" /></span>
                    <p>Royal Prince Alfred Hospital</p>
                  </div>
                  <h5 className="accept-text"><span><i className="feather-check"></i></span>Accepting New Patients</h5>
                </li>
                <li>
                  <div className="rating">
                    <i className="fas fa-star filled"></i>
                    <i className="fas fa-star filled"></i>
                    <i className="fas fa-star filled"></i>
                    <i className="fas fa-star filled"></i>
                    <i className="fas fa-star filled"></i>
                    <span>5.0</span>
                    <a href="#" className="d-inline-block average-rating">150 Reviews</a>
                  </div>
                  <ul className="contact-doctors">
                    <li><Link to="/doctor/chat"><span><img src="/public/assets/img/icons/device-message2.svg" alt="Img" /></span>Chat</Link></li>
                    <li><Link to="/voice-call"><span className="bg-violet"><i className="feather-phone-forwarded"></i></span>Audio Call</Link></li>
                    <li><Link to="/video-call"><span className="bg-indigo"><i className="fa-solid fa-video"></i></span>Video Call</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div className="doc-profile-card-bottom">
            <ul>
              <li>
                <span className="bg-blue"><img src="/public/assets/img/icons/calendar3.svg" alt="Img" /></span>
                Nearly 200+ Appointment Booked
              </li>
              <li>
                <span className="bg-dark-blue"><img src="/public/assets/img/icons/bullseye.svg" alt="Img" /></span>
                In Practice for 21 Years
              </li>
              <li>
                <span className="bg-green"><img src="/public/assets/img/icons/bookmark-star.svg" alt="Img" /></span>
                15+ Awards
              </li>
            </ul>
            <div className="bottom-book-btn">
              <p><span>Price : $100 - $200 </span> for a Session</p>
              <div className="clinic-booking">
                <Link className="apt-btn" to="/booking">Book Appointment</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Doctor Widget */}
      
      <div className="doctors-detailed-info">
        <ul className="information-title-list">
          <li className="active">
            <a href="#doc_bio">Doctor Bio</a>
          </li>
          <li>
            <a href="#experience">Experience</a>
          </li>
          <li>
            <a href="#insurence">Insurances</a>
          </li>
          <li>
            <a href="#services">Treatments</a>
          </li>
          <li>
            <a href="#speciality">Speciality</a>
          </li>
          <li>
            <a href="#availability">Availability</a>
          </li>
          <li>
            <a href="#clinic">Clinics</a>
          </li>
          <li>
            <a href="#membership">Memberships</a>
          </li>
          <li>
            <a href="#awards">Awards</a>
          </li>
          <li>
            <a href="#bussiness_hour">Business Hours</a>
          </li>
          <li>
            <a href="#review">Review</a>
          </li>
        </ul>
        <div className="doc-information-main">
          <div className="doc-information-details bio-detail" id="doc_bio">
            <div className="detail-title">
              <h4>Doctor Bio</h4>
            </div>
            <p>"Highly motivated and experienced doctor with a passion for 
              providing excellent care to patients. Experienced in a wide variety of 
              medical settings, with particular expertise in diagnostics, primary care and emergency 
              medicine. Skilled in using the latest technology to streamline patient care. Committed to
              delivering compassionate, personalized care to each and every patient."
            </p>
            <a href="#" className="show-more d-flex align-items-center">See More<i className="fa-solid fa-chevron-down ms-2"></i></a>
          </div>
          {/* Other sections would continue here with the same structure */}
        </div>
      </div>
    </>
  )
}

export default DoctorProfile

