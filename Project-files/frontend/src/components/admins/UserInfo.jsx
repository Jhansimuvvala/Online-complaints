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

const UserInfo = () => {
  const navigate = useNavigate();
  const [ordinaryList, setOrdinaryList] = useState([]);
  const [toggle, setToggle] = useState({});
  const [updateUser, setUpdateUser] = useState({ name: '', email: '', phone: '' });

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (id) => {
    if (!updateUser.name && !updateUser.email && !updateUser.phone) {
      alert('Please fill at least one field');
      return;
    }
    const confirmed = window.confirm('Are you sure you want to update this user?');
    if (!confirmed) return;

    try {
      await axios.put(`http://localhost:8000/user/${id}`, updateUser);
      alert('User updated successfully');
      setUpdateUser({ name: '', email: '', phone: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/OrdinaryUsers/${id}`);
      setOrdinaryList((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (id) => {
    setToggle((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/OrdinaryUsers');
        setOrdinaryList(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
  }, [navigate]);

  return (
    <>
      <section
        style={{
          background: 'linear-gradient(to bottom, #f6f8fa, #ffffff)',
          minHeight: '100vh',
          padding: '40px 20px',
          fontFamily: 'Segoe UI, sans-serif'
        }}
      >
        <Container>
          <h4 className="fw-light text-muted mb-4 text-center">Registered Users</h4>

          <Row className="g-4">
            {ordinaryList.length > 0 ? (
              ordinaryList.map((user) => {
                const open = toggle[user._id] || false;
                return (
                  <Col md={6} lg={4} key={user._id}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: '14px' }}>
                      <Card.Body>
                        <Card.Title className="text-primary fw-semibold mb-2">{user.name}</Card.Title>
                        <Card.Text className="text-muted small mb-1">{user.email}</Card.Text>
                        <Card.Text className="text-muted small mb-3">{user.phone}</Card.Text>

                        <div className="d-flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline-warning"
                            className="rounded-pill"
                            onClick={() => handleToggle(user._id)}
                          >
                            {open ? 'Cancel' : 'Update'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="rounded-pill"
                            onClick={() => deleteUser(user._id)}
                          >
                            Delete
                          </Button>
                        </div>

                        <Collapse in={open}>
                          <div className="mt-4 border-top pt-3">
                            <Form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(user._id);
                              }}
                            >
                              <Form.Group className="mb-3">
                                <Form.Label className="text-muted small">Full Name</Form.Label>
                                <Form.Control
                                  name="name"
                                  type="text"
                                  value={updateUser.name}
                                  onChange={handleChange}
                                  placeholder="Enter name"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label className="text-muted small">Email</Form.Label>
                                <Form.Control
                                  name="email"
                                  type="email"
                                  value={updateUser.email}
                                  onChange={handleChange}
                                  placeholder="Enter email"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label className="text-muted small">Phone</Form.Label>
                                <Form.Control
                                  name="phone"
                                  type="tel"
                                  value={updateUser.phone}
                                  onChange={handleChange}
                                  placeholder="Enter phone"
                                />
                              </Form.Group>
                              <div className="text-end">
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  type="submit"
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
                  No users to display
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

export default UserInfo;