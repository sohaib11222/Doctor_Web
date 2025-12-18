import { Link } from 'react-router-dom'

const Favourites = () => {
  const favourites = [
    { name: 'Dr.Edalin Hendry', img: '/assets/img/doctors/doctor-thumb-21.jpg', speciality: 'MD - Cardiology', rating: 5.0, reviews: '', nextAvail: '23 Mar 2024', location: 'Newyork, USA', lastBook: '21 Jan 2023' },
    { name: 'Dr.Shanta Nesmith', img: '/assets/img/doctors/doctor-thumb-13.jpg', speciality: 'DO - Oncology', rating: 4.0, reviews: '(35)', nextAvail: '27 Mar 2024', location: 'Los Angeles, USA', lastBook: '18 Jan 2023' },
    { name: 'Dr.John Ewel', img: '/assets/img/doctors/doctor-thumb-14.jpg', speciality: 'MD - Orthopedics', rating: 5.0, reviews: '', nextAvail: '02 Apr 2024', location: 'Dallas, USA', lastBook: '28 Jan 2023' },
    { name: 'Dr.Susan Fenimore', img: '/assets/img/doctors/doctor-thumb-15.jpg', speciality: 'DO - Dermatology', rating: 4.0, reviews: '', nextAvail: '11 Apr 2024', location: 'Chicago, USA', lastBook: '08 Feb 2023' },
    { name: 'Dr.Juliet Rios', img: '/assets/img/doctors/doctor-thumb-16.jpg', speciality: 'MD - Neurology', rating: 5.0, reviews: '', nextAvail: '18 Apr 2024', location: 'Detroit, USA', lastBook: '16 Feb 2023' },
    { name: 'Dr.Joseph Engels', img: '/assets/img/doctors/doctor-thumb-17.jpg', speciality: 'MD - Pediatrics', rating: 4.0, reviews: '', nextAvail: '10 May 2024', location: 'Las Vegas, USA', lastBook: '08 Mar 2023' },
    { name: 'Dr.Victoria Selzer', img: '/assets/img/doctors/doctor-thumb-18.jpg', speciality: 'DO - Anesthesiology', rating: 5.0, reviews: '', nextAvail: '20 May 2024', location: 'Denver, USA', lastBook: '18 Mar 2023' },
    { name: 'Dr.Benjamin Hedge', img: '/assets/img/doctors/doctor-thumb-19.jpg', speciality: 'DO - Endocrinology', rating: 4.0, reviews: '', nextAvail: '24 May 2024', location: 'Miami, USA', lastBook: '21 Mar 2023' },
    { name: 'Dr.Kristina Lepley', img: '/assets/img/doctors/doctor-thumb-20.jpg', speciality: 'MD - Urology', rating: 5.0, reviews: '', nextAvail: '13 Jun 2024', location: 'San Jose, USA', lastBook: '10 Apr 2023' }
  ]

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className={i <= rating ? 'fas fa-star filled' : 'fas fa-star'}></i>
      )
    }
    return stars
  }

  return (
    <div className="content doctor-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* PatientSidebar will be rendered by DashboardLayout */}
          </div>
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Favourites</h3>
              <ul className="header-list-btns">
                <li>
                  <div className="input-block dash-search-input">
                    <input type="text" className="form-control" placeholder="Search" />
                    <span className="search-icon"><i className="isax isax-search-normal"></i></span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Favourites */}
            <div className="row">
              {favourites.map((fav, index) => (
                <div key={index} className="col-md-6 col-lg-4 d-flex">
                  <div className="profile-widget patient-favour flex-fill">
                    <div className="fav-head">
                      <a href="javascript:void(0)" className="fav-btn favourite-btn">
                        <span className="favourite-icon favourite"><i className="isax isax-heart5"></i></span>
                      </a>
                      <div className="doc-img">
                        <Link to="/doctor-profile">
                          <img className="img-fluid" alt="User Image" src={fav.img} />
                        </Link>
                      </div>
                      <div className="pro-content">
                        <h3 className="title">
                          <Link to="/doctor-profile">{fav.name}</Link>
                          <i className="isax isax-tick-circle5 verified"></i>
                        </h3>
                        <p className="speciality">{fav.speciality}</p>
                        <div className="rating">
                          {renderStars(fav.rating)}
                          <span className="d-inline-block average-rating">{fav.rating}{fav.reviews}</span>
                        </div>
                        <ul className="available-info">
                          <li>
                            <i className="isax isax-calendar5 me-1"></i><span>Next Availability :</span> {fav.nextAvail}
                          </li>
                          <li>
                            <i className="isax isax-location5 me-1"></i><span>Location :</span> {fav.location}
                          </li>
                        </ul>
                        <div className="last-book">
                          <p>Last Book on {fav.lastBook}</p>
                        </div>
                      </div>
                    </div>
                    <div className="fav-footer">
                      <div className="row row-sm">
                        <div className="col-6">
                          <Link to="/doctor-profile" className="btn btn-md btn-light w-100">View {index === 0 ? 'Details' : 'Profile'}</Link>
                        </div>
                        <div className="col-6">
                          <Link to="/booking" className="btn btn-md btn-outline-primary w-100">Book Now</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* /Favourites */}

            <div className="col-md-12">
              <div className="loader-item text-center mt-0">
                <a href="javascript:void(0);" className="btn btn-outline-primary rounded-pill">Load More</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Favourites

