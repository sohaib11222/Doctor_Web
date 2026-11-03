import LegalDocument from '../components/common/LegalDocument'

const RefundPolicy = () => (
  <LegalDocument
    title="Refund Policy"
    intro="This policy explains how payment concerns for appointments, consultations and marketplace orders are reviewed on Mydoctor+."
  >
    <section>
      <h2>Appointment payments</h2>
      <p>Before payment, Mydoctor+ presents the applicable appointment and selected-service charges. If an appointment is cancelled, rejected or cannot be delivered, the available refund or credit options depend on the appointment status, the provider&apos;s cancellation terms and applicable law.</p>
    </section>
    <section>
      <h2>How to request a review</h2>
      <p>Use the appointment details in your account or contact support promptly with the appointment number, payment reference and a short description of the issue. We will review the request with the relevant provider and payment processor where necessary.</p>
      <ul>
        <li>Do not submit duplicate payment disputes while a Mydoctor+ review is in progress.</li>
        <li>Cancelled or missed appointments may not be refundable when the provider&apos;s stated cancellation window has passed.</li>
        <li>If a payment was charged in error, notify us as soon as possible so it can be investigated.</li>
      </ul>
    </section>
    <section>
      <h2>Pharmacy and parapharmacy orders</h2>
      <p>Orders are fulfilled by the relevant seller. Eligibility for a return, replacement or refund may depend on the product type, condition, delivery status and health or safety restrictions. Contact the seller through your order details first; Mydoctor+ support can help route unresolved payment or platform issues.</p>
    </section>
    <section>
      <h2>Refund timing</h2>
      <p>Once a refund is approved, it is issued to the original payment method where possible. The time for funds to appear depends on the payment provider and your financial institution.</p>
      <div className="legal-document__contact">Need help with a charge? Email <a href="mailto:support@mydoctor.plus">support@mydoctor.plus</a> with your booking or order reference.</div>
    </section>
  </LegalDocument>
)

export default RefundPolicy
