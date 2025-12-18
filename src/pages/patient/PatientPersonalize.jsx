import { Link } from 'react-router-dom'

const PatientPersonalize = () => {
  return (
    <>
      <div className="left-panel">
        <div className="onboarding-logo text-center">
          <Link to="/"><img src="/assets/img/onboard-img/onb-logo.png" className="img-fluid" alt="doccure-logo" /></Link>
        </div>
        <div className="onboard-img">
          <img src="/assets/img/onboard-img/onb-slide-img.png" className="img-fluid" alt="onboard-slider" />
        </div>
        <div className="onboarding-slider">
          <div id="onboard-slider" className="owl-carousel owl-theme onboard-slider slider">
            {[1, 2, 3].map((i) => (
              <div key={i} className="onboard-item text-center">
                <div className="onboard-content">
                  <h3>Welcome to Doccure</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="right-panel">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 p-0">
            <div className="right-panel-title text-center">
              <Link to="/"><img src="/assets/img/onboard-img/onb-logo.png" alt="doccure-logo" /></Link>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="on-board-wizard">
              <ul>
                <li>
                  <Link to="/patient-email">
                    <div className="onboarding-progress active">
                      <span>1</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Registration</h6>
                      <p>Enter Details for Register</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/patient-Personalize">
                    <div className="onboarding-progress active">
                      <span>2</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Profile Picture</h6>
                      <p>Upload Profile picture</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/patient-details">
                    <div className="onboarding-progress">
                      <span>3</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Personal Details</h6>
                      <p>Enter your Personal Details</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/patient-family-details">
                    <div className="onboarding-progress">
                      <span>4</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Select Members</h6>
                      <p>Enter Details for Register</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/patient-dependant-details">
                    <div className="onboarding-progress">
                      <span>5</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Dependant details</h6>
                      <p>Dependants Profile</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/patient-other-details">
                    <div className="onboarding-progress">
                      <span>6</span>
                    </div>
                    <div className="onboarding-list">
                      <h6>Other Detail</h6>
                      <p>More information</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-8 col-md-12">
            <div className="onboarding-content-box">
              <div className="onboarding-title profile-title">
                <h2>Upload Profile Picture</h2>
                <h6>Add a profile photo</h6>
              </div>
              <div className="onboarding-content passcode-wrap mail-box">
                <div className="onboarding-contents">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="mb-3 onboarding-contents">
                        <div className="upload-pic patient-photo-upload">
                          <img src="/assets/img/icons/up-cam.png" alt="img" id="blah" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="upload-patient-pic">
                        <div className="upload-patient-btn">
                          <a className="pic-upload-btn"><i className="fas fa-upload me-2"></i>Upload images</a>
                          <input type="file" id="imgInp" />
                        </div>
                        <div>
                          <a className="pic-upload-btn"><i className="fas fa-camera me-2"></i>Take a photo</a>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="uploads-report">
                        <a href="javascript:;" className="text-success"><i className="fas fa-check-double me-2"></i>Uploaded Successfully</a>
                        <a href="javascript:;" className="text-danger"><i className="far fa-times-circle me-2"></i>Upload Failed</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="onboarding-btn Personalize-btn">
                  <Link to="/patient-details">Continue</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default PatientPersonalize

