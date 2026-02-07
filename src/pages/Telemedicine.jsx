import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as specializationApi from '../api/specialization'
import TelemedicineModal from '../components/common/TelemedicineModal'

const Telemedicine = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [showTelemedicineModal, setShowTelemedicineModal] = useState(false)

  const { data: specializationsData } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => specializationApi.getAllSpecializations()
  })

  const specializations = useMemo(() => {
    if (!specializationsData) return []
    return Array.isArray(specializationsData) ? specializationsData : (specializationsData.data || [])
  }, [specializationsData])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set('search', searchTerm.trim())
    if (location.trim()) params.set('location', location.trim())
    if (selectedSpecialization) params.set('specialization', selectedSpecialization)
    navigate(`/search?${params.toString()}`)
  }

  const features = [
    {
      icon: 'isax isax-people5',
      title: 'Best Specialists',
      text: 'Connect with the best medical specialists'
    },
    {
      icon: 'isax isax-clock5',
      title: '24/7 Availability',
      text: 'Medical consultation anytime and anywhere'
    },
    {
      icon: 'isax isax-shield-tick5',
      title: 'Secure & Private',
      text: 'Secure and private environment'
    },
    {
      icon: 'isax isax-monitor5',
      title: 'Multi-Device Service',
      text: 'Multi-device service'
    }
  ]

  return (
    <>
      <style>{`
        /* Hero: background image visible, no white overlay */
        .telemedicine-hero {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          padding: 80px 0 100px;
          background-color: #e0e8f0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .telemedicine-hero::before {
          display: none;
        }
        .telemedicine-hero .container {
          position: relative;
          z-index: 1;
        }
        /* Keep text and search bar away from left so they don't cover left faces */
        .telemedicine-hero .hero-content-wrap {
          margin-left: min(10%, 10px);
          max-width: 80%;
        }
        @media (max-width: 768px) {
          .telemedicine-hero .hero-content-wrap {
            margin-left: 0;
          }
        }
        .telemedicine-hero h1 {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 600;
          color: #2d5a87;
          line-height: 1.35;
          margin-bottom: 2rem;
          text-align: left;
          text-shadow: 0 1px 2px rgba(255,255,255,0.8);
          max-width: 100%;
        }
        .telemedicine-hero h1 strong {
          color: #0E82FD;
          font-weight: 700;
        }
        /* Search bar: long, one row */
        .telemedicine-hero .search-box-one {
          max-width: 100%;
          width: 100%;
          min-width: 0;
          margin: 0 0 2rem;
          padding: 1.2rem 1.5rem;
          border-radius: 50px;
          background-color: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .telemedicine-hero .search-box-one form {
          display: flex;
          gap: 8px;
          flex-wrap: nowrap;
          align-items: stretch;
        }
        .telemedicine-hero .search-box-one .search-input {
          flex: 1 1 auto;
          min-width: 0;
          border-radius: 50px;
          overflow: hidden;
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          display: flex;
          align-items: center;
          padding: 0 12px;
        }
        .telemedicine-hero .search-box-one .search-input i {
          font-size: 18px;
          color: #6c757d;
          margin-right: 8px;
          flex-shrink: 0;
        }
        .telemedicine-hero .search-box-one .search-input .mb-0 {
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          align-items: center;
        }
        .telemedicine-hero .search-box-one .form-control {
          font-size: 13px;
          padding: 12px 8px;
          padding-left: 20px;
          min-height: 50px;
          height: auto;
          border: none;
          background: transparent;
          border-radius: 50px;
          width: 100%;
          min-width: 0;
        }
        .telemedicine-hero .search-box-one .form-control:focus {
          outline: none;
          box-shadow: none;
        }
        .telemedicine-hero .search-box-one .form-search-btn {
          flex: 0 0 auto;
          display: flex;
          align-items: stretch;
        }
        .telemedicine-hero .search-box-one .form-search-btn .btn {
          font-size: 16px;
          padding: 14px 32px;
          min-height: 50px;
          height: 100%;
          font-weight: 600;
          white-space: nowrap;
          align-self: stretch;
          border-radius: 50px;
          background: linear-gradient(90deg, #0E82FD 0%, #0ab3e8 100%);
          border: none;
          color: #fff;
        }
        .telemedicine-hero .search-box-one .form-search-btn .btn:hover {
          opacity: 0.95;
          color: #fff;
        }
        @media (max-width: 992px) {
          .telemedicine-hero .search-box-one form {
            flex-wrap: wrap;
          }
          .telemedicine-hero .search-box-one .search-input {
            flex: 1 1 calc(50% - 6px);
            min-width: 150px;
          }
          .telemedicine-hero .search-box-one .form-search-btn {
            flex: 1 1 100%;
          }
          .telemedicine-hero .search-box-one .form-search-btn .btn {
            width: 100%;
          }
        }
        @media (max-width: 576px) {
          .telemedicine-hero .search-box-one .search-input {
            flex: 1 1 100%;
          }
        }
        /* Features section */
        .telemedicine-features {
          padding: 80px 0;
          background: #fff;
        }
        .telemedicine-features .feature-card {
          text-align: center;
          padding: 2rem 1.5rem;
          border-radius: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .telemedicine-features .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(14, 130, 253, 0.12);
        }
        .telemedicine-features .feature-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 1.25rem;
          border-radius: 50%;
          border: 2px solid #0E82FD;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #0E82FD;
        }
        .telemedicine-features .feature-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }
        .telemedicine-features .feature-card p {
          font-size: 0.95rem;
          color: #5a5a5a;
          margin: 0;
          line-height: 1.5;
        }
        /* What is Telemedicine section - blue gradient, no white */
        .telemedicine-what-section {
          padding: 80px 0;
          background: linear-gradient(180deg, #0a5fb8 0%, #0E82FD 50%, #0ab3e8 100%);
          color: #fff;
        }
        .telemedicine-what-section .what-content h2 {
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 700;
          color: #fff;
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }
        .telemedicine-what-section .what-content p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.95);
          margin-bottom: 1.5rem;
        }
        .telemedicine-what-section .what-content .btn-see-more {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background: rgba(255,255,255,0.25);
          border: 2px solid #fff;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .telemedicine-what-section .what-content .btn-see-more:hover {
          background: #fff;
          color: #0E82FD;
        }
        .telemedicine-what-section .what-img img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }
        /* Private messaging and video consultation section */
        .telemedicine-services-section {
          padding: 80px 0;
          background: #f5f6f8;
        }
        .telemedicine-services-section .section-heading {
          text-align: center;
          margin-bottom: 1rem;
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          font-weight: 700;
          color: #1a365d;
        }
        .telemedicine-services-section .section-desc {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 3rem;
          font-size: 1.05rem;
          line-height: 1.7;
          color: #4a5568;
        }
        .telemedicine-services-section .service-card {
          display: flex;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #b8d4f0;
          box-shadow: 0 2px 12px rgba(14, 130, 253, 0.08);
          height: 100%;
          min-height: 180px;
        }
        .telemedicine-services-section .service-card .service-icon-wrap {
          flex: 0 0 100px;
          background: #0E82FD;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .telemedicine-services-section .service-card .service-icon-wrap i {
          font-size: 2.5rem;
          color: #fff;
        }
        .telemedicine-services-section .service-card .service-body {
          flex: 1;
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .telemedicine-services-section .service-card .service-body h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 0.5rem;
        }
        .telemedicine-services-section .service-card .service-body p {
          font-size: 0.95rem;
          color: #4a5568;
          line-height: 1.6;
          margin: 0;
        }
        /* How it works section */
        .telemedicine-how-section {
          padding: 80px 0;
          background: #fff;
        }
        .telemedicine-how-section .how-heading {
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1.75rem;
        }
        .telemedicine-how-section .how-steps {
          list-style: none;
          padding: 0;
          margin: 0 0 1.75rem;
          counter-reset: step;
        }
        .telemedicine-how-section .how-steps li {
          position: relative;
          padding-left: 2.5rem;
          margin-bottom: 1rem;
          font-size: 1.05rem;
          line-height: 1.6;
          color: #4a5568;
          counter-increment: step;
        }
        .telemedicine-how-section .how-steps li::before {
          content: counter(step);
          position: absolute;
          left: 0;
          top: -2px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #0E82FD;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .telemedicine-how-section .btn-find-specialist {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background: #5eb3e8;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .telemedicine-how-section .btn-find-specialist:hover {
          background: #0E82FD;
          color: #fff;
        }
        .telemedicine-how-section .how-img img {
          max-width: 100%;
          height: auto;
          display: block;
        }
        /* Multiplatform service section - dark blue */
        .telemedicine-multiplatform-section {
          padding: 80px 0;
          background: #1a365d;
          color: #fff;
        }
        .telemedicine-multiplatform-section .multi-img img {
          max-width: 100%;
          height: auto;
          display: block;
          border-radius: 8px;
        }
        .telemedicine-multiplatform-section .multi-content h2 {
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          font-weight: 700;
          color: #fff;
          margin-bottom: 1.25rem;
        }
        .telemedicine-multiplatform-section .multi-content .multi-desc {
          font-size: 1.05rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.95);
          margin-bottom: 1.5rem;
        }
        .telemedicine-multiplatform-section .multi-content .multi-desc strong {
          font-weight: 700;
          color: #fff;
        }
        .telemedicine-multiplatform-section .browser-icons {
          display: flex;
          gap: 12px;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .telemedicine-multiplatform-section .browser-icons .browser-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
        }
        .telemedicine-multiplatform-section .download-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .telemedicine-multiplatform-section .download-buttons a {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          background: #0E82FD;
          border: none;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .telemedicine-multiplatform-section .download-buttons a:hover {
          background: #0a6dd4;
          color: #fff;
        }
      `}</style>

      {/* Hero Section - background image visible, no white */}
      <section
        className="telemedicine-hero"
        style={{ backgroundImage: 'url(/assets/img/hero_background.png)' }}
      >
        <div className="container">
          <div className="hero-content-wrap">
          <h1>
            Using Telemedicine it is possible to carry out medical consultations{' '}
            <strong>immediately</strong> and <strong>without the need to travel</strong>.
          </h1>
          <div className="search-box-one">
            <form onSubmit={handleSearch}>
              <div className="search-input search-line">
                <i className="isax isax-hospital5 bficon"></i>
                <div className="mb-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search doctors, clinics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="search-input search-map-line">
                <i className="isax isax-location5"></i>
                <div className="mb-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="search-input search-calendar-line">
                <i className="isax isax-calendar-tick5"></i>
                <div className="mb-0">
                  <select
                    className="form-control"
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                  >
                    <option value="">All Specialities</option>
                    {specializations.map((spec) => (
                      <option key={spec._id || spec} value={spec._id || spec}>
                        {spec.name || spec}
                      </option>
                    ))}
                  </select>
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
      </section>

      {/* Private messaging and video consultation Section - below telemedicine hero */}
    

      {/* Features Section */}
      <section className="telemedicine-features">
        <div className="container">
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6 col-12">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Telemedicine? Section - English, telesection.png, See more opens modal */}
      <section className="telemedicine-what-section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 order-lg-1 order-2">
              <div className="what-img">
                <img
                  src="/assets/img/telesection.png"
                  alt="Telemedicine video consultation"
                />
              </div>
            </div>
            <div className="col-lg-6 order-lg-2 order-1">
              <div className="what-content">
                <h2>What is Telemedicine?</h2>
                <p>
                  It is a private messaging and video consultation service that allows you to
                  contact the best doctors at any time and place.
                </p>
                <button
                  type="button"
                  className="btn-see-more"
                  onClick={() => setShowTelemedicineModal(true)}
                >
                  See more <i className="fa-solid fa-chevron-right" style={{ fontSize: '14px' }}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="telemedicine-services-section">
        <div className="container">
          <h2 className="section-heading">Private messaging and video consultation</h2>
          <p className="section-desc">
            These two services allow you to have the medical consultations you need quickly and
            conveniently. You can also share images, medical evidence, or videos with your
            specialist doctor.
          </p>
          <div className="row g-4">
            <div className="col-lg-6 col-12">
              <div className="service-card">
                <div className="service-icon-wrap">
                  <i className="isax isax-messages-25"></i>
                </div>
                <div className="service-body">
                  <h3>Private messaging</h3>
                  <p>
                    Send private messages to your specialist doctor and resolve your doubts
                    easily and simply.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="service-card">
                <div className="service-icon-wrap">
                  <i className="isax isax-video5"></i>
                </div>
                <div className="service-body">
                  <h3>Video consultation</h3>
                  <p>
                    Speak privately with your doctor from anywhere without having to physically
                    reach your doctor&apos;s office.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section - English, steps.png on right */}
      <section className="telemedicine-how-section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="how-heading">How it works?</h2>
              <ol className="how-steps">
                <li>Find the best specialist with the activated Telemedicine service.</li>
                <li>Select the private messaging or video consultation service.</li>
                <li>Start your medical consultation with the specialist from any location.</li>
                <li>Evaluate the service.</li>
              </ol>
              <Link to="/search" className="btn-find-specialist">
                Find your specialist <i className="fa-solid fa-chevron-right" style={{ fontSize: '14px' }}></i>
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="how-img text-center text-lg-end">
                <img src="/assets/img/steps.png" alt="How telemedicine works - steps" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multiplatform service Section - English, transform.png on left */}
      <section className="telemedicine-multiplatform-section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="multi-img">
                <img src="/assets/img/same.jpeg" alt="Multiplatform service - app and website" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="multi-content">
                <h2>Multiplatform service</h2>
                <p className="multi-desc">
                  You can use this service in two ways, via the <strong>website</strong> or the{' '}
                  <strong>Top Doctors App</strong>.
                </p>
               
                <div className="download-buttons">
                  <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Download on Google Play">
                    <i className="fa-brands fa-google-play" style={{ fontSize: '1.5rem' }}></i>
                    Download on Google Play
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Download on App Store">
                    <i className="fa-brands fa-apple" style={{ fontSize: '1.5rem' }}></i>
                    Download on App Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TelemedicineModal open={showTelemedicineModal} onClose={() => setShowTelemedicineModal(false)} />
    </>
  )
}

export default Telemedicine
