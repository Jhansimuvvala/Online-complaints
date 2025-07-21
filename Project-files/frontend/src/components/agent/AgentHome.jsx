import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Nav,
  Navbar,
  Card,
  Alert,
  Collapse,
  Row,
  Col
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatWindow from '../common/ChatWindow';
import Footer from '../common/FooterC';

const AgentHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [toggle, setToggle] = useState({});
  const [agentComplaintList, setAgentComplaintList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const { _id, name } = user;
          setUserName(name);
          const res = await axios.get(`http://localhost:8000/allcomplaints/${_id}`);
          setAgentComplaintList(res.data);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [navigate]);

  const handleStatusChange = async (id) => {
    try {
      await axios.put(`http://localhost:8000/complaint/${id}`, { status: 'completed' });
      setAgentComplaintList(prev =>
        prev.map(c =>
          c.complaintId === id
            ? { ...c, status: 'completed' }
            : c
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = (id) => {
    setToggle(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const LogOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <Navbar bg="light" className="border-bottom shadow-sm px-4">
        <Navbar.Brand className="fw-semibold text-muted">
          Welcome, Agent {userName}
        </Navbar.Brand>
        <Nav className="ms-auto">
          <NavLink className="nav-link text-muted">Assigned Complaints</NavLink>
        </Nav>
        <Button onClick={LogOut} variant="outline-danger" size="sm" className="rounded-pill ms-3">
          Log out
        </Button>
      </Navbar>

      <section
        style={{
          background: 'linear-gradient(to bottom, #f6f9fc, #ffffff)',
          minHeight: '100vh',
          padding: '30px 20px'
        }}
      >
        <Container>
          <h4 className="text-center text-muted fw-light mb-4">
            Complaints Assigned to You
          </h4>

          <Row className="g-4">
            {agentComplaintList.length > 0 ? (
              agentComplaintList.map((complaint, i) => {
                const open = toggle[complaint.complaintId] || false;
                return (
                  <Col md={6} lg={4} key={i}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: '16px' }}>
                      <Card.Body>
                        <h6 className="fw-bold text-primary mb-2">{complaint.name}</h6>
                        <div className="mb-2 small text-muted">
                          <p><strong>City:</strong> {complaint.city || 'N/A'}</p>
                          <p><strong>State:</strong> {complaint.state || 'N/A'}</p>
                          <p><strong>Pincode:</strong> {complaint.pincode || 'N/A'}</p>
                          <p><strong>Status:</strong> {complaint.status || 'Pending'}</p>
                        </div>
                        <p className="mb-2">{complaint.comment || 'No description available'}</p>

                        <div className="d-flex flex-wrap gap-2">
                          {complaint.status !== 'completed' && (
                            <Button
                              onClick={() => handleStatusChange(complaint.complaintId)}
                              variant="outline-success"
                              size="sm"
                              className="rounded-pill"
                            >
                              Mark Completed
                            </Button>
                          )}
                          <Button
                            onClick={() => handleToggle(complaint.complaintId)}
                            variant="outline-primary"
                            size="sm"
                            className="rounded-pill"
                          >
                            {open ? 'Hide Chat' : 'Chat'}
                          </Button>
                        </div>

                        <Collapse in={open}>
                          <div className="mt-3">
                            <Card
                              body
                              style={{
                                borderRadius: '8px',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #dee2e6'
                              }}
                            >
                              <ChatWindow
                                key={complaint.complaintId}
                                complaintId={complaint.complaintId}
                                name={userName}
                              />
                            </Card>
                          </div>
                        </Collapse>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <Col>
                <Alert variant="light" className="text-center">
                  <Alert.Heading>No complaints found</Alert.Heading>
                  <p className="mb-0 text-muted">You're up to date, Agent.</p>
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

export default AgentHome;
