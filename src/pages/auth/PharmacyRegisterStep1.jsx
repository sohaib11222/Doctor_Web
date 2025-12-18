import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'

const PharmacyRegisterStep1 = () => {
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
                          <a href="javascript:;" className="active">
                            1
                          </a>
                        </li>
                        <li>
                          <a href="javascript:;">2</a>
                        </li>
                        <li>
                          <a href="javascript:;">3</a>
                        </li>
                      </ul>
                    </div>
                    <form id="profile_pic_form" encType="multipart/form-data">
                      <div className="profile-pic-col">
                        <h3>Profile Picture</h3>
                        <div className="profile-pic-upload">
                          <div className="cam-col">
                            <img src="/assets/img/icons/camera.svg" id="prof-avatar" alt="camera-image" className="img-fluid" />
                          </div>
                          <span>Upload Profile Picture</span>
                          <input type="file" id="profile_image" name="profile_image" />
                        </div>
                      </div>
                      <div className="mt-5">
                        <Link to="/pharmacy-register-step2" className="btn btn-primary w-100 btn-lg login-btn step1_submit">
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

export default PharmacyRegisterStep1

