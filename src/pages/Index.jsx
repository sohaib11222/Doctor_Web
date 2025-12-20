import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Index = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize AOS animations
    if (typeof window !== 'undefined') {
      import('aos').then((AOS) => {
        AOS.init({
          duration: 1000,
          once: true,
        })
      })
    }

    // Initialize Owl Carousel
    if (typeof window !== 'undefined' && window.$) {
      // Speciality Slider
      $('.spciality-slider').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        responsive: {
          0: { items: 1 },
          600: { items: 3 },
          1000: { items: 5 }
        }
      })

      // Doctors Slider
      $('.doctors-slider').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          1000: { items: 4 }
        }
      })

      // Testimonials Slider
      $('.testimonials-slider').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          1000: { items: 3 }
        }
      })

      // Company Slider
      $('.company-slider').owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive: {
          0: { items: 2 },
          600: { items: 4 },
          1000: { items: 6 }
        }
      })
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/search-2')
  }

  const specialities = [
    { id: 1, name: 'Cardiology', doctors: 254, image: 'speciality-01.jpg', icon: 'speciality-icon-01.svg' },
    { id: 2, name: 'Orthopedics', doctors: 151, image: 'speciality-02.jpg', icon: 'speciality-icon-02.svg' },
    { id: 3, name: 'Neurology', doctors: 176, image: 'speciality-03.jpg', icon: 'speciality-icon-03.svg' },
    { id: 4, name: 'Pediatrics', doctors: 124, image: 'speciality-04.jpg', icon: 'speciality-icon-04.svg' },
    { id: 5, name: 'Psychiatry', doctors: 112, image: 'speciality-05.jpg', icon: 'speciality-icon-05.svg' },
    { id: 6, name: 'Endocrinology', doctors: 104, image: 'speciality-06.jpg', icon: 'speciality-icon-06.svg' },
    { id: 7, name: 'Pulmonology', doctors: 41, image: 'speciality-07.jpg', icon: 'speciality-icon-07.svg' },
    { id: 8, name: 'Urology', doctors: 39, image: 'speciality-08.jpg', icon: 'speciality-icon-08.svg' },
  ]

  const doctors = [
    { id: 1, name: 'Dr. Michael Brown', specialty: 'Psychologist', location: 'Minneapolis, MN', time: '30 Min', fee: '$650', rating: 5.0, image: 'doctor-grid-01.jpg', available: true },
    { id: 2, name: 'Dr. Nicholas Tello', specialty: 'Pediatrician', location: 'Ogden, IA', time: '60 Min', fee: '$400', rating: 4.6, image: 'doctor-grid-02.jpg', available: true },
    { id: 3, name: 'Dr. Harold Bryant', specialty: 'Neurologist', location: 'Winona, MS', time: '30 Min', fee: '$500', rating: 4.8, image: 'doctor-grid-03.jpg', available: true },
    { id: 4, name: 'Dr. Sandra Jones', specialty: 'Cardiologist', location: 'Beckley, WV', time: '30 Min', fee: '$550', rating: 4.8, image: 'doctor-grid-04.jpg', available: true },
    { id: 5, name: 'Dr. Charles Scott', specialty: 'Neurologist', location: 'Hamshire, TX', time: '30 Min', fee: '$600', rating: 4.2, image: 'doctor-grid-05.jpg', available: true },
  ]

  const testimonials = [
    { id: 1, name: 'Deny Hendrawan', location: 'United States', image: 'patient22.jpg', title: 'Nice Treatment', text: 'I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.' },
    { id: 2, name: 'Johnson DWayne', location: 'United States', image: 'patient21.jpg', title: 'Good Hospitability', text: 'Genuinely cares about his patients. He helped me understand my condition and worked with me to create a plan.' },
    { id: 3, name: 'Rayan Smith', location: 'United States', image: 'patient.jpg', title: 'Nice Treatment', text: 'I had a great experience with Dr. Chen. She was not only professional but also made me feel comfortable discussing.' },
    { id: 4, name: 'Sofia Doe', location: 'United States', image: 'patient23.jpg', title: 'Excellent Service', text: 'I had a wonderful experience the staff was friendly and attentive, and Dr. Smith took the time to explain everything clearly.' },
  ]

  const companies = [
    'company-01.svg', 'company-02.svg', 'company-03.svg', 'company-04.svg',
    'company-05.svg', 'company-06.svg', 'company-07.svg', 'company-08.svg'
  ]

  return (
    <>
      {/* Home Banner */}
      <section className="banner-section banner-sec-one">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="banner-content aos" data-aos="fade-up">
                <div className="rating-appointment d-inline-flex align-items-center gap-2">
                  <div className="avatar-list-stacked avatar-group-lg">
                    <span className="avatar avatar-rounded">
                      <img className="border border-white" src="/assets/img/doctors/doctor-thumb-22.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img className="border border-white" src="/assets/img/doctors/doctor-thumb-23.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img src="/assets/img/doctors/doctor-thumb-24.jpg" alt="img" />
                    </span>
                  </div>
                  <div className="me-2">
                    <h6>5K+ Appointments</h6>
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                        <i className="fa-solid fa-star text-orange me-1"></i>
                      </div>
                      <p>5.0 Ratings</p>
                    </div>
                  </div>
                </div>
                <h1 className="display-5">
                  Discover Health: Find Your Trusted{' '}
                  <span className="banner-icon">
                    <img src="/assets/img/icons/video.svg" alt="img" />
                  </span>{' '}
                  <span className="text-gradient">Doctors</span> Today
                </h1>
                <div className="search-box-one aos" data-aos="fade-up">
                  <form onSubmit={handleSearch}>
                    <div className="search-input search-line">
                      <i className="isax isax-hospital5 bficon"></i>
                      <div className="mb-0">
                        <input type="text" className="form-control" placeholder="Search doctors, clinics, hospitals, etc" />
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
                      <button className="btn btn-primary" type="submit">
                        <i className="isax isax-search-normal5 me-2"></i>Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="banner-img aos" data-aos="fade-up">
                <img src="/assets/img/banner/banner-doctor.svg" className="img-fluid" alt="patient-image" />
                <div className="banner-appointment">
                  <h6>1K</h6>
                  <p>Appointments <span className="d-block">Completed</span></p>
                </div>
                <div className="banner-patient">
                  <div className="avatar-list-stacked avatar-group-sm">
                    <span className="avatar avatar-rounded">
                      <img src="/assets/img/patients/patient19.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img src="/assets/img/patients/patient16.jpg" alt="img" />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img src="/assets/img/patients/patient18.jpg" alt="img" />
                    </span>
                  </div>
                  <p>15K+</p>
                  <p>Satisfied Patients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="banner-bg">
          <img src="/assets/img/bg/banner-bg-02.png" alt="img" className="banner-bg-01" />
          <img src="/assets/img/bg/banner-bg-03.png" alt="img" className="banner-bg-02" />
          <img src="/assets/img/bg/banner-bg-04.png" alt="img" className="banner-bg-03" />
          <img src="/assets/img/bg/banner-bg-05.png" alt="img" className="banner-bg-04" />
          <img src="/assets/img/bg/banner-icon-01.svg" alt="img" className="banner-bg-05" />
          <img src="/assets/img/bg/banner-icon-01.svg" alt="img" className="banner-bg-06" />
        </div>
      </section>
      {/* /Home Banner */}

      {/* List */}
      <div className="list-section">
        <div className="container">
          <div className="list-card card mb-0">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center justify-content-xl-between flex-wrap gap-4 list-wraps">
                <Link to="/booking" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-secondary">
                    <img src="/assets/img/icons/list-icon-01.svg" alt="img" />
                  </div>
                  <h6>Book Appointment</h6>
                </Link>
                <Link to="/doctor-grid" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-primary">
                    <img src="/assets/img/icons/list-icon-02.svg" alt="img" />
                  </div>
                  <h6>Talk to Doctors</h6>
                </Link>
                <Link to="/hospitals" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-pink">
                    <img src="/assets/img/icons/list-icon-03.svg" alt="img" />
                  </div>
                  <h6>Hospitals & Clinics</h6>
                </Link>
                <Link to="/index-3" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-cyan">
                    <img src="/assets/img/icons/list-icon-04.svg" alt="img" />
                  </div>
                  <h6>Healthcare</h6>
                </Link>
                <Link to="/index-13" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-purple">
                    <img src="/assets/img/icons/list-icon-05.svg" alt="img" />
                  </div>
                  <h6>Medicine & Supplies</h6>
                </Link>
                <Link to="/index-12" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-orange">
                    <img src="/assets/img/icons/list-icon-06.svg" alt="img" />
                  </div>
                  <h6>Lab Testing</h6>
                </Link>
                <Link to="/index-13" className="list-item aos" data-aos="fade-up">
                  <div className="list-icon bg-teal">
                    <img src="/assets/img/icons/list-icon-07.svg" alt="img" />
                  </div>
                  <h6>Home Care</h6>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /List */}

      {/* Speciality Section */}
      <section className="speciality-section">
        <div className="container">
          <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
            <span className="badge badge-primary">Top Specialties</span>
            <h2>Highlighting the Care & Support</h2>
          </div>
          <div className="owl-carousel spciality-slider aos" data-aos="fade-up">
            {specialities.map((speciality) => (
              <div key={speciality.id} className="spaciality-item">
                <div className="spaciality-img">
                  <img src={`/assets/img/specialities/${speciality.image}`} alt="img" />
                  <span className="spaciality-icon">
                    <img src={`/assets/img/specialities/${speciality.icon}`} alt="img" />
                  </span>
                </div>
                <h6>
                  <Link to="/doctor-grid">{speciality.name}</Link>
                </h6>
                <p className="mb-0">{speciality.doctors} Doctors</p>
              </div>
            ))}
          </div>
          <div className="spciality-nav nav-bottom owl-nav"></div>
        </div>
      </section>
      {/* /Speciality Section */}

      {/* Doctor Section */}
      <section className="doctor-section">
        <div className="container">
          <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
            <span className="badge badge-primary">Featured Doctors</span>
            <h2>Our Highlighted Doctors</h2>
          </div>
          <div className="doctors-slider owl-carousel aos" data-aos="fade-up">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="card">
                <div className="card-img card-img-hover">
                  <Link to="/doctor-profile">
                    <img src={`/assets/img/doctor-grid/${doctor.image}`} alt={doctor.name} />
                  </Link>
                  <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                    <span className="badge bg-orange">
                      <i className="fa-solid fa-star me-1"></i>{doctor.rating}
                    </span>
                    <a href="javascript:void(0)" className="fav-icon">
                      <i className="fa fa-heart"></i>
                    </a>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className={`d-flex active-bar align-items-center justify-content-between p-3`}>
                    <a href="#" className="text-indigo fw-medium fs-14">{doctor.specialty}</a>
                    <span className="badge bg-success-light d-inline-flex align-items-center">
                      <i className="fa-solid fa-circle fs-5 me-1"></i>
                      Available
                    </span>
                  </div>
                  <div className="p-3 pt-0">
                    <div className="doctor-info-detail mb-3 pb-3">
                      <h3 className="mb-1">
                        <Link to="/doctor-profile">{doctor.name}</Link>
                      </h3>
                      <div className="d-flex align-items-center">
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-location me-2"></i>{doctor.location}
                        </p>
                        <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1"></i>
                        <span className="fs-14 fw-medium">{doctor.time}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="mb-1">Consultation Fees</p>
                        <h3 className="text-orange">{doctor.fee}</h3>
                      </div>
                      <Link to="/booking" className="btn btn-md btn-dark inline-flex align-items-center rounded-pill">
                        <i className="isax isax-calendar-1 me-2"></i>
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="doctor-nav nav-bottom owl-nav"></div>
        </div>
      </section>
      {/* /Doctor Section */}

      {/* Services Section */}
      <section className="services-section aos" data-aos="fade-up">
        <div className="horizontal-slide d-flex" data-direction="right" data-speed="slow">
          <div className="slide-list d-flex gap-4">
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Multi Speciality Treatments & Doctors</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Lab Testing Services</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Medecines & Supplies</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Hospitals & Clinics</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Health Care Services</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Talk to Doctors</a></h6>
            </div>
            <div className="services-slide">
              <h6><a href="javascript:void(0);">Home Care Services</a></h6>
            </div>
          </div>
        </div>
      </section>
      {/* /Services Section */}

      {/* Reasons Section */}
      <section className="reason-section">
        <div className="container">
          <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
            <span className="badge badge-primary">Why Book With Us</span>
            <h2>Compelling Reasons to Choose</h2>
          </div>
          <div className="row row-gap-4 justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="reason-item aos" data-aos="fade-up">
                <h6 className="mb-2">
                  <i className="isax isax-tag-user5 text-orange me-2"></i>Follow-Up Care
                </h6>
                <p className="fs-14 mb-0">We ensure continuity of care through regular follow-ups and communication, helping you stay on track with health goals.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="reason-item aos" data-aos="fade-up">
                <h6 className="mb-2">
                  <i className="isax isax-voice-cricle text-purple me-2"></i>Patient-Centered Approach
                </h6>
                <p className="fs-14 mb-0">We prioritize your comfort and preferences, tailoring our services to meet your individual needs and Care from Our Experts</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="reason-item aos" data-aos="fade-up">
                <h6 className="mb-2">
                  <i className="isax isax-wallet-add-15 text-cyan me-2"></i>Convenient Access
                </h6>
                <p className="fs-14 mb-0">Easily book appointments online or through our dedicated customer service team, with flexible hours to fit your schedule.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Reasons Section */}

      {/* Bookus Section */}
      <section className="bookus-section bg-dark">
        <div className="container">
          <div className="row align-items-center row-gap-4">
            <div className="col-lg-6">
              <div className="bookus-img">
                <div className="row g-3">
                  <div className="col-md-12 aos" data-aos="fade-up">
                    <img src="/assets/img/book-01.jpg" alt="img" className="img-fluid" />
                  </div>
                  <div className="col-sm-6 aos" data-aos="fade-up">
                    <img src="/assets/img/book-02.jpg" alt="img" className="img-fluid" />
                  </div>
                  <div className="col-sm-6 aos" data-aos="fade-up">
                    <img src="/assets/img/book-03.jpg" alt="img" className="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-header sec-header-one mb-2 aos" data-aos="fade-up">
                <span className="badge badge-primary">Why Book With Us</span>
                <h2 className="text-white">
                  We are committed to understanding your <span className="text-primary-gradient">unique needs and delivering care.</span>
                </h2>
              </div>
              <p className="text-light mb-4">As a trusted healthcare provider in our community, we are passionate about promoting health and wellness beyond the clinic. We actively engage in community outreach programs, health fairs, and educational workshop.</p>
              <div className="faq-info aos" data-aos="fade-up">
                <div className="accordion" id="faq-details">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <a href="javascript:void(0);" className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                        01 . Our Vision
                      </a>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>We envision a community where everyone has access to high-quality healthcare and the resources they need to lead healthy, fulfilling lives.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <a href="javascript:void(0);" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                        02 . Our Mission
                      </a>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>We envision a community where everyone has access to high-quality healthcare and the resources they need to lead healthy, fulfilling lives.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bookus-sec">
            <div className="row g-4">
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-primary">
                    <i className="isax isax-search-normal5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">Search For Doctors</h6>
                    <p className="fs-14 text-light">Search for a doctor based on specialization, location, or availability for your Treatements</p>
                  </div>
                  <div className="way-icon">
                    <img src="/assets/img/icons/way-icon.svg" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-orange">
                    <i className="isax isax-security-user5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">Check Doctor Profile</h6>
                    <p className="fs-14 text-light">Explore detailed doctor profiles on our platform to make informed healthcare decisions.</p>
                  </div>
                  <div className="way-icon">
                    <img src="/assets/img/icons/way-icon.svg" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-cyan">
                    <i className="isax isax-calendar5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">Schedule Appointment</h6>
                    <p className="fs-14 text-light">After choose your preferred doctor, select a convenient time slot, & confirm your appointment.</p>
                  </div>
                  <div className="way-icon">
                    <img src="/assets/img/icons/way-icon.svg" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="book-item">
                  <div className="book-icon bg-indigo">
                    <i className="isax isax-blend5"></i>
                  </div>
                  <div className="book-info">
                    <h6 className="text-white mb-2">Get Your Solution</h6>
                    <p className="fs-14 text-light">Discuss your health concerns with the doctor and receive the personalized advice & with solution.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Bookus Section */}

      {/* Testimonial Section */}
      <section className="testimonial-section-one">
        <div className="container">
          <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
            <span className="badge badge-primary">Testimonials</span>
            <h2>15k Users Trust myDoctor Worldwide</h2>
          </div>
          <div className="owl-carousel testimonials-slider aos" data-aos="fade-up">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card shadow-none mb-0">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div className="rating d-flex">
                      <i className="fa-solid fa-star filled me-1"></i>
                      <i className="fa-solid fa-star filled me-1"></i>
                      <i className="fa-solid fa-star filled me-1"></i>
                      <i className="fa-solid fa-star filled me-1"></i>
                      <i className="fa-solid fa-star filled"></i>
                    </div>
                    <span>
                      <img src="/assets/img/icons/quote-icon.svg" alt="img" />
                    </span>
                  </div>
                  <h6 className="fs-16 fw-medium mb-2">{testimonial.title}</h6>
                  <p>{testimonial.text}</p>
                  <div className="d-flex align-items-center">
                    <a href="javascript:void(0);" className="avatar avatar-lg">
                      <img src={`/assets/img/patients/${testimonial.image}`} className="rounded-circle" alt="img" />
                    </a>
                    <div className="ms-2">
                      <h6 className="mb-1"><a href="javascript:void(0);">{testimonial.name}</a></h6>
                      <p className="fs-14 mb-0">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-counter">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 row-gap-4">
              <div className="counter-item text-center aos" data-aos="fade-up">
                <h6 className="display-6"><span className="count-digit">500</span>+</h6>
                <p>Doctors Available</p>
              </div>
              <div className="counter-item text-center aos" data-aos="fade-up">
                <h6 className="display-6 secondary-count"><span className="count-digit">18</span>+</h6>
                <p>Specialities</p>
              </div>
              <div className="counter-item text-center aos" data-aos="fade-up">
                <h6 className="display-6 purple-count"><span className="count-digit">30</span>K</h6>
                <p>Bookings Done</p>
              </div>
              <div className="counter-item text-center aos" data-aos="fade-up">
                <h6 className="display-6 pink-count"><span className="count-digit">97</span>+</h6>
                <p>Hospitals & Clinic</p>
              </div>
              <div className="counter-item text-center aos" data-aos="fade-up">
                <h6 className="display-6 warning-count"><span className="count-digit">317</span>+</h6>
                <p>Lab Tests Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Testimonial Section */}

      {/* Company Section */}
      <section className="company-section bg-dark aos" data-aos="fade-up">
        <div className="container">
          <div className="section-header sec-header-one text-center">
            <h6 className="text-light">Trusted by 5+ million people at companies like</h6>
          </div>
          <div className="owl-carousel company-slider">
            {companies.map((company, index) => (
              <div key={index}>
                <img src={`/assets/img/company/${company}`} alt="img" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section-one">
        <div className="container">
          <div className="section-header sec-header-one text-center aos" data-aos="fade-up">
            <span className="badge badge-primary">FAQ'S</span>
            <h2>Your Questions are Answered</h2>
          </div>
          <div className="row">
            <div className="col-md-10 mx-auto">
              <div className="faq-info aos" data-aos="fade-up">
                <div className="accordion" id="faq-details">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <a href="javascript:void(0);" className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                        How do I book an appointment with a doctor?
                      </a>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>Yes, simply visit our website and log in or create an account. Search for a doctor based on specialization, location, or availability & confirm your booking.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <a href="javascript:void(0);" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                        Can I request a specific doctor when booking my appointment?
                      </a>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>Yes, you can usually request a specific doctor when booking your appointment, though availability may vary based on their schedule.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <a href="javascript:void(0);" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                        What should I do if I need to cancel or reschedule my appointment?
                      </a>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>If you need to cancel or reschedule your appointment, contact the doctor as soon as possible to inform them and to reschedule for another available time slot.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                      <a href="javascript:void(0);" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                        What if I'm running late for my appointment?
                      </a>
                    </h2>
                    <div id="collapseFour" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>If you know you will be late, it's courteous to call the doctor's office and inform them. Depending on their policy and schedule, they may be able to accommodate you or reschedule your appointment.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFive">
                      <a href="javascript:void(0);" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFive">
                        Can I book appointments for family members or dependents?
                      </a>
                    </h2>
                    <div id="collapseFive" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="accordion-content">
                          <p>Yes, in many cases, you can book appointments for family members or dependents. However, you may need to provide their personal information and consent to do so.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /FAQ Section */}

      {/* App Section */}
      <section className="app-section app-sec-one p-0">
        <div className="container">
          <div className="app-bg">
            <div className="row">
              <div className="col-lg-6 col-md-12 d-flex">
                <div className="app-content d-flex flex-column justify-content-center">
                  <div className="app-header aos" data-aos="fade-up">
                    <h3 className="display-6 text-white">Download the myDoctor App today!</h3>
                    <p className="text-light">To download an app related to a doctor or medical services, you can typically visit the app store on your device.</p>
                  </div>
                  <div className="google-imgs aos" data-aos="fade-up">
                    <a href="javascript:void(0);"><img src="/assets/img/icons/app-store-01.svg" alt="img" /></a>
                    <a href="javascript:void(0);"><img src="/assets/img/icons/google-play-01.svg" alt="img" /></a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 aos" data-aos="fade-up">
                <div className="mobile-img">
                  <img src="/assets/img/mobile-img.png" className="img-fluid" alt="img" />
                </div>
              </div>
            </div>
            <div className="app-bgs">
              <img src="/assets/img/bg/app-bg-02.png" alt="img" className="app-bg-01" />
              <img src="/assets/img/bg/app-bg-03.png" alt="img" className="app-bg-02" />
              <img src="/assets/img/bg/app-bg-04.png" alt="img" className="app-bg-03" />
            </div>
          </div>
        </div>
        <div className="download-bg">
          <img src="/assets/img/bg/download-bg.png" alt="img" />
        </div>
      </section>
      {/* /App Section */}

      {/* Info Section */}
      <section className="info-section">
        <div className="container">
          <div className="contact-info">
            <div className="d-lg-flex align-items-center justify-content-between w-100 gap-4">
              <div className="mb-4 mb-lg-0 aos" data-aos="fade-up">
                <h6 className="display-6 text-white">Working for Your Better Health.</h6>
              </div>
              <div className="d-sm-flex align-items-center justify-content-lg-end gap-4 aos" data-aos="fade-up">
                <div className="con-info d-flex align-items-center mb-3 mb-sm-0">
                  <span className="con-icon">
                    <i className="isax isax-headphone"></i>
                  </span>
                  <div className="ms-2">
                    <p className="text-white mb-1">Customer Support</p>
                    <p className="text-white fw-medium mb-0">+1 56589 54598</p>
                  </div>
                </div>
                <div className="con-info d-flex align-items-center">
                  <span className="con-icon">
                    <i className="isax isax-message-2"></i>
                  </span>
                  <div className="ms-2">
                    <p className="text-white mb-1">Drop Us an Email</p>
                    <p className="text-white fw-medium mb-0">info1256@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Info Section */}
    </>
  )
}

export default Index

