import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'

const PharmacyRegisterStep2 = () => {
  return (
    <AuthLayout>
      <div className="content login-page pt-0">
        <div className="container-fluid">
          <div className="account-content">
            <div className="d-flex align-items-center justify-content-center">
              <div className="login-right">
                <div className="inner-right-login">
                  <div className="login-header">
                    <div className="logo-icon">
                      <img src="/assets/img/logo.png" alt="doccure-logo" />
                    </div>
                    <div className="step-list">
                      <ul>
                        <li>
                          <a href="javascript:;" className="active-done">
                            1
                          </a>
                        </li>
                        <li>
                          <a href="javascript:;" className="active">
                            2
                          </a>
                        </li>
                        <li>
                          <a href="javascript:;">3</a>
                        </li>
                      </ul>
                    </div>
                    <form method="post">
                      <h3 className="my-4">Your Location</h3>
                      <div className="mb-3">
                        <label className="mb-2">Select City</label>
                        <select className="form-select form-control select" id="heart_rate" name="heart_rate">
                          <option value="">Select Your City</option>
                          <option value="1">City 1</option>
                          <option value="2">City 2</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Select State</label>
                        <select className="form-select form-control select" id="bp" name="bp">
                          <option value="">Select Your State</option>
                          <option value="1">State 1</option>
                          <option value="2">State 2</option>
                        </select>
                      </div>
                      <div className="mt-5">
                        <Link to="/pharmacy-register-step3" className="btn btn-primary w-100 btn-lg login-btn step5_submit">
                          Continue
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="login-bottom-copyright">
                  <span>© {new Date().getFullYear()} Doccure. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default PharmacyRegisterStep2

