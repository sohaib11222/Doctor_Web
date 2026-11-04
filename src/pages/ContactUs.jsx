import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Breadcrumb from '../components/common/Breadcrumb'
import { createContactInquiry, getContactDetails } from '../api/contact'

const unwrap = (response) => response?.data ?? response ?? {}

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', services: '', message: '' })
  const details = useQuery({ queryKey: ['contact-details'], queryFn: getContactDetails, staleTime: 60 * 1000 })
  const submit = useMutation({ mutationFn: createContactInquiry })
  const contact = unwrap(details.data)
  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await submit.mutateAsync(formData)
      setFormData({ name: '', email: '', phone: '', services: '', message: '' })
      toast.success('Thanks for contacting My Doctor. Our team will reply soon.')
    } catch (error) {
      toast.error(error?.response?.data?.errors?.[0]?.message || error?.response?.data?.message || error?.message || 'Your inquiry could not be sent.')
    }
  }

  return <>
    <Breadcrumb title="Contact Us" li1="Contact Us" li2="Contact Us" />
    <section className="contact-section"><div className="container"><div className="row g-4"><div className="col-lg-5 col-md-12"><div className="section-inner-header contact-inner-header"><h6>Get in touch</h6><h2>How can we help?</h2><p className="text-muted">Questions about care, appointments, or My Doctor services? Send our team a message.</p></div><div className="card contact-card"><div className="card-body"><div className="contact-icon"><i className="isax isax-location5" /></div><div className="contact-details"><h4>Address</h4><p>{contact.address || 'Contact information will be available shortly.'}</p></div></div></div><div className="card contact-card"><div className="card-body"><div className="contact-icon"><i className="isax isax-call5" /></div><div className="contact-details"><h4>Phone number</h4>{contact.phoneNumber ? <a href={`tel:${contact.phoneNumber}`}>{contact.phoneNumber}</a> : <p>Phone details will be available shortly.</p>}</div></div></div><div className="card contact-card"><div className="card-body"><div className="contact-icon"><i className="isax isax-sms5" /></div><div className="contact-details"><h4>Email address</h4>{contact.supportEmail ? <a href={`mailto:${contact.supportEmail}`}>{contact.supportEmail}</a> : <p>Email details will be available shortly.</p>}</div></div></div></div><div className="col-lg-7 col-md-12 d-flex"><div className="card contact-form-card w-100"><div className="card-body"><form onSubmit={handleSubmit}><div className="row"><div className="col-md-6"><div className="mb-3"><label className="form-label">Name</label><input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} maxLength="120" required /></div></div><div className="col-md-6"><div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} maxLength="254" required /></div></div><div className="col-md-6"><div className="mb-3"><label className="form-label">Phone number <span className="text-muted">(optional)</span></label><input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} maxLength="80" /></div></div><div className="col-md-6"><div className="mb-3"><label className="form-label">Service <span className="text-muted">(optional)</span></label><input type="text" className="form-control" name="services" value={formData.services} onChange={handleChange} maxLength="160" placeholder="Appointment, account, order…" /></div></div><div className="col-md-12"><div className="mb-3"><label className="form-label">Message</label><textarea className="form-control" rows="6" name="message" value={formData.message} onChange={handleChange} minLength="10" maxLength="5000" required /></div></div><div className="col-md-12"><div className="form-group-btn mb-0"><button type="submit" className="btn btn-primary-gradient" disabled={submit.isPending}>{submit.isPending ? 'Sending…' : 'Send Message'}</button></div></div></div></form></div></div></div></div></div></section>
  </>
}
export default ContactUs
