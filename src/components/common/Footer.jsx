import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  const path = location.pathname

  // Default footer for most pages
  const DefaultFooter = () => (
    <footer className="footer inner-footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-lg-3 col-md-3">
                  <div className="footer-widget footer-menu">
                    <h6 className="footer-title">Company</h6>
                    <ul>
                      <li><Link to="/about-us">About</Link></li>
                      <li><Link to="/search">Features</Link></li>
                      <li><a href="javascript:void(0);">Works</a></li>
                      <li><a href="javascript:void(0);">Careers</a></li>
                      <li><a href="javascript:void(0);">Locations</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3">
                  <div className="footer-widget footer-menu">
                    <h6 className="footer-title">Treatments</h6>
                    <ul>
                      <li><Link to="/search">Dental</Link></li>
                      <li><Link to="/search">Cardiac</Link></li>
                      <li><Link to="/search">Spinal Cord</Link></li>
                      <li><Link to="/search">Hair Growth</Link></li>
                      <li><Link to="/search">Anemia & Disorder</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3">
                  <div className="footer-widget footer-menu">
                    <h6 className="footer-title">Specialities</h6>
                    <ul>
                      <li><Link to="/search">Transplant</Link></li>
                      <li><Link to="/search">Cardiologist</Link></li>
                      <li><Link to="/search">Oncology</Link></li>
                      <li><Link to="/search">Pediatrics</Link></li>
                      <li><Link to="/search">Gynacology</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3">
                  <div className="footer-widget footer-menu">
                    <h6 className="footer-title">Utilites</h6>
                    <ul>
                      <li><Link to="/pricing">Pricing</Link></li>
                      <li><Link to="/contact-us">Contact</Link></li>
                      <li><Link to="/contact-us">Request A Quote</Link></li>
                      <li><a href="javascript:void(0);">Premium Membership</a></li>
                      <li><a href="javascript:void(0);">Integrations</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-7">
              <div className="footer-widget">
                <h6 className="footer-title">Newsletter</h6>
                <p className="mb-2">Subscribe & Stay Updated from the Doccure</p>
                <div className="subscribe-input">
                  <form action="#">
                    <input type="email" className="form-control" placeholder="Enter Email Address" />
                    <button type="submit" className="btn btn-md btn-primary-gradient inline-flex align-items-center">
                      <i className="isax isax-send-25 me-1"></i>Send
                    </button>
                  </form>
                </div>
                <div className="social-icon">
                  <h6 className="mb-3">Connect With Us</h6>
                  <ul>
                    <li><a href="javascript:void(0);"><i className="fa-brands fa-facebook"></i></a></li>
                    <li><a href="javascript:void(0);"><i className="fa-brands fa-x-twitter"></i></a></li>
                    <li><a href="javascript:void(0);"><i className="fa-brands fa-instagram"></i></a></li>
                    <li><a href="javascript:void(0);"><i className="fa-brands fa-linkedin"></i></a></li>
                    <li><a href="javascript:void(0);"><i className="fa-brands fa-pinterest"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bg">
          <img src="/assets/img/bg/footer-bg-01.png" alt="img" className="footer-bg-01" />
          <img src="/assets/img/bg/footer-bg-02.png" alt="img" className="footer-bg-02" />
          <img src="/assets/img/bg/footer-bg-03.png" alt="img" className="footer-bg-03" />
          <img src="/assets/img/bg/footer-bg-04.png" alt="img" className="footer-bg-04" />
          <img src="/assets/img/bg/footer-bg-05.png" alt="img" className="footer-bg-05" />
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="copyright">
            <div className="copyright-text">
              <p className="mb-0">Copyright © {new Date().getFullYear()} Doccure. All Rights Reserved</p>
            </div>
            <div className="copyright-menu">
              <ul className="policy-menu">
                <li><a href="javascript:void(0);">Legal Notice</a></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><a href="javascript:void(0);">Refund Policy</a></li>
              </ul>
            </div>
            <ul className="payment-method">
              <li><a href="javascript:void(0);"><img src="/assets/img/icons/card-01.svg" alt="Img" /></a></li>
              <li><a href="javascript:void(0);"><img src="/assets/img/icons/card-02.svg" alt="Img" /></a></li>
              <li><a href="javascript:void(0);"><img src="/assets/img/icons/card-03.svg" alt="Img" /></a></li>
              <li><a href="javascript:void(0);"><img src="/assets/img/icons/card-04.svg" alt="Img" /></a></li>
              <li><a href="javascript:void(0);"><img src="/assets/img/icons/card-05.svg" alt="Img" /></a></li>
              <li><a href="javascript:void(0);"><img src="/assets/img/icons/card-06.svg" alt="Img" /></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )

  // Footer for index-4
  if (path === '/index-4') {
    return (
      <footer className="footer footer-one">
        <div className="footer-top aos" data-aos="fade-up">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4">
                <div className="footer-widget footer-about">
                  <div className="footer-logo">
                    <Link to="/"><img src="/assets/img/logo.svg" alt="logo" /></Link>
                  </div>
                  <div className="footer-about-content">
                    <p>Effortlessly schedule your medical appointments with Doccure. Connect with healthcare professionals, manage appointments & prioritize your well being</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-3 col-md-4">
                    <div className="footer-widget footer-menu">
                      <h2 className="footer-title">Company</h2>
                      <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/search">Specialities</Link></li>
                        <li><Link to="/video-call">Video Consult</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4">
                    <div className="footer-widget footer-menu">
                      <h2 className="footer-title">Specialities</h2>
                      <ul>
                        <li><Link to="/search">Neurology</Link></li>
                        <li><Link to="/search">Cardiologist</Link></li>
                        <li><Link to="/search">Dentist</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-4">
                    <div className="footer-widget footer-contact">
                      <h2 className="footer-title">Contact Us</h2>
                      <div className="footer-contact-info">
                        <div className="footer-address">
                          <p><i className="isax isax-location"></i> 3556 Beech Street, USA</p>
                        </div>
                        <div className="footer-address">
                          <p><i className="feather-phone-call"></i> +1 315 369 5943</p>
                        </div>
                        <div className="footer-address mb-0">
                          <p><i className="feather-mail"></i> doccure@example.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-7">
                <div className="footer-widget">
                  <h2 className="footer-title">Join Our Newsletter</h2>
                  <div className="subscribe-form">
                    <form action="#">
                      <input type="email" className="form-control" placeholder="Enter Email" />
                      <button type="submit" className="btn">Submit</button>
                    </form>
                  </div>
                  <div className="social-icon">
                    <ul>
                      <li><a href="javascript:void(0);"><i className="fa-brands fa-facebook"></i></a></li>
                      <li><a href="javascript:void(0);"><i className="fa-brands fa-x-twitter"></i></a></li>
                      <li><a href="javascript:void(0);"><i className="fa-brands fa-instagram"></i></a></li>
                      <li><a href="javascript:void(0);"><i className="fa-brands fa-linkedin"></i></a></li>
                      <li><a href="javascript:void(0);"><i className="fa-brands fa-pinterest"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="copyright">
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <div className="copyright-text">
                    <p className="mb-0">Copyright © {new Date().getFullYear()} Doccure. All Rights Reserved</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6">
                  <div className="copyright-menu">
                    <ul className="policy-menu">
                      <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                      <li><Link to="/terms-condition">Terms and Conditions</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Return default footer for all other pages
  return <DefaultFooter />
}

export default Footer

