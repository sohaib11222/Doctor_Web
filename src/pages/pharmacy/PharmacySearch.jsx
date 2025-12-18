import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb'

const PharmacySearch = () => {
  const pharmacies = [
    {
      id: 1,
      name: 'Medlife Medical',
      rating: 4.0,
      reviews: 17,
      phone: '320-795-8815',
      location: '96 Red Hawk Road Cyrus, MN 56323',
      category: 'Chemists, Surgical Equipment Dealer',
      hours: 'Opens at 08.00 AM',
      image: '/assets/img/medical-img1.jpg',
      open24hrs: true,
      homeDelivery: true,
    },
    {
      id: 2,
      name: 'Apollo Pharmacy',
      rating: 4.5,
      reviews: 25,
      phone: '320-795-8816',
      location: '123 Main Street, MN 56324',
      category: 'Pharmacy, Health Supplements',
      hours: 'Opens at 09.00 AM',
      image: '/assets/img/medical-img2.jpg',
      open24hrs: false,
      homeDelivery: true,
    },
  ]

  return (
    <>
      <Breadcrumb title="Pharmacy" li1="Pharmacy Search" li2="Pharmacy Search" />
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-4 col-xl-3 theiaStickySidebar">
              <div className="card search-filter">
                <div className="card-header">
                  <h4 className="card-title mb-0">Search Filter</h4>
                </div>
                <div className="card-body">
                  <div className="filter-widget">
                    <label className="mb-2">Location</label>
                    <input type="text" className="form-control" placeholder="Select Location" />
                  </div>
                  <div className="filter-widget">
                    <h4>Categories</h4>
                    {['Popular', 'Latest', 'Ratings', 'Availability', 'Open 24 Hrs', 'Home Delivery'].map((category, idx) => (
                      <div key={idx}>
                        <label className="custom_check">
                          <input type="checkbox" name="gender_type" defaultChecked={category === 'Open 24 Hrs'} />
                          <span className="checkmark"></span> {category}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="btn-search">
                    <button type="button" className="btn w-100">Search</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-8 col-xl-9">
              {pharmacies.map((pharmacy) => (
                <div key={pharmacy.id} className="card mb-3">
                  <div className="card-body">
                    <div className="doctor-widget">
                      <div className="doc-info-left">
                        <div className="doctor-img1">
                          <Link to="/pharmacy-details">
                            <img src={pharmacy.image} className="img-fluid" alt="User Image" />
                          </Link>
                        </div>
                        <div className="doc-info-cont">
                          <h4 className="doc-name mb-2"><Link to="/pharmacy-details">{pharmacy.name}</Link></h4>
                          <div className="rating mb-2">
                            <span className="badge badge-primary">{pharmacy.rating}</span>
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star ${i < Math.floor(pharmacy.rating) ? 'filled' : ''}`}
                              ></i>
                            ))}
                            <span className="d-inline-block average-rating">({pharmacy.reviews})</span>
                          </div>
                          <div className="clinic-details">
                            <p className="doc-location mb-2">
                              <i className="fas fa-phone-volume me-1"></i> {pharmacy.phone}
                            </p>
                            <p className="doc-location mb-2 text-ellipse">
                              <i className="fas fa-map-marker-alt me-1"></i> {pharmacy.location}
                            </p>
                            <p className="doc-location mb-2">
                              <i className="fas fa-chevron-right me-1"></i> {pharmacy.category}
                            </p>
                            <p className="doc-location mb-2">
                              <i className="fas fa-chevron-right me-1"></i> {pharmacy.hours}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="doc-info-right">
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PharmacySearch

