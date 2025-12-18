const AvailableTimings = () => {
  return (
    <>
      <div className="dashboard-header">
        <h3>Available Timings</h3>
      </div>

      <div className="appointment-tabs">
        <ul className="nav available-nav">
          <li className="nav-item" role="presentation">
            <a className="nav-link active" href="#" data-bs-toggle="tab" data-bs-target="#general-availability">General Availability</a>
          </li>
          <li className="nav-item" role="presentation">
            <a className="nav-link" href="#" data-bs-toggle="tab" data-bs-target="#clinic-availability">Clinic Availability</a>
          </li>
        </ul>
      </div>
      <div className="tab-content pt-0 timing-content">
        {/* General Availability */}
        <div className="tab-pane fade show active" id="general-availability">
          <div className="card custom-card">
            <div className="card-body">
              <div className="card-header">
                <h3>Select Available Slots</h3>
              </div>

              <div className="available-tab">
                <label className="form-label">Select Available days</label>
                <ul className="nav">
                  <li>
                    <a href="#" className="active" data-bs-toggle="tab" data-bs-target="#monday">Monday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#tuesday">Tuesday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#wednesday">Wednesday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#thursday">Thursday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#friday">Friday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#saturday">Saturday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#sunday">Sunday</a>
                  </li>
                </ul>
              </div>

              <div className="tab-content pt-0">
                {/* Slot */}
                <div className="tab-pane active show" id="monday">
                  <div className="slot-box">
                    <div className="slot-header">
                      <h5>Monday</h5>
                      <ul>
                        <li>
                          <a href="#" className="add-slot" data-bs-toggle="modal" data-bs-target="#add_slot">Add Slots</a>
                        </li>
                        <li>
                          <a href="#" className="del-slot" data-bs-toggle="modal" data-bs-target="#delete_slot">Delete All</a>
                        </li>
                      </ul>
                    </div>
                    <div className="slot-body">
                      <ul className="time-slots">
                        <li><i className="isax isax-clock"></i>09:00 AM</li>
                        <li><i className="isax isax-clock"></i>09:30 AM</li>
                        <li><i className="isax isax-clock"></i>10:00 AM</li>
                        <li><i className="isax isax-clock"></i>10:30 AM</li>
                        <li><i className="isax isax-clock"></i>11:00 AM</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* /Slot */}

                {/* Slot */}
                <div className="tab-pane fade" id="tuesday">
                  <div className="slot-box">
                    <div className="slot-header">
                      <h5>Tuesday</h5>
                      <ul>
                        <li>
                          <a href="#" className="add-slot" data-bs-toggle="modal" data-bs-target="#add_slot">Add Slots</a>
                        </li>
                        <li>
                          <a href="#" className="del-slot" data-bs-toggle="modal" data-bs-target="#delete_slot">Delete All</a>
                        </li>
                      </ul>
                    </div>
                    <div className="slot-body">
                      <p>No Slots Available</p>
                    </div>
                  </div>
                </div>
                {/* /Slot */}

                {/* Slot */}
                <div className="tab-pane fade" id="wednesday">
                  <div className="slot-box">
                    <div className="slot-header">
                      <h5>Wednesday</h5>
                      <ul>
                        <li>
                          <a href="#" className="add-slot" data-bs-toggle="modal" data-bs-target="#add_slot">Add Slots</a>
                        </li>
                        <li>
                          <a href="#" className="del-slot" data-bs-toggle="modal" data-bs-target="#delete_slot">Delete All</a>
                        </li>
                      </ul>
                    </div>
                    <div className="slot-body">
                      <p>No Slots Available</p>
                    </div>
                  </div>
                </div>
                {/* /Slot */}

                {/* Slot */}
                <div className="tab-pane fade" id="thursday">
                  <div className="slot-box">
                    <div className="slot-header">
                      <h5>Thursday</h5>
                      <ul>
                        <li>
                          <a href="#" className="add-slot" data-bs-toggle="modal" data-bs-target="#add_slot">Add Slots</a>
                        </li>
                        <li>
                          <a href="#" className="del-slot" data-bs-toggle="modal" data-bs-target="#delete_slot">Delete All</a>
                        </li>
                      </ul>
                    </div>
                    <div className="slot-body">
                      <p>No Slots Available</p>
                    </div>
                  </div>
                </div>
                {/* /Slot */}

                {/* Slot */}
                <div className="tab-pane fade" id="friday">
                  <div className="slot-box">
                    <div className="slot-header">
                      <h5>Friday</h5>
                      <ul>
                        <li>
                          <a href="#" className="add-slot" data-bs-toggle="modal" data-bs-target="#add_slot">Add Slots</a>
                        </li>
                        <li>
                          <a href="#" className="del-slot" data-bs-toggle="modal" data-bs-target="#delete_slot">Delete All</a>
                        </li>
                      </ul>
                    </div>
                    <div className="slot-body">
                      <p>No Slots Available</p>
                    </div>
                  </div>
                </div>
                {/* /Slot */}

                {/* Slot */}
                <div className="tab-pane fade" id="saturday">
                  <div className="slot-box">
                    <div className="slot-header">
                      <h5>Saturday</h5>
                      <ul>
                        <li>
                          <a href="#" className="add-slot" data-bs-toggle="modal" data-bs-target="#add_slot">Add Slots</a>
                        </li>
                        <li>
                          <a href="#" className="del-slot" data-bs-toggle="modal" data-bs-target="#delete_slot">Delete All</a>
                        </li>
                      </ul>
                    </div>
                    <div className="slot-body">
                      <p>No Slots Available</p>
                    </div>
                  </div>
                </div>
                {/* /Slot */}

                {/* Slot */}
                <div className="tab-pane fade" id="sunday">
                  <div className="slot-box">
                    <div className="slot-header">
                      <h5>Sunday</h5>
                      <ul>
                        <li>
                          <a href="#" className="add-slot" data-bs-toggle="modal" data-bs-target="#add_slot">Add Slots</a>
                        </li>
                        <li>
                          <a href="#" className="del-slot" data-bs-toggle="modal" data-bs-target="#delete_slot">Delete All</a>
                        </li>
                      </ul>
                    </div>
                    <div className="slot-body">
                      <p>No Slots Available</p>
                    </div>
                  </div>
                </div>
                {/* /Slot */}

                <div className="form-wrap">
                  <label className="col-form-label">Appointment Fees ($)</label>
                  <input type="text" className="form-control" defaultValue="254" />
                </div>
                <div className="modal-btn text-end">
                  <a href="#" className="btn btn-gray" data-bs-toggle="modal" data-bs-dismiss="modal">Cancel</a>
                  <button className="btn btn-primary prime-btn">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /General Availability */}

        {/* Clinic Availability */}
        <div className="tab-pane fade" id="clinic-availability">
          <div className="clinic-wrap">
            <h5>Select Clinic</h5>
            <div className="row">
              <div className="col-md-6">
                <select className="select-img">
                  <option data-image="assets/img/doctors-dashboard/clinic-01.jpg">The Family Dentistry Clinic</option>
                  <option data-image="assets/img/doctors-dashboard/clinic-02.jpg">Dentistry Clinic</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card custom-card">
            <div className="card-body">
              <div className="card-header">
                <h3>Select Available Slots</h3>
              </div>

              <div className="available-tab">
                <label className="form-label">Select Available days</label>
                <ul className="nav">
                  <li>
                    <a href="#" className="active" data-bs-toggle="tab" data-bs-target="#monday-slot">Monday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#tuesday-slot">Tuesday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#wednesday-slot">Wedneday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#thursday-slot">Thursday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#friday-slot">Friday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#saturday-slot">Saturday</a>
                  </li>
                  <li>
                    <a href="#" data-bs-toggle="tab" data-bs-target="#sunday-slot">Sunday</a>
                  </li>
                </ul>
              </div>

              <div className="tab-content pt-0">
                {/* Slot */}
                <div className="tab-pane active show" id="monday-slot">
                  <div className="slot-box">
                    <div className="slot-header">
                      <h5>Monday</h5>
                      <ul>
                        <li>
                          <a href="#" className="add-slot" data-bs-toggle="modal" data-bs-target="#add_slot">Add Slots</a>
                        </li>
                        <li>
                          <a href="#" className="del-slot" data-bs-toggle="modal" data-bs-target="#delete_slot">Delete All</a>
                        </li>
                      </ul>
                    </div>
                    <div className="slot-body">
                      <ul className="time-slots">
                        <li><i className="isax isax-clock"></i>09:00 AM</li>
                        <li><i className="isax isax-clock"></i>09:30 AM</li>
                        <li className="slot-space">Space : 2</li>
                        <li><i className="isax isax-clock"></i>10:30 AM</li>
                        <li><i className="isax isax-clock"></i>11:00 AM</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* /Slot */}

                {/* Other day slots would continue here with same structure */}
                <div className="tab-pane fade" id="tuesday-slot">
                  <div className="slot-box">
                    <div className="slot-header">
                      <h5>Tuesday</h5>
                      <ul>
                        <li>
                          <a href="#" className="add-slot" data-bs-toggle="modal" data-bs-target="#add_slot">Add Slots</a>
                        </li>
                        <li>
                          <a href="#" className="del-slot" data-bs-toggle="modal" data-bs-target="#delete_slot">Delete All</a>
                        </li>
                      </ul>
                    </div>
                    <div className="slot-body">
                      <p>No Slots Available</p>
                    </div>
                  </div>
                </div>

                <div className="form-wrap">
                  <label className="col-form-label">Appointment Fees ($)</label>
                  <input type="text" className="form-control" defaultValue="254" />
                </div>
                <div className="modal-btn text-end">
                  <a href="#" className="btn btn-gray" data-bs-toggle="modal" data-bs-dismiss="modal">Cancel</a>
                  <button className="btn btn-primary prime-btn">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Clinic Availability */}
      </div>
    </>
  )
}

export default AvailableTimings

