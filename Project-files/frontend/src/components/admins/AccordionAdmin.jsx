import React, { useEffect, useState } from 'react';
import {
  Card,
  Dropdown,
  Alert,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import Footer from '../common/FooterC';
import axios from 'axios';

const PanelGridAdmin = () => {
  const [complaintList, setComplaintList] = useState([]);
  const [agentList, setAgentList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaints, agents] = await Promise.all([
          axios.get('http://localhost:8000/status'),
          axios.get('http://localhost:8000/AgentUsers')
        ]);
        setComplaintList(complaints.data);
        setAgentList(agents.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async (agentId, complaintId, status, agentName) => {
    try {
      await axios.post('http://localhost:8000/assignedComplaints', {
        agentId,
        complaintId,
        status,
        agentName
      });
      setComplaintList(prev => prev.filter(c => c._id !== complaintId));
      alert(`Assigned to ${agentName}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <section
        style={{
          background: 'linear-gradient(to bottom, #f5f7fa, #ffffff)',
          minHeight: '100vh',
          padding: '40px 20px',
          fontFamily: 'Segoe UI, sans-serif'
        }}
      >
        <Container>
          {/* Complaints Panel */}
          <h5 className="mb-4 text-muted fw-semibold">Pending Complaints</h5>
          <Row className="g-4 mb-5">
            {complaintList.length > 0 ? (
              complaintList.map((complaint, idx) => (
                <Col md={6} lg={4} key={idx}>
                  <Card
                    style={{
                      backgroundColor: '#fff',
                      border: '1px solid #dee2e6',
                      borderRadius: '14px',
                      boxShadow: '0 1px 10px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <Card.Body>
                      <Card.Title className="text-primary text-center">{complaint.name}</Card.Title>
                      <div className="text-muted small mt-3">
                        <p><strong>City:</strong> {complaint.city}</p>
                        <p><strong>State:</strong> {complaint.state}</p>
                        <p><strong>Pincode:</strong> {complaint.pincode}</p>
                        <p><strong>Status:</strong> {complaint.status}</p>
                      </div>
                      <p className="text-muted small"><strong>Comment:</strong> {complaint.comment}</p>
                      {complaint.status !== 'completed' && (
                        <Dropdown>
                          <Dropdown.Toggle
                            size="sm"
                            className="rounded-pill w-100 mt-3"
                            variant="outline-primary"
                          >
                            Assign to Agent
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {agentList.map((agent, i) => (
                              <Dropdown.Item
                                key={i}
                                onClick={() =>
                                  handleAssign(agent._id, complaint._id, complaint.status, agent.name)
                                }
                              >
                                {agent.name}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Alert variant="light" className="text-center">
                  No complaints pending.
                </Alert>
              </Col>
            )}
          </Row>

          {/* Agents Panel */}
          <h5 className="mb-4 text-muted fw-semibold">Available Agents</h5>
          <Row className="g-4">
            {agentList.length > 0 ? (
              agentList.map((agent, idx) => (
                <Col md={6} lg={4} key={idx}>
                  <Card
                    style={{
                      backgroundColor: '#ffffffee',
                      borderRadius: '14px',
                      border: '1px solid #dee2e6',
                      boxShadow: '0 1px 10px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Card.Body>
                      <Card.Title className="text-primary">{agent.name}</Card.Title>
                      <Card.Text className="text-muted small">{agent.email}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Alert variant="light" className="text-center">
                  No registered agents found.
                </Alert>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default PanelGridAdmin;