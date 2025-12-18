import { Link } from 'react-router-dom'

const DoctorChat = () => {
  return (
    <>
      <style>{`
        .doctor-chat-wrapper {
          padding-top: 68px;
          min-height: 100vh;
          background: #f5f5f5;
        }
        .doctor-chat-wrapper .container {
          max-width: 100%;
          padding: 24px;
        }
        .doctor-chat-container {
          display: flex;
          gap: 24px;
          height: calc(100vh - 192px);
          max-height: calc(100vh - 192px);
        }
        .chat-list-sidebar {
          width: 400px;
          flex-shrink: 0;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .chat-list-header {
          padding: 12px;
          border-bottom: 1px solid #e5e5e5;
        }
        .chat-list-header h4 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 11px;
          color: #0A0A0A;
        }
        .chat-search-box {
          position: relative;
        }
        .chat-search-box .form-control-feedback {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }
        .chat-search-box input {
          width: 100%;
          padding: 8px 12px 8px 35px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 14px;
        }
        .chat-list-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0 12px;
        }
        .online-now-section {
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .section-header h6 {
          font-size: 14px;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0;
        }
        .section-header a {
          font-size: 12px;
          color: #0A0A0A;
          text-decoration: none;
        }
        .online-contacts {
          display: flex;
          gap: 12px;
          overflow-x: auto;
        }
        .online-contact-item {
          flex-shrink: 0;
          width: 50px;
          height: 50px;
          position: relative;
        }
        .online-contact-item img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .online-contact-item .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #4CAF50;
          border: 2px solid #fff;
          border-radius: 50%;
        }
        .pinned-chat-section, .recent-chat-section {
          padding: 16px 0;
        }
        .chat-item {
          display: flex;
          align-items: flex-start;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 4px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .chat-item:hover {
          background: #f5f5f5;
        }
        .chat-item-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 12px;
          flex-shrink: 0;
          position: relative;
        }
        .chat-item-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .chat-item-avatar .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #4CAF50;
          border: 2px solid #fff;
          border-radius: 50%;
        }
        .chat-item-content {
          flex: 1;
          min-width: 0;
        }
        .chat-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        .chat-item-name {
          font-size: 15px;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0;
        }
        .chat-item-time {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #999;
        }
        .chat-item-message {
          font-size: 14px;
          color: #666;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chat-item-icons {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .chat-item-icons i {
          font-size: 12px;
          color: #999;
        }
        .chat-item-icons .green-check {
          color: #4CAF50;
        }
        .chat-details-area {
          flex: 1;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }
        .chat-details-header {
          padding: 15px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        .chat-details-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-details-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          position: relative;
        }
        .chat-details-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .chat-details-avatar .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background: #4CAF50;
          border: 2px solid #fff;
          border-radius: 50%;
        }
        .chat-details-user-info h5 {
          font-size: 18px;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0 0 2px 0;
        }
        .chat-details-user-info small {
          font-size: 12px;
          color: #4CAF50;
        }
        .chat-details-actions {
          display: flex;
          gap: 8px;
        }
        .chat-details-actions button {
          width: 30px;
          height: 30px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-details-actions button:hover {
          background: #f5f5f5;
        }
        .chat-messages-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px;
          padding-bottom: 40px;
          min-height: 0;
        }
        .chat-date-separator {
          text-align: center;
          margin: 20px 0;
          position: relative;
        }
        .chat-date-separator::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: #e5e5e5;
        }
        .chat-date-separator span {
          background: #fff;
          padding: 0 12px;
          position: relative;
          color: #999;
          font-size: 12px;
        }
        .chat-message {
          display: flex;
          margin-bottom: 24px;
          max-width: 75%;
        }
        .chat-message.incoming {
          align-self: flex-start;
        }
        .chat-message.outgoing {
          align-self: flex-end;
          flex-direction: row-reverse;
          margin-left: auto;
        }
        .chat-message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
          margin: 0 8px;
        }
        .chat-message-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .chat-message-content {
          flex: 1;
        }
        .chat-message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .chat-message-header h6 {
          font-size: 14px;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0;
        }
        .chat-message-header span {
          font-size: 12px;
          color: #999;
        }
        .chat-message-bubble {
          background: #f5f5f5;
          border-radius: 0 15px 15px 15px;
          padding: 14px 20px;
          font-size: 14px;
          color: #0A0A0A;
        }
        .chat-message.outgoing .chat-message-bubble {
          border-radius: 15px 0 15px 15px;
          background: #e3f2fd;
        }
        .chat-message-bubble a {
          color: #666;
          word-wrap: break-word;
        }
        .chat-message-bubble img {
          max-width: 100%;
          border-radius: 10px;
          margin-top: 8px;
        }
        .audio-message {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .audio-message button {
          width: 32px;
          height: 32px;
          border: none;
          background: #2196F3;
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .audio-waveform {
          flex: 1;
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
        }
        .chat-input-area {
          padding: 15px;
          border-top: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          background: #fff;
        }
        .chat-input-actions {
          display: flex;
          gap: 8px;
        }
        .chat-input-actions button {
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }
        .chat-input-actions button:hover {
          background: #f5f5f5;
        }
        .chat-input-field {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #e5e5e5;
          border-radius: 24px;
          font-size: 14px;
        }
        .chat-send-button {
          width: 40px;
          height: 40px;
          border: none;
          background: #2196F3;
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-send-button:hover {
          background: #1976D2;
        }
        @media (max-width: 991px) {
          .doctor-chat-container {
            flex-direction: column;
            height: auto;
          }
          .chat-list-sidebar {
            width: 100%;
            max-height: 400px;
          }
          .chat-details-area {
            display: none;
          }
          .chat-details-area.show {
            display: flex;
          }
        }
      `}</style>
      <div className="page-wrapper chat-page-wrapper doctor-chat-wrapper">
        <div className="container">
          <div className="content doctor-content">
            <div className="doctor-chat-container">
              {/* Left Sidebar - Chat List */}
              <div className="chat-list-sidebar">
                <div className="chat-list-header">
                  <h4>All Chats</h4>
                  <div className="chat-search-box">
                    <span className="form-control-feedback">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input type="text" placeholder="Search" className="form-control" />
                  </div>
                </div>
                <div className="chat-list-content">
                  {/* Online Now Section */}
                  <div className="online-now-section">
                    <div className="section-header">
                      <h6>Online Now</h6>
                      <a href="javascript:void(0);">View All</a>
                    </div>
                    <div className="online-contacts">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="online-contact-item">
                          <img src={`/assets/img/doctors-dashboard/profile-0${i === 1 ? '1' : i === 2 ? '4' : i === 3 ? '3' : '8'}.jpg`} alt="Contact" />
                          <span className="online-dot"></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pinned Chat Section */}
                  <div className="pinned-chat-section">
                    <div className="section-header">
                      <h6>Pinned Chat</h6>
                    </div>
                    <a href="javascript:void(0);" className="chat-item">
                      <div className="chat-item-avatar">
                        <img src="/assets/img/doctors-dashboard/profile-01.jpg" alt="Avatar" />
                        <span className="online-dot"></span>
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h5 className="chat-item-name">Adrian Marshall</h5>
                          <div className="chat-item-time">
                            <small>Just Now</small>
                            <div className="chat-item-icons">
                              <i className="fa-solid fa-thumbtack"></i>
                              <i className="fa-solid fa-check-double green-check"></i>
                            </div>
                          </div>
                        </div>
                        <p className="chat-item-message">Have you called them?</p>
                      </div>
                    </a>
                    <a href="javascript:void(0);" className="chat-item">
                      <div className="chat-item-avatar">
                        <img src="/assets/img/doctors-dashboard/doctor-profile-img.jpg" alt="Avatar" />
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h5 className="chat-item-name">Dr Joseph Boyd</h5>
                          <div className="chat-item-time">
                            <small>Yesterday</small>
                            <div className="chat-item-icons">
                              <i className="fa-solid fa-thumbtack"></i>
                            </div>
                          </div>
                        </div>
                        <p className="chat-item-message">
                          <i className="fa-solid fa-video" style={{ marginRight: '4px' }}></i>Video
                        </p>
                      </div>
                    </a>
                    <a href="javascript:void(0);" className="chat-item">
                      <div className="chat-item-avatar">
                        <img src="/assets/img/doctors-dashboard/profile-04.jpg" alt="Avatar" />
                        <span className="online-dot"></span>
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h5 className="chat-item-name">Catherine Gracey</h5>
                          <div className="chat-item-time">
                            <small>10:20 PM</small>
                            <div className="chat-item-icons">
                              <i className="fa-solid fa-thumbtack"></i>
                              <i className="fa-solid fa-check-double green-check"></i>
                            </div>
                          </div>
                        </div>
                        <p className="chat-item-message">
                          <i className="fa-solid fa-file-lines" style={{ marginRight: '4px' }}></i>Prescription.doc
                        </p>
                      </div>
                    </a>
                  </div>

                  {/* Recent Chat Section */}
                  <div className="recent-chat-section">
                    <div className="section-header">
                      <h6>Recent Chat</h6>
                    </div>
                    <a href="javascript:void(0);" className="chat-item">
                      <div className="chat-item-avatar">
                        <img src="/assets/img/doctors-dashboard/profile-02.jpg" alt="Avatar" />
                        <span className="online-dot"></span>
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h5 className="chat-item-name">Kelly Stevens</h5>
                          <div className="chat-item-time">
                            <small>Just Now</small>
                            <div className="chat-item-icons" style={{ 
                              background: '#2196F3', 
                              color: '#fff', 
                              borderRadius: '50%', 
                              width: '20px', 
                              height: '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontSize: '10px'
                            }}>2</div>
                          </div>
                        </div>
                        <p className="chat-item-message">Have you called them?</p>
                      </div>
                    </a>
                    <a href="javascript:void(0);" className="chat-item">
                      <div className="chat-item-avatar">
                        <img src="/assets/img/doctors-dashboard/profile-05.jpg" alt="Avatar" />
                        <span className="online-dot"></span>
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h5 className="chat-item-name">Robert Miller</h5>
                          <div className="chat-item-time">
                            <small>Yesterday</small>
                            <div className="chat-item-icons">
                              <i className="fa-solid fa-check"></i>
                            </div>
                          </div>
                        </div>
                        <p className="chat-item-message">
                          <i className="fa-solid fa-video" style={{ marginRight: '4px' }}></i>Video
                        </p>
                      </div>
                    </a>
                    <a href="javascript:void(0);" className="chat-item">
                      <div className="chat-item-avatar">
                        <img src="/assets/img/doctors-dashboard/profile-08.jpg" alt="Avatar" />
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h5 className="chat-item-name">Emily Musick</h5>
                          <div className="chat-item-time">
                            <small>10:20 PM</small>
                          </div>
                        </div>
                        <p className="chat-item-message">
                          <i className="fa-solid fa-file-lines" style={{ marginRight: '4px' }}></i>Project Tools.doc
                        </p>
                      </div>
                    </a>
                    <a href="javascript:void(0);" className="chat-item">
                      <div className="chat-item-avatar">
                        <img src="/assets/img/doctors-dashboard/profile-03.jpg" alt="Avatar" />
                        <span className="online-dot"></span>
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h5 className="chat-item-name">Samuel James</h5>
                          <div className="chat-item-time">
                            <small>12:30 PM</small>
                            <div className="chat-item-icons">
                              <i className="fa-solid fa-check-double green-check"></i>
                            </div>
                          </div>
                        </div>
                        <p className="chat-item-message">
                          <i className="fa-solid fa-microphone" style={{ marginRight: '4px' }}></i>Audio
                        </p>
                      </div>
                    </a>
                    <a href="javascript:void(0);" className="chat-item">
                      <div className="chat-item-avatar">
                        <img src="/assets/img/doctors-dashboard/profile-02.jpg" alt="Avatar" />
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h5 className="chat-item-name">Dr Shanta Neill</h5>
                          <div className="chat-item-time">
                            <small>Yesterday</small>
                          </div>
                        </div>
                        <p className="chat-item-message" style={{ color: '#f44336' }}>
                          <i className="fa-solid fa-phone-flip" style={{ marginRight: '4px' }}></i>Missed Call
                        </p>
                      </div>
                    </a>
                    <a href="javascript:void(0);" className="chat-item">
                      <div className="chat-item-avatar">
                        <img src="/assets/img/doctors-dashboard/profile-07.jpg" alt="Avatar" />
                        <span className="online-dot"></span>
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h5 className="chat-item-name">Peter Anderson</h5>
                          <div className="chat-item-time">
                            <small>23/03/24</small>
                            <div className="chat-item-icons">
                              <i className="fa-solid fa-check"></i>
                            </div>
                          </div>
                        </div>
                        <p className="chat-item-message">Have you called them?</p>
                      </div>
                    </a>
                    <a href="javascript:void(0);" className="chat-item">
                      <div className="chat-item-avatar">
                        <img src="/assets/img/doctors-dashboard/profile-06.jpg" alt="Avatar" />
                      </div>
                      <div className="chat-item-content">
                        <div className="chat-item-header">
                          <h5 className="chat-item-name">Anderea Kearns</h5>
                          <div className="chat-item-time">
                            <small>20/03/24</small>
                            <div className="chat-item-icons">
                              <i className="fa-solid fa-check-double"></i>
                            </div>
                          </div>
                        </div>
                        <p className="chat-item-message">
                          <i className="fa-solid fa-image" style={{ marginRight: '4px' }}></i>Photo
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Area - Chat Details */}
              <div className="chat-details-area">
                <div className="chat-details-header">
                  <div className="chat-details-user">
                    <div className="chat-details-avatar">
                      <img src="/assets/img/doctors-dashboard/profile-06.jpg" alt="User" />
                      <span className="online-dot"></span>
                    </div>
                    <div className="chat-details-user-info">
                      <h5>Anderea Kearns</h5>
                      <small>Online</small>
                    </div>
                  </div>
                  <div className="chat-details-actions">
                    <button type="button" title="Search">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <button type="button" title="More options">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                  </div>
                </div>

                <div className="chat-messages-area">
                  {/* Date Separator */}
                  <div className="chat-date-separator">
                    <span>Today, March 25</span>
                  </div>

                  {/* Incoming Message */}
                  <div className="chat-message incoming">
                    <div className="chat-message-avatar">
                      <img src="/assets/img/doctors-dashboard/doctor-profile-img.jpg" alt="Avatar" />
                    </div>
                    <div className="chat-message-content">
                      <div className="chat-message-header">
                        <h6>Edalin Hendry</h6>
                        <span>9:45 AM</span>
                        <i className="fa-solid fa-check-double green-check"></i>
                      </div>
                      <div className="chat-message-bubble">
                        <div className="audio-message">
                          <button>
                            <i className="fa-solid fa-play" style={{ fontSize: '10px' }}></i>
                          </button>
                          <div className="audio-waveform"></div>
                          <span style={{ fontSize: '12px', color: '#666' }}>0:05</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Outgoing Message */}
                  <div className="chat-message outgoing">
                    <div className="chat-message-avatar">
                      <img src="/assets/img/doctors-dashboard/profile-06.jpg" alt="Avatar" />
                    </div>
                    <div className="chat-message-content">
                      <div className="chat-message-header" style={{ justifyContent: 'flex-end' }}>
                        <h6>Andrea Kearns</h6>
                        <span>9:47 AM</span>
                      </div>
                      <div className="chat-message-bubble">
                        <a href="javascript:void(0);" style={{ display: 'block', marginBottom: '8px' }}>
                          https://www.youtube.com/watch?v=GCmL3mS0Psk
                        </a>
                        <img src="/assets/img/sending-img.jpg" alt="Shared image" style={{ width: '345px', height: '126px', objectFit: 'cover' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input Area */}
                <div className="chat-input-area">
                  <div className="chat-input-actions">
                    <button type="button" title="More options">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <button type="button" title="Emoji">
                      <i className="fa-regular fa-face-smile"></i>
                    </button>
                    <button type="button" title="Voice message">
                      <i className="fa-solid fa-microphone"></i>
                    </button>
                  </div>
                  <input type="text" className="chat-input-field" placeholder="Type your message here..." />
                  <button type="button" className="chat-send-button" title="Send">
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DoctorChat
