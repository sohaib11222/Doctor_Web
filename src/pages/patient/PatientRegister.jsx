import { Link } from 'react-router-dom'

const PatientRegister = () => {
  return (
    <div className="login-content-info">
      <div className="container">
        {/* Patient Register */}
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6">
            <div className="account-content">
              <div className="account-info">
                <div className="login-title">
                  <h3>Patient Registration</h3>
                  <p className="mb-0">Create your account to get started</p>
                </div>
                <form action="/patient-register-step1">
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input className="form-control form-control-lg group_formcontrol form-control-phone" id="phone" name="phone" type="text" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" required />
                  </div>
                  <div className="mb-3 form-check-box terms-check-box">
                    <div className="form-group-flex">
                      <div className="form-check mb-0">
                        <input className="form-check-input" type="checkbox" id="terms" required />
                        <label className="form-check-label" htmlFor="terms">
                          I have read and agree to Doccure's <Link to="/terms-condition">Terms of Service</Link> and <Link to="/privacy-policy">Privacy Policy.</Link>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <button className="btn btn-primary-gradient btn-xl w-100" type="submit">Register Now</button>
                  </div>
                  <div className="login-or">
                    <span className="or-line"></span>
                    <span className="span-or">or</span>
                  </div>
                  <div className="social-login-btn">
                    <a href="javascript:void(0);" className="btn w-100">
                      <img src="/assets/img/icons/google-icon.svg" alt="google-icon" />Sign in With Google
                    </a>
                    <a href="javascript:void(0);" className="btn w-100">
                      <img src="/assets/img/icons/facebook-icon.svg" alt="fb-icon" />Sign in With Facebook
                    </a>
                  </div>
                  <div className="account-signup">
                    <p>Already have account? <Link to="/login">Sign In</Link></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Patient Register */}
      </div>
    </div>
  )
}

export default PatientRegister

