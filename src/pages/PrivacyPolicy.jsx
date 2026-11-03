import LegalDocument from '../components/common/LegalDocument'

const PrivacyPolicy = () => {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro="This policy describes the information Mydoctor+ uses to operate the platform, protect accounts and support healthcare appointments."
    >
      <section>
        <h2>Information we collect</h2>
        <p>We collect the information needed to create and operate an account, such as your name, contact details, profile information, appointment preferences, messages and payment-related transaction records. Healthcare professionals may provide professional profile and availability information. We also collect technical information needed to secure and improve the service.</p>
      </section>
      <section>
        <h2>How we use information</h2>
        <ul>
          <li>To authenticate users and provide appointments, consultations, chat, orders and account support.</li>
          <li>To send relevant confirmations, reminders, status updates and security notices.</li>
          <li>To prevent fraud, maintain platform security and comply with applicable legal obligations.</li>
          <li>To improve the reliability and usability of Mydoctor+ using aggregated or de-identified insights where appropriate.</li>
        </ul>
      </section>
      <section>
        <h2>When information is shared</h2>
        <p>Information is shared with the doctor, patient, pharmacy, parapharmacy or service provider involved in the feature you use, and with trusted processors that help us deliver secure hosting, notifications and payments. We do not sell personal information. We may disclose information where required by law or to protect the safety, rights or security of our users and services.</p>
      </section>
      <section>
        <h2>Security and retention</h2>
        <p>We use reasonable organisational and technical measures to protect personal information. No online service can guarantee absolute security, so please use a strong password and report suspected unauthorised activity promptly. We keep information only for as long as it is needed for the purposes described here, legal requirements and legitimate record-keeping.</p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>You can review and update much of your profile in your account. Depending on applicable law, you may request access, correction or deletion of personal information. Some records may need to be retained for healthcare, payment, security or legal reasons.</p>
        <div className="legal-document__contact">For privacy questions or requests, contact <a href="mailto:privacy@mydoctor.plus">privacy@mydoctor.plus</a>.</div>
      </section>
    </LegalDocument>
  )
}

export default PrivacyPolicy

