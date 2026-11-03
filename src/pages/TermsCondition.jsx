import LegalDocument from '../components/common/LegalDocument'

const TermsCondition = () => {
  return (
    <LegalDocument
      title="Terms & Conditions"
      intro="These terms explain how Mydoctor+ provides appointment booking, online consultations, messaging and health-service marketplace features."
    >
      <section>
        <h2>Using Mydoctor+</h2>
        <p>You may use Mydoctor+ to find healthcare professionals, manage appointments, communicate through approved platform features and, where available, purchase health-related products. You must provide accurate account information and keep your sign-in details confidential.</p>
        <p>You are responsible for activity carried out through your account and for ensuring that any information you provide about yourself, a dependant or an appointment is current and accurate.</p>
      </section>
      <section>
        <h2>Appointments and consultations</h2>
        <p>Appointment availability is set by the healthcare professional. A booking is subject to the displayed time, payment requirements and any confirmation or cancellation status shown in your account.</p>
        <ul>
          <li>Arrive or join an online consultation at the scheduled time.</li>
          <li>Use chat and video consultation tools respectfully and only for the relevant care relationship.</li>
          <li>Contact the provider or Mydoctor+ support as soon as possible if you need to cancel or reschedule.</li>
        </ul>
        <p className="legal-document__notice">Mydoctor+ does not provide emergency care. If you believe you are experiencing a medical emergency, contact local emergency services immediately.</p>
      </section>
      <section>
        <h2>Payments and platform services</h2>
        <p>Displayed consultation and service charges are reviewed at checkout before payment. Payment processing may be handled by an approved provider. Product availability, delivery and fulfilment are managed by the relevant pharmacy or parapharmacy unless the order details state otherwise.</p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>Do not misuse the platform, interfere with its security, impersonate another person, upload harmful content or use communications to harass, threaten or advertise unrelated services. We may restrict access where this is necessary to protect users, providers or the platform.</p>
      </section>
      <section>
        <h2>Changes and contact</h2>
        <p>We may update these terms when the service, law or security requirements change. Continued use after an updated version takes effect means you accept the revised terms.</p>
        <div className="legal-document__contact">Questions about these terms? Contact the Mydoctor+ support team at <a href="mailto:support@mydoctor.plus">support@mydoctor.plus</a>.</div>
      </section>
    </LegalDocument>
  )
}

export default TermsCondition

