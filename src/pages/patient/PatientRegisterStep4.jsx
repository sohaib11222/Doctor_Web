import { Link } from 'react-router-dom'

const PatientRegisterStep4 = () => {
  const currentYear = new Date().getFullYear()

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
                      <li><a href="javascript:;" className="active-done">3</a></li>
                      <li><a href="javascript:;" className="active">4</a></li>
                      <li><a href="javascript:;">5</a></li>
                    </ul>
                  </div>
                  <form method="post" id="famil_age">
                    <div className="text-start mt-2">
                      <p>Add age of the each members</p>
                      <h4 className="mt-3">Age</h4>
                    </div>
                    <div className="step-process-col mt-4">
                      <div className="mb-3">
                        <label className="mb-2">Child_1 Age</label>
                        <input type="text" className="form-control" id="Child_1_age" name="Child_1_age" />
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Child_1 Image</label>
                        <input type="file" className="form-control" id="Child_1_image" name="Child_1_image" />
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Spouse Age</label>
                        <input type="text" className="form-control" id="spouse_age" name="spouse_age" />
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Spouse Image</label>
                        <input type="file" className="form-control" id="spouse_file" name="spouse_file" />
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Father</label>
                        <input type="text" className="form-control" id="father_age" name="father_age" />
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Father Image</label>
                        <input type="file" className="form-control" id="father_file" name="father_file" />
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Mother</label>
                        <input type="text" className="form-control" id="mother_age" name="mother_age" />
                      </div>
                      <div className="mb-3">
                        <label className="mb-2">Mother Image</label>
                        <input type="file" className="form-control" id="mother_file" name="mother_file" />
                      </div>
                    </div>
                    <div className="mt-5">
                      <Link to="/patient-register-step5" className="btn btn-primary w-100 btn-lg login-btn step4_submit">Continue</Link>
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

export default PatientRegisterStep4

