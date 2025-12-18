import { Link } from 'react-router-dom'

const Search2 = () => {
  const doctors = [
    { id: 1, name: 'Dr. Michael Brown', specialty: 'Psychologist', rating: 5.0, location: 'Minneapolis, MN', duration: '30 Min', fee: 650, available: true, image: '/assets/img/doctors/doctor-01.jpg' },
    { id: 2, name: 'Dr. Nicholas Tello', specialty: 'Pediatrician', rating: 4.6, location: 'Ogden, IA', duration: '60 Min', fee: 400, available: true, image: '/assets/img/doctors/doctor-02.jpg' },
    { id: 3, name: 'Dr. Harold Bryant', specialty: 'Neurologist', rating: 4.8, location: 'Winona, MS', duration: '30 Min', fee: 500, available: true, image: '/assets/img/doctors/doctor-03.jpg' },
    { id: 4, name: 'Dr. Sandra Jones', specialty: 'Cardiologist', rating: 4.8, location: 'Beckley, WV', duration: '30 Min', fee: 550, available: true, image: '/assets/img/doctors/doctor-04.jpg' },
    { id: 5, name: 'Dr. Charles Scott', specialty: 'Neurologist', rating: 4.2, location: 'Hamshire, TX', duration: '30 Min', fee: 600, available: true, image: '/assets/img/doctors/doctor-05.jpg' },
    { id: 6, name: 'Dr. Robert Thomas', specialty: 'Cardiologist', rating: 4.2, location: 'Oakland, CA', duration: '30 Min', fee: 450, available: true, image: '/assets/img/doctors/doctor-06.jpg' },
  ]

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-bar overflow-visible">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/"><i className="isax isax-home-15"></i></Link></li>
                  <li className="breadcrumb-item">Doctor</li>
                  <li className="breadcrumb-item active">Doctor List</li>
                </ol>
                <h2 className="breadcrumb-title">Doctor List</h2>
              </nav>
            </div>
          </div>
          <div className="bg-primary-gradient rounded-pill doctors-search-box">
            <div className="search-box-one rounded-pill">
              <form action="/search-2">
                <div className="search-input search-line">
                  <i className="isax isax-hospital5 bficon"></i>
                  <div className="mb-0">
                    <input type="text" className="form-control" placeholder="Search for Doctors, Hospitals, Clinics" />
                  </div>
                </div>
                <div className="search-input search-map-line">
                  <i className="isax isax-location5"></i>
                  <div className="mb-0">
                    <input type="text" className="form-control" placeholder="Location" />
                  </div>
                </div>
                <div className="search-input search-calendar-line">
                  <i className="isax isax-calendar-tick5"></i>
                  <div className="mb-0">
                    <input type="text" className="form-control datetimepicker" placeholder="Date" />
                  </div>
                </div>
                <div className="form-search-btn">
                  <button className="btn btn-primary d-inline-flex align-items-center rounded-pill" type="submit">
                    <i className="isax isax-search-normal-15 me-2"></i>Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="breadcrumb-bg">
          <img src="/assets/img/bg/breadcrumb-bg-01.png" alt="img" className="breadcrumb-bg-01" />
          <img src="/assets/img/bg/breadcrumb-bg-02.png" alt="img" className="breadcrumb-bg-02" />
          <img src="/assets/img/bg/breadcrumb-icon.png" alt="img" className="breadcrumb-bg-03" />
          <img src="/assets/img/bg/breadcrumb-icon.png" alt="img" className="breadcrumb-bg-04" />
        </div>
      </div>
      {/* /Breadcrumb */}

      {/* Page Content */}
      <div className="content mt-5">
        <div className="container">
          <div className="row">
            <div className="col-xl-3">
              <div className="card filter-lists">
                <div className="card-header">
                  <div className="d-flex align-items-center filter-head justify-content-between">
                    <h4>Filter</h4>
                    <a href="#" className="text-secondary text-decoration-underline">Clear All</a>
                  </div>
                  <div className="filter-input">
                    <div className="position-relative input-icon">
                      <input type="text" className="form-control" />
                      <span><i className="isax isax-search-normal-1"></i></span>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  {/* Filter accordions - simplified */}
                  <div className="accordion-item border-bottom">
                    <div className="accordion-header" id="heading1">
                      <div className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-controls="collapse1" role="button">
                        <div className="d-flex align-items-center w-100">
                          <h5>Specialities</h5>
                          <div className="ms-auto">
                            <span><i className="fas fa-chevron-down"></i></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="collapse1" className="accordion-collapse show" aria-labelledby="heading1">
                      <div className="accordion-body pt-3">
                        {['Urology', 'Psychiatry', 'Cardiology', 'Pediatrics', 'Neurology'].map((spec, idx) => (
                          <div key={idx} className="d-flex align-items-center justify-content-between mb-2">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id={`checkbox-sm${idx + 2}`} defaultChecked={idx === 0} />
                              <label className="form-check-label" htmlFor={`checkbox-sm${idx + 2}`}>{spec}</label>
                            </div>
                            <span className="filter-badge">21</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="mb-4">
                    <h3>Showing <span className="text-secondary">450</span> Doctors For You</h3>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center justify-content-end mb-4">
                    <div className="doctor-filter-availability me-2">
                      <p>Availability</p>
                      <div className="status-toggle status-tog">
                        <input type="checkbox" id="status_6" className="check" />
                        <label htmlFor="status_6" className="checktoggle">checkbox</label>
                      </div>
                    </div>
                    <div className="dropdown header-dropdown me-2">
                      <a className="dropdown-toggle sort-dropdown" data-bs-toggle="dropdown" href="javascript:void(0);" aria-expanded="false">
                        <span>Sort By</span>Price (Low to High)
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">Price (Low to High)</a>
                        <a href="javascript:void(0);" className="dropdown-item">Price (High to Low)</a>
                      </div>
                    </div>
                    <Link to="/doctor-grid" className="btn btn-sm head-icon me-2">
                      <i className="isax isax-grid-7"></i>
                    </Link>
                    <Link to="/search-2" className="btn btn-sm head-icon active me-2">
                      <i className="isax isax-row-vertical"></i>
                    </Link>
                    <Link to="/map-list" className="btn btn-sm head-icon">
                      <i className="isax isax-location"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="row">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="doctor-widget">
                          <div className="doc-info-left">
                            <div className="doctor-img">
                              <Link to="/doctor-profile">
                                <img src={doctor.image} className="img-fluid" alt={doctor.name} />
                              </Link>
                            </div>
                            <div className="doc-info-cont">
                              <h4 className="doc-name"><Link to="/doctor-profile">{doctor.name}</Link></h4>
                              <p className="doc-speciality">{doctor.specialty}</p>
                              <div className="rating">
                                <i className="fas fa-star filled"></i>
                                <i className="fas fa-star filled"></i>
                                <i className="fas fa-star filled"></i>
                                <i className="fas fa-star filled"></i>
                                <i className="fas fa-star"></i>
                                <span className="d-inline-block average-rating">35</span>
                              </div>
                              <div className="clinic-details">
                                <p className="doc-location"><i className="fas fa-map-marker-alt"></i> {doctor.location}</p>
                                <ul className="clinic-gallery">
                                  <li><a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#photos-modal"><img src="/assets/img/clinic/clinic-01.jpg" alt="Feature" /></a></li>
                                  <li><a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#photos-modal"><img src="/assets/img/clinic/clinic-02.jpg" alt="Feature" /></a></li>
                                  <li><a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#photos-modal"><img src="/assets/img/clinic/clinic-03.jpg" alt="Feature" /></a></li>
                                  <li><a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#photos-modal"><span>+2</span></a></li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="doc-info-right">
                            <div className="clini-infos">
                              <ul>
                                <li><i className="far fa-thumbs-up"></i> 98%</li>
                                <li><i className="far fa-comment"></i> 35 Feedback</li>
                                <li><i className="fas fa-map-marker-alt"></i> {doctor.location}</li>
                                <li><i className="far fa-clock"></i> Available on Fri, 22 Mar</li>
                              </ul>
                            </div>
                            <div className="clinic-booking">
                              <a className="view-pro-btn" href="/doctor-profile">View Profile</a>
                              <Link className="btn btn-primary" to="/booking">Book Appointment</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-md-12">
                  <div className="text-center mb-4">
                    <Link to="/login" className="btn btn-md btn-primary-gradient inline-flex align-items-center rounded-pill">
                      <i className="isax isax-d-cube-scan5 me-2"></i>
                      Load More 425 Doctors
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </>
  )
}

export default Search2

