import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Button,
  Collapse,
  Form,
  Row,
  Col,
  Alert
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../common/FooterC';
import axios from 'axios';

const AgentInfo = () => {
  const navigate = useNavigate();
  const [agentList, setAgentList] = useState([]);
  const [toggle, setToggle] = useState({});
  const [updateAgent, setUpdateAgent] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const getAgents = async () => {
      try {
        const res = await axios.get('http://localhost:8000/agentUsers');
        setAgentList(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getAgents();
  }, [navigate]);

  const handleToggle = (id) =>
    setToggle((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleChange = (e) =>
    setUpdateAgent({ ...updateAgent, [e.target.name]: e.target.value });

  const handleSubmit = async (id) => {
    if (!updateAgent.name && !updateAgent.email && !updateAgent.phone) {
      return alert('Please fill in at least one field.');
    }

    const confirm = window.confirm('Update this agent?');
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:8000/user/${id}`, updateAgent);
      alert('Agent updated.');
      setUpdateAgent({ name: '', email: '', phone: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Delete this agent?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8000/OrdinaryUsers/${id}`);
      setAgentList((prev) => prev.filter((agent) => agent._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <section
        style={{
          background: 'linear-gradient(to bottom, #f6f9fb, #ffffff)',
          minHeight: '100vh',
          padding: '50px 20px',
          fontFamily: 'Segoe UI, sans-serif'
        }}
      >
        <Container>
          <h4 className="text-center text-muted fw-light mb-4">
            Manage Your Agents
          </h4>

          <Row className="g-4">
            {agentList.length > 0 ? (
              agentList.map((agent) => {
                const open = toggle[agent._id] || false;

                return (
                  <Col md={6} lg={4} key={agent._id}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                      <Card.Body>
                        <Card.Title className="fw-semibold text-primary mb-1">
                          {agent.name}
                        </Card.Title>
                        <Card.Text className="text-muted mb-2 small">{agent.email}</Card.Text>
                        <Card.Text className="text-muted mb-3 small">{agent.phone}</Card.Text>

                        <div className="d-flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline-warning"
                            className="rounded-pill"
                            onClick={() => handleToggle(agent._id)}
                          >
                            {open ? 'Cancel' : 'Update'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="rounded-pill"
                            onClick={() => handleDelete(agent._id)}
                          >
                            Delete
                          </Button>
                        </div>

                        <Collapse in={open}>
                          <div className="mt-4 border-top pt-3">
                            <Form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(agent._id);
                              }}
                            >
                              <Form.Group className="mb-3">
                                <Form.Label className="text-muted small">Full Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={updateAgent.name}
                                  onChange={handleChange}
                                  placeholder="Enter name"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label className="text-muted small">Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  value={updateAgent.email}
                                  onChange={handleChange}
                                  placeholder="Enter email"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label className="text-muted small">Phone</Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="phone"
                                  value={updateAgent.phone}
                                  onChange={handleChange}
                                  placeholder="Enter phone"
                                />
                              </Form.Group>
                              <div className="text-end">
                                <Button
                                  type="submit"
                                  size="sm"
                                  variant="outline-success"
                                  className="rounded-pill"
                                >
                                  Submit
                                </Button>
                              </div>
                            </Form>
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
                  No agents to display.
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

export default AgentInfo;