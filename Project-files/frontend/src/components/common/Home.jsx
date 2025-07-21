import React, { useEffect, useState } from 'react';
import { Container, Navbar, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Image1 from '../../Images/Image1.png';
import Footer from './FooterC';

const Home = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    setTimeout(() => setFeaturesVisible(true), 400);
    setTimeout(() => setCtaVisible(true), 700);
  }, []);

  const interFont = {
    fontFamily: "'Inter', sans-serif"
  };

  return (
    <>
      <Navbar
        expand="lg"
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e4e6eb',
          padding: '14px 20px',
          ...interFont
        }}
      >
        <Container>
          <Navbar.Brand className="fw-bold text-primary fs-4">ComplaintCare</Navbar.Brand>
          <ul className="navbar-nav ms-auto d-flex flex-row gap-3 align-items-center mb-0">
            {['/', '/signup', '/login'].map((path, idx) => (
              <li className="nav-item" key={idx}>
                <Link to={path} className="nav-link px-3 py-2 rounded text-secondary" style={interFont}>
                  {path === '/' ? 'Home' : path.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Navbar>

      <section
        style={{
          background: 'linear-gradient(to bottom, #f7fafe, #ffffff)',
          padding: '60px 20px',
          textAlign: 'center',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.6s ease-out',
          ...interFont
        }}
      >
        <Container>
          <h1 className="fw-bold mb-3" style={{ fontSize: '2.7rem', color: '#2a2d34' }}>
            Welcome to ComplaintCare
          </h1>
          <p className="text-muted mb-4 fs-5">
            A peaceful space to raise issues and follow up without friction.
          </p>
          <img
            src={Image1}
            alt="Complaint registration illustration"
            className="img-fluid rounded shadow-sm mb-4"
            style={{
              maxHeight: '360px',
              objectFit: 'cover',
              transform: heroVisible ? 'scale(1)' : 'scale(0.96)',
              transition: 'transform 0.5s ease'
            }}
          />
          <Link to="/login">
            <Button
              variant="primary"
              size="lg"
              className="rounded-pill px-4"
              style={{ transition: 'transform 0.2s ease-in-out', ...interFont }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Register a Complaint
            </Button>
          </Link>
        </Container>
      </section>

      <section
        style={{
          backgroundColor: '#f8f9fa',
          padding: '40px 20px',
          opacity: featuresVisible ? 1 : 0,
          transform: featuresVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.6s ease-out',
          ...interFont
        }}
      >
        <Container>
          <Row className="g-4">
            {[
              {
                title: 'User-Friendly',
                desc: 'Submit complaints in under a minute with a simple form.'
              },
              {
                title: 'Status Tracking',
                desc: 'Monitor progress and responses in real-time.'
              },
              {
                title: 'Secure & Private',
                desc: 'Your data is protected with encrypted storage.'
              }
            ].map((feature, idx) => (
              <Col md={4} key={idx}>
                <Card className="h-100 shadow-sm border-0 text-center">
                  <Card.Body>
                    <h5 className="fw-bold mb-2">{feature.title}</h5>
                    <p className="text-muted">{feature.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section
        style={{
          padding: '50px 20px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e4e6ea',
          textAlign: 'center',
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.6s ease-out',
          ...interFont
        }}
      >
        <Container>
          <h3 className="fw-light text-muted mb-3">Have something to say?</h3>
          <Link to="/signup">
            <Button
              variant="outline-primary"
              size="lg"
              className="rounded-pill px-4"
              style={{ transition: 'transform 0.2s ease', ...interFont }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Create Your Account
            </Button>
          </Link>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Home;