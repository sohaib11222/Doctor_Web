import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'

const PharmacyDetails = () => {
  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Pharmacy Details" li2="Pharmacy Details" />
      <div className="content">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="doctor-widget">
                <div className="doc-info-left">
                  <div className="doctor-img1">
                    <Link to="/pharmacy-details">
                      <img src="/assets/img/medical-img1.jpg" className="img-fluid" alt="User Image" />
                    </Link>
                  </div>
                  <div className="doc-info-cont">
                    <h4 className="doc-name mb-2"><Link to="/pharmacy-details">Medlife Medical</Link></h4>
                    <div className="rating mb-2">
                      <span className="badge badge-primary">4.0</span>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star"></i>
                      <span className="d-inline-block average-rating">(17)</span>
                    </div>
                    <div className="clinic-details">
                      <div className="clini-infos pt-3">
                        <p className="doc-location mb-2">
                          <i className="fas fa-phone-volume me-1"></i> 320-795-8815
                        </p>
                        <p className="doc-location mb-2 text-ellipse">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          96 Red Hawk Road Cyrus, MN 56323
                        </p>
                        <p className="doc-location mb-2">
                          <i className="fas fa-chevron-right me-1"></i> Chemists, Surgical Equipment Dealer
                        </p>
                        <p className="doc-location mb-2">
                          <i className="fas fa-chevron-right me-1"></i> Opens at 08.00 AM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="doc-info-right d-flex align-items-center justify-content-center">
                  <div className="clinic-booking">
                    <Link className="view-pro-btn" to="/chat">Send Message</Link>
                    <a className="apt-btn" href="javascript:;" data-bs-toggle="modal" data-bs-target="#voice_call">
                      Call Now
                    </a>
                    <Link to="/product-all" className="view-pro-btn">Browse Products</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body pt-0">
              <nav className="user-tabs mb-4">
                <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
                  <li className="nav-item">
                    <a className="nav-link active" href="#doc_overview" data-bs-toggle="tab">Overview</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#doc_locations" data-bs-toggle="tab">Locations</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#doc_reviews" data-bs-toggle="tab">Reviews</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#doc_business_hours" data-bs-toggle="tab">Business Hours</a>
                  </li>
                </ul>
              </nav>

              <div className="tab-content pt-0">
                <div role="tabpanel" id="doc_overview" className="tab-pane fade show active">
                  <div className="row">
                    <div className="col-md-9">
                      <div className="widget about-widget">
                        <h4 className="widget-title">About Pharmacy</h4>
                        <p>
                          Medlife Medical is a leading pharmacy providing quality healthcare products and services.
                          We offer a wide range of medicines, medical equipment, and health supplements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div role="tabpanel" id="doc_locations" className="tab-pane fade">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="widget locations-widget">
                        <h4 className="widget-title">Locations</h4>
                        <p>96 Red Hawk Road Cyrus, MN 56323</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div role="tabpanel" id="doc_reviews" className="tab-pane fade">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="widget reviews-widget">
                        <h4 className="widget-title">Reviews</h4>
                        <p>Customer reviews and ratings will be displayed here.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div role="tabpanel" id="doc_business_hours" className="tab-pane fade">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="widget business-hours-widget">
                        <h4 className="widget-title">Business Hours</h4>
                        <p>Opens at 08.00 AM</p>
                      </div>
                    </div>
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

export default PharmacyDetails

