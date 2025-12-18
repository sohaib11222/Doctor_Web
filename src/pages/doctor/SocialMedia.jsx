const SocialMedia = () => {
  const socialLinks = [
    { platform: 'Facebook', selected: true },
    { platform: 'Twitter', selected: true },
    { platform: 'Linkedin', selected: true },
    { platform: 'Instagram', selected: true }
  ]

  return (
    <div className="content doctor">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xl-3 theiaStickySidebar">
            {/* DoctorSidebar will be rendered by DashboardLayout */}
          </div>
          
          <div className="col-lg-12 col-xl-12">
            <div className="dashboard-header">
              <h3>Social Media</h3>
            </div>
            <div className="add-btn text-end mb-4">
              <a href="#" className="btn btn-primary prime-btn add-social-media">Add New Social Media</a>
            </div>
            <form action="/social-media" className="social-media-form">
              {socialLinks.map((link, index) => (
                <div key={index} className="social-media-links d-flex align-items-center">
                  <div className="input-block input-block-new select-social-link">
                    <select className="select">
                      <option selected={link.platform === 'Facebook'}>Facebook</option>
                      <option selected={link.platform === 'Linkedin'}>Linkedin</option>
                      <option selected={link.platform === 'Twitter'}>Twitter</option>
                      <option selected={link.platform === 'Instagram'}>Instagram</option>
                    </select>
                  </div>
                  <div className="input-block input-block-new flex-fill">
                    <input type="text" className="form-control" placeholder="Add Url" />
                  </div>
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialMedia

