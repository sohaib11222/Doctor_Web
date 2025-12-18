import { Link } from 'react-router-dom'
import { useState } from 'react'

const PatientRegisterStep3 = () => {
  const currentYear = new Date().getFullYear()
  const [childCount, setChildCount] = useState(0)

  const incrementChild = () => {
    setChildCount(childCount + 1)
  }

  const decrementChild = () => {
    if (childCount > 0) {
      setChildCount(childCount - 1)
    }
  }

  return (
    <div className="content login-page pt-0">
      <div className="container-fluid">
        {/* Register Content */}
        <div className="account-content">
          <div className="d-flex align-items-center">
            <div className="login-right">
              <div className="inner-right-login">
                <div className="login-header">
                  <div className="logo-icon">
                    <img src="/assets/img/logo.png" alt="doccure-logo" />
                  </div>
                  <div className="step-list">
                    <ul>
                      <li><a href="javascript:;" className="active-done">1</a></li>
                      <li><a href="javascript:;" className="active-done">2</a></li>
                      <li><a href="javascript:;" className="active">3</a></li>
                      <li><a href="javascript:;">4</a></li>
                      <li><a href="javascript:;">5</a></li>
                    </ul>
                  </div>
                  <form method="post">
                    <div className="text-start mt-2">
                      <p>Who all you want to cover in health insurance</p>
                      <h4 className="mt-3">Select Members</h4>
                    </div>
                    <div className="checklist-col pregnant-col">
                      <div className="remember-me-col d-flex justify-content-between">
                        <span className="mt-1">Self</span>
                        <label className="custom_check mb-3">
                          <input type="checkbox" className="" name="self" id="self" value="1" defaultChecked />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="remember-me-col d-flex justify-content-between">
                        <span className="mt-1">Spouse</span>
                        <label className="custom_check mb-3">
                          <input type="checkbox" className="" name="spouse" id="spouse" value="1" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="remember-me-col d-flex justify-content-between">
                        <span className="mt-1">Child</span>
                        <div className="increment-decrement mt-3">
                          <div className="input-groups">
                            <input type="button" value="-" id="subs" className="button-minus dec button" onClick={decrementChild} />
                            <input type="text" name="child" id="child" value={childCount} className="quantity-field" readOnly />
                            <input type="button" value="+" id="adds" className="button-plus inc button" onClick={incrementChild} />
                          </div>
                        </div>
                      </div>
                      <div className="remember-me-col d-flex justify-content-between">
                        <span className="mt-1">Mother</span>
                        <label className="custom_check mb-3">
                          <input type="checkbox" className="" name="mother" id="mother" value="1" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="remember-me-col d-flex justify-content-between">
                        <span className="mt-1">Father</span>
                        <label className="custom_check mb-3">
                          <input type="checkbox" className="" name="father" id="father" value="1" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </div>
                    <div className="mt-5">
                      <Link to="/patient-register-step4" className="btn btn-primary w-100 btn-lg login-btn step3_submit">Continue</Link>
                    </div>
                  </form>
                </div>
              </div>
              <div className="login-bottom-copyright">
                <span>© {currentYear} Doccure. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
        {/* /Register Content */}
      </div>
    </div>
  )
}

export default PatientRegisterStep3

