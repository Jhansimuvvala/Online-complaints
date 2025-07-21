import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { Button } from 'react-bootstrap';
import ChatWindow from '../common/ChatWindow';
import Collapse from 'react-bootstrap/Collapse';

const Status = () => {
  const [toggle, setToggle] = useState({});
  const [statusCompliants, setStatusCompliants] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const { _id } = user;

    axios
      .get(`http://localhost:8000/status/${_id}`)
      .then((res) => setStatusCompliants(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleToggle = (complaintId) => {
    setToggle((prev) => ({
      ...prev,
      [complaintId]: !prev[complaintId]
    }));
  };

  return (
    <section
      style={{
        background: 'linear-gradient(to bottom, #f4f7fa, #ffffff)',
        minHeight: '100vh',
        padding: '30px 20px',
        fontFamily: 'Segoe UI, sans-serif'
      }}
    >
      <div className="container">
        <h4 className="mb-4 fw-light text-muted text-center">Your Complaint History</h4>
        <div className="d-flex flex-wrap justify-content-start gap-4">
          {statusCompliants.length > 0 ? (
            statusCompliants.map((complaint, index) => {
              const open = toggle[complaint._id] || false;
              return (
                <Card
                  key={index}
                  style={{
                    width: '22rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #dee2e6'
                  }}
                >
                  <Card.Body>
                    <Card.Title className="fw-semibold text-primary">{complaint.name}</Card.Title>
                    <Card.Text><strong>Address:</strong> {complaint.address}</Card.Text>
                    <Card.Text><strong>City:</strong> {complaint.city}</Card.Text>
                    <Card.Text><strong>State:</strong> {complaint.state}</Card.Text>
                    <Card.Text><strong>Pincode:</strong> {complaint.pincode}</Card.Text>
                    <Card.Text><strong>Description:</strong> {complaint.comment}</Card.Text>
                    <Card.Text className="text-muted"><strong>Status:</strong> {complaint.status}</Card.Text>

                    <div className="d-grid">
                      <Button
                        onClick={() => handleToggle(complaint._id)}
                        aria-controls={`collapse-${complaint._id}`}
                        aria-expanded={open}
                        variant="outline-primary"
                        size="sm"
                      >
                        {open ? 'Close Chat' : 'Open Chat'}
                      </Button>
                    </div>

                    <Collapse in={open} dimension="width">
                      <div className="mt-3">
                        <Card body style={{ borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                          <ChatWindow
                            key={complaint.complaintId}
                            complaintId={complaint._id}
                            name={complaint.name}
                          />
                        </Card>
                      </div>
                    </Collapse>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <Alert variant="light" className="w-100 text-center">
              <Alert.Heading>No complaints found</Alert.Heading>
              <p className="mb-0 text-muted">You haven’t registered any complaints yet.</p>
            </Alert>
          )}
        </div>
      </div>
    </section>
  );
};

export default Status;