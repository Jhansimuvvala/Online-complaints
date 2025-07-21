import axios from 'axios';
import React, { useState } from 'react';

const Complaint = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [userComplaint, setUserComplaint] = useState({
    userId: user._id,
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: '',
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserComplaint({ ...userComplaint, [name]: value });
  };

  const handleClear = () => {
    setUserComplaint({
      userId: '',
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      status: '',
      comment: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id } = JSON.parse(localStorage.getItem('user'));

    try {
      const res = await axios.post(`http://localhost:8000/Complaint/${_id}`, userComplaint);
      JSON.stringify(res.data.userComplaint);
      alert('Your Complaint has been sent!');
      handleClear();
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };

  return (
    <section
      style={{
        background: 'linear-gradient(to bottom, #f4f7fa, #ffffff)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: 'Segoe UI, sans-serif'
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="row shadow-sm bg-white rounded-4 p-4"
        style={{
          maxWidth: '720px',
          width: '100%',
          border: '1px solid #dee2e6',
          backgroundColor: '#ffffffcc'
        }}
      >
        <h4 className="text-center mb-4 text-muted">Register a Complaint</h4>

        <div className="col-md-6 mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input name="name" value={userComplaint.name} onChange={handleChange} type="text" className="form-control" required />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input name="address" value={userComplaint.address} onChange={handleChange} type="text" className="form-control" required />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input name="city" value={userComplaint.city} onChange={handleChange} type="text" className="form-control" required />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="state" className="form-label">State</label>
          <input name="state" value={userComplaint.state} onChange={handleChange} type="text" className="form-control" required />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="pincode" className="form-label">Pincode</label>
          <input name="pincode" value={userComplaint.pincode} onChange={handleChange} type="text" className="form-control" required />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <input name="status" value={userComplaint.status} onChange={handleChange} type="text" placeholder="e.g. Pending" className="form-control" required />
        </div>

        <div className="col-12 mb-4">
          <label htmlFor="comment" className="form-label">Description</label>
          <textarea
            name="comment"
            value={userComplaint.comment}
            onChange={handleChange}
            className="form-control"
            rows="4"
            placeholder="Briefly describe your complaint"
            required
          ></textarea>
        </div>

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-outline-primary btn-lg">
            Submit Complaint
          </button>
        </div>
      </form>
    </section>
  );
};

export default Complaint;