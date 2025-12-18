import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/common/Breadcrumb'

const AboutUs = () => {
  useEffect(() => {
    // Initialize testimonial slider if jQuery and slick are available
    const initSlider = () => {
      if (typeof window !== 'undefined' && window.$ && window.$.fn && window.$.fn.slick) {
        const slider = $('.testimonial-slider')
        if (slider.length > 0) {
          try {
            // Destroy existing slider if any
            if (slider.hasClass('slick-initialized')) {
              slider.slick('unslick')
            }
            slider.slick({
              dots: true,
              infinite: true,
              speed: 500,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 3000,
              arrows: false
            })
          } catch (error) {
            console.warn('Slick slider initialization failed:', error)
          }
        }
      }
    }

    // Wait for DOM to be ready
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider)
      } else {
        // DOM is already ready
        setTimeout(initSlider, 100)
      }
    }

    // Cleanup function
    return () => {
      if (typeof window !== 'undefined' && window.$ && window.$.fn && window.$.fn.slick) {
        const slider = $('.testimonial-slider')
        if (slider.length > 0 && slider.hasClass('slick-initialized')) {
          try {
            slider.slick('unslick')
          } catch (error) {
            // Ignore cleanup errors
          }
        }
      }
    }
  }, [])

  const doctors = [
    {
      id: 1,
      name: 'Dr. Ruby Perrin',
      speciality: 'Cardiology',
      image: '/assets/img/doctors/doctor-03.jpg',
      price: '$200',
      rating: 4.5,
      reviews: 35,
      location: 'Newyork, USA'
    },
    {
      id: 2,
      name: 'Dr. Darren Elder',
      speciality: 'Neurology',
      image: '/assets/img/doctors/doctor-04.jpg',
      price: '$360',
      rating: 4.0,
      reviews: 20,
      location: 'Florida, USA'
    },
    {
      id: 3,
      name: 'Dr. Sofia Brient',
      speciality: 'Urology',
      image: '/assets/img/doctors/doctor-05.jpg',
      price: '$450',
      rating: 4.5,
      reviews: 30,
      location: 'Georgia, USA'
    },
    {
      id: 4,
      name: 'Dr. Paul Richard',
      speciality: 'Orthopedic',
      image: '/assets/img/doctors/doctor-02.jpg',
      price: '$570',
      rating: 4.3,
      reviews: 45,
      location: 'Michigan, USA'
    }
  ]

  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      location: 'New York',
      image: '/assets/img/clients/client-01.jpg',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      id: 2,
      name: 'Amanda Warren',
      location: 'Florida',
      image: '/assets/img/clients/client-02.jpg',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      id: 3,
      name: 'Betty Carlson',
      location: 'Georgia',
      image: '/assets/img/clients/client-03.jpg',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      id: 4,
      name: 'Veronica',
      location: 'California',
      image: '/assets/img/clients/client-04.jpg',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      id: 5,
      name: 'Richard',
      location: 'Michigan',
      image: '/assets/img/clients/client-05.jpg',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    }
  ]

  const whyChooseUs = [
    {
      id: 1,
      icon: '/assets/img/icons/choose-01.svg',
      title: 'Qualified Staff of Doctors',
      description: 'Lorem ipsum sit amet consectetur incididunt ut labore et exercitation ullamco laboris nisi dolore magna enim veniam aliqua.'
    },
    {
      id: 2,
      icon: '/assets/img/icons/choose-02.svg',
      title: 'Qualified Staff of Doctors',
      description: 'Lorem ipsum sit amet consectetur incididunt ut labore et exercitation ullamco laboris nisi dolore magna enim veniam aliqua.'
    },
    {
      id: 3,
      icon: '/assets/img/icons/choose-03.svg',
      title: 'Qualified Staff of Doctors',
      description: 'Lorem ipsum sit amet consectetur incididunt ut labore et exercitation ullamco laboris nisi dolore magna enim veniam aliqua.'
    },
    {
      id: 4,
      icon: '/assets/img/icons/choose-04.svg',
      title: 'Qualified Staff of Doctors',
      description: 'Lorem ipsum sit amet consectetur incididunt ut labore et exercitation ullamco laboris nisi dolore magna enim veniam aliqua.'
    }
  ]

  const faqs = [
    {
      id: 1,
      question: 'Can i make an Appointment Online with White Plains Hospital Kendi?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,',
      isOpen: true
    },
    {
      id: 2,
      question: 'Can i make an Appointment Online with White Plains Hospital Kendi?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,',
      isOpen: false
    },
    {
      id: 3,
      question: 'Can i make an Appointment Online with White Plains Hospital Kendi?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,',
      isOpen: false
    },
    {
      id: 4,
      question: 'Can i make an Appointment Online with White Plains Hospital Kendi?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,',
      isOpen: false
    },
    {
      id: 5,
      question: 'Can i make an Appointment Online with White Plains Hospital Kendi?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,',
      isOpen: false
    }
  ]

  const [openFaq, setOpenFaq] = useState(1)

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  return (
    <div className="content">
      <Breadcrumb title="About Us" li1="About Us" li2="About Us" />

      {/* About Us */}
      <section className="about-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="about-img-info">
                <div className="row">
                  <div className="col-md-6">
                    <div className="about-inner-img">
                      <div className="about-img">
                        <img src="/assets/img/about-img1.jpg" className="img-fluid" alt="about-image" />
                      </div>
                      <div className="about-img">
                        <img src="/assets/img/about-img2.jpg" className="img-fluid" alt="about-image" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="about-inner-img">
                      <div className="about-box">
                        <h4>Over 25+ Years Experience</h4>
                      </div>
                      <div className="about-img">
                        <img src="/assets/img/about-img3.jpg" className="img-fluid" alt="about-image" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="section-inner-header about-inner-header">
                <h6>About Our Company</h6>
                <h2>We Are Always Ensure Best Medical Treatment For Your Health</h2>
              </div>
              <div className="about-content">
                <div className="about-content-details">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur.</p>
                  <p>Sed ut perspiciatis unde omnis iste natus sit voluptatem accusantium doloremque eaque
                    ipsa quae architecto beatae vitae dicta sunt explicabo.</p>
                </div>
                <div className="about-contact">
                  <div className="about-contact-icon">
                    <span><img src="/assets/img/icons/phone-icon.svg" alt="phone-image" /></span>
                  </div>
                  <div className="about-contact-text">
                    <p>Need Emergency?</p>
                    <h4>+1 315 369 5943</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /About Us */}

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-inner-header text-center">
                <h2>Why Choose Us</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {whyChooseUs.map((item) => (
              <div key={item.id} className="col-lg-3 col-md-6 d-flex">
                <div className="card why-choose-card w-100">
                  <div className="card-body">
                    <div className="why-choose-icon">
                      <span><img src={item.icon} alt="choose-image" /></span>
                    </div>
                    <div className="why-choose-content">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* /Why Choose Us */}

      {/* Way Section */}
      <section className="way-section">
        <div className="container">
          <div className="way-bg">
            <div className="way-shapes-img">
              <div className="way-shapes-left">
                <img src="/assets/img/shape-06.png" alt="shape-image" />
              </div>
              <div className="way-shapes-right">
                <img src="/assets/img/shape-07.png" alt="shape-image" />
              </div>
            </div>
            <div className="row align-items-end">
              <div className="col-lg-7 col-md-12">
                <div className="section-inner-header way-inner-header mb-0">
                  <h2>Be on Your Way to Feeling Better with the Doccure</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.</p>
                  <Link to="/contact-us" className="btn btn-primary">Contact With Us</Link>
                </div>
              </div>
              <div className="col-lg-5 col-md-12">
                <div className="way-img">
                  <img src="/assets/img/way-img.png" className="img-fluid" alt="doctor-way-image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Way Choose Us */}

      {/* Doctors Section */}
      <section className="doctors-section professional-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-inner-header text-center">
                <h2>Best Doctors</h2>
              </div>
            </div>
          </div>

          <div className="row">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="col-lg-3 col-md-6 d-flex">
                <div className="doctor-profile-widget w-100">
                  <div className="doc-pro-img">
                    <Link to="/doctor-profile">
                      <div className="doctor-profile-img">
                        <img src={doctor.image} className="img-fluid" alt={doctor.name} />
                      </div>
                    </Link>
                    <div className="doctor-amount">
                      <span>{doctor.price}</span>
                    </div>
                  </div>
                  <div className="doc-content">
                    <div className="doc-pro-info">
                      <div className="doc-pro-name">
                        <Link to="/doctor-profile">{doctor.name}</Link>
                        <p>{doctor.speciality}</p>
                      </div>
                      <div className="reviews-ratings">
                        <p>
                          <span><i className="fas fa-star"></i> {doctor.rating}</span> ({doctor.reviews})
                        </p>
                      </div>
                    </div>
                    <div className="doc-pro-location">
                      <p><i className="feather-map-pin"></i> {doctor.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* /Doctors Section */}

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="testimonial-shape-img">
          <div className="testimonial-shape-left">
            <img src="/assets/img/shape-04.png" alt="shape-image" />
          </div>
          <div className="testimonial-shape-right">
            <img src="/assets/img/shape-05.png" alt="shape-image" />
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="testimonial-slider slick">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-grid">
                    <div className="testimonial-info">
                      <div className="testimonial-img">
                        <img src={testimonial.image} className="img-fluid" alt="client-image" />
                      </div>
                      <div className="testimonial-content">
                        <div className="section-inner-header testimonial-header">
                          <h6>Testimonials</h6>
                          <h2>What Our Client Says</h2>
                        </div>
                        <div className="testimonial-details">
                          <p>{testimonial.text}</p>
                          <h6><span>{testimonial.name}</span> {testimonial.location}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Testimonial Section */}

      {/* FAQ Section */}
      <section className="faq-section faq-section-inner">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-inner-header text-center">
                <h6>Get Your Answer</h6>
                <h2>Frequently Asked Questions</h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="faq-img">
                <img src="/assets/img/faq-img.png" className="img-fluid" alt="img" />
                <div className="faq-patients-count">
                  <div className="faq-smile-img">
                    <img src="/assets/img/icons/smiling-icon.svg" alt="icon" />
                  </div>
                  <div className="faq-patients-content">
                    <h4><span className="count-digit">95</span>k+</h4>
                    <p>Happy Patients</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="faq-info">
                <div className="accordion" id="accordionExample">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="accordion-item">
                      <h2 className="accordion-header" id={`heading${faq.id}`}>
                        <button
                          className={`accordion-button ${openFaq === faq.id ? '' : 'collapsed'}`}
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                          aria-expanded={openFaq === faq.id}
                          aria-controls={`collapse${faq.id}`}
                        >
                          {faq.question}
                        </button>
                      </h2>
                      <div
                        id={`collapse${faq.id}`}
                        className={`accordion-collapse collapse ${openFaq === faq.id ? 'show' : ''}`}
                        aria-labelledby={`heading${faq.id}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="accordion-content">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /FAQ Section */}
    </div>
  )
}

export default AboutUs
