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

 

  const platformHighlights = [
    {
      id: 1,
      title: 'For patients',
      label: 'Care, on your terms',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
      text: 'Search the available doctors, review their profile and consultation options, choose a suitable appointment time, and keep appointment, message, and order information in one place.'
    },
    {
      id: 2,
      title: 'For doctors',
      label: 'A clearer daily workflow',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format',
      text: 'Doctors can manage professional profiles, availability, appointments, patient conversations, and online consultations from their My Doctor workspace.'
    },
    {
      id: 3,
      title: 'For health businesses',
      label: 'Connected fulfilment',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format',
      text: 'Pharmacies and parapharmacies can maintain product information, fulfil orders, review prescription requirements, and communicate through the same connected platform.'
    }
  ]

  const whyChooseUs = [
    {
      id: 1,
      icon: '/assets/img/icons/choose-01.svg',
      title: 'Verified professional journeys',
      description: 'My Doctor supports account, profile, and document review flows so professional information can be reviewed before a doctor becomes available to patients.'
    },
    {
      id: 2,
      icon: '/assets/img/icons/choose-02.svg',
      title: 'Appointments that stay connected',
      description: 'Booking details, payment status, appointment timing, consultation access, and follow-up communication are designed to remain connected in one workflow.'
    },
    {
      id: 3,
      icon: '/assets/img/icons/choose-03.svg',
      title: 'Convenient care coordination',
      description: 'Patients can discover doctors, manage their appointments, and communicate with their care team without having to switch between separate systems.'
    },
    {
      id: 4,
      icon: '/assets/img/icons/choose-04.svg',
      title: 'Health products with context',
      description: 'The platform also connects patients with pharmacy and parapharmacy product workflows, including prescriptions, checkout, order updates, and delivery information.'
    }
  ]

  const faqs = [
    {
      id: 1,
      question: 'How do I book an appointment?',
      answer: 'Choose a doctor, select an available consultation type and time, review the appointment details, and complete checkout when payment is required.',
      isOpen: true
    },
    {
      id: 2,
      question: 'Can I speak with my doctor through My Doctor?',
      answer: 'When a consultation supports it, My Doctor provides appointment-linked messaging and video-call workflows so both participants can join from their dashboards.',
      isOpen: false
    },
    {
      id: 3,
      question: 'How do pharmacy and parapharmacy orders work?',
      answer: 'Patients can review product information and complete checkout. Where a prescription is required, the request is reviewed before the purchase can continue.',
      isOpen: false
    },
    {
      id: 4,
      question: 'Where can I get help with an account or appointment?',
      answer: 'Use the Contact Us page for general questions or the Support Tickets area in your patient dashboard for account-specific assistance and a recorded conversation.',
      isOpen: false
    },
    {
      id: 5,
      question: 'Is Emergency Room H24 an emergency medical service?',
      answer: 'Emergency Room H24 helps patients find doctors who are available online. It does not replace local emergency services; contact the appropriate emergency service for urgent medical care.',
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
                        <img 
                          src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop&auto=format" 
                          className="img-fluid" 
                          alt="Medical professionals"
                          loading="lazy"
                          onError={(e) => { 
                            e.target.onerror = null
                            e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop&auto=format'
                          }}
                        />
                      </div>
                      <div className="about-img">
                        <img 
                          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop&auto=format" 
                          className="img-fluid" 
                          alt="Healthcare facility"
                          loading="lazy"
                          onError={(e) => { 
                            e.target.onerror = null
                            e.target.src = 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop&auto=format'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="about-inner-img">
                      <div className="about-box">
                        <h4>Connected care, in one place</h4>
                      </div>
                      <div className="about-img">
                        <img 
                          src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop&auto=format" 
                          className="img-fluid" 
                          alt="Medical team"
                          loading="lazy"
                          onError={(e) => { 
                            e.target.onerror = null
                            e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop&auto=format'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="section-inner-header about-inner-header">
                <h6>About My Doctor</h6>
                <h2>Making healthcare coordination more accessible and connected</h2>
              </div>
              <div className="about-content">
                <div className="about-content-details">
                  <p>My Doctor is a digital healthcare platform that brings patients, doctors, pharmacies, parapharmacies, and platform support together around the practical steps of care.</p>
                  <p>Patients can find doctors, make appointments, complete the relevant checkout, manage appointment information, and communicate with their care team. Professionals and health businesses have dedicated tools to manage their profiles, availability, consultations, products, orders, and support.</p>
                </div>
                <div className="about-contact">
                  <div className="about-contact-icon">
                    <span><img src="/assets/img/icons/phone-icon.svg" alt="phone-image" /></span>
                  </div>
                  <div className="about-contact-text">
                    <p>Need help using My Doctor?</p>
                    <h4><Link to="/contact-us">Contact our support team</Link></h4>
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
                  <h2>Find the next step in your care with My Doctor</h2>
                  <p>Explore verified doctor profiles, book an appropriate consultation, and keep the information you need for appointments, products, and support close at hand.</p>
                  <Link to="/contact-us" className="btn btn-primary">Contact Us</Link>
                </div>
              </div>
              <div className="col-lg-5 col-md-12">
                <div className="way-img">
                  <img 
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=600&fit=crop&auto=format" 
                    className="img-fluid" 
                    alt="Healthcare journey"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=600&fit=crop&auto=format'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Way Choose Us */}

      {/* Doctors Section */}
      {/* <section className="doctors-section professional-section">
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
                        <img 
                          src={doctor.image} 
                          className="img-fluid" 
                          alt={doctor.name}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&auto=format'
                          }}
                        />
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
      </section> */}
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
                {platformHighlights.map((highlight) => (
                  <div key={highlight.id} className="testimonial-grid">
                    <div className="testimonial-info">
                      <div className="testimonial-img">
                        <img 
                          src={highlight.image} 
                          className="img-fluid" 
                          alt={highlight.title}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format'
                          }}
                        />
                      </div>
                      <div className="testimonial-content">
                        <div className="section-inner-header testimonial-header">
                          <h6>How My Doctor works</h6>
                          <h2>One platform for the people involved in care</h2>
                        </div>
                        <div className="testimonial-details">
                          <p>{highlight.text}</p>
                          <h6><span>{highlight.title}</span> {highlight.label}</h6>
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
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=600&fit=crop&auto=format" 
                  className="img-fluid" 
                  alt="Healthcare FAQ"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=600&fit=crop&auto=format'
                  }}
                />
                <div className="faq-patients-count">
                  <div className="faq-smile-img">
                    <img src="/assets/img/icons/smiling-icon.svg" alt="icon" />
                  </div>
                  <div className="faq-patients-content">
                    <h4>One</h4>
                    <p>connected care platform</p>
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
