import { useState } from 'react'
import Breadcrumb from '../components/common/Breadcrumb'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    services: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      services: '',
      message: ''
    })
  }

  return (
    <>
      <Breadcrumb title="Contact Us" li1="Contact Us" li2="Contact Us" />

      {/* Contact Us */}
      <section className="contact-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-12">
              <div className="section-inner-header contact-inner-header">
                <h6>Get in touch</h6>
                <h2>Have Any Question?</h2>
              </div>
              <div className="card contact-card">
                <div className="card-body">
                  <div className="contact-icon">
                    <i className="isax isax-location5"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Address</h4>
                    <p>8432 Mante Highway, Aminaport, USA</p>
                  </div>
                </div>
              </div>
              <div className="card contact-card">
                <div className="card-body">
                  <div className="contact-icon">
                    <i className="isax isax-call5"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Phone Number</h4>
                    <p>+1 315 369 5943</p>
                  </div>
                </div>
              </div>
              <div className="card contact-card">
                <div className="card-body">
                  <div className="contact-icon">
                    <i className="isax isax-sms5"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Email Address</h4>
                    <p>doccure@example.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-md-12 d-flex">
              <div className="card contact-form-card w-100">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Services</label>
                          <input
                            type="text"
                            className="form-control"
                            name="services"
                            value={formData.services}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Message</label>
                          <textarea
                            className="form-control"
                            rows="6"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group-btn mb-0">
                          <button type="submit" className="btn btn-primary-gradient">Send Message</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Contact Us */}

      {/* Contact Map */}
      <section className="contact-map d-flex">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.7301009561315!2d-76.13077892422932!3d36.82498697224007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89bae976cfe9f8af%3A0xa61eac05156fbdb9!2sBeachStreet%20USA!5e0!3m2!1sen!2sin!4v1669777904208!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Contact Map"
        ></iframe>
      </section>
      {/* /Contact Map */}
    </>
  )
}

export default ContactUs
