import '../../styles/legal-document.css'

const LegalDocument = ({ title, intro, children }) => (
  <main className="legal-document">
    <section className="legal-document__hero">
      <div className="container">
        <span className="legal-document__eyebrow">Mydoctor+ policies</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        <span className="legal-document__updated">Last updated: 4 November 2026</span>
      </div>
    </section>
    <section className="legal-document__content">
      <div className="container">
        <article className="legal-document__card">
          {children}
        </article>
      </div>
    </section>
  </main>
)

export default LegalDocument
