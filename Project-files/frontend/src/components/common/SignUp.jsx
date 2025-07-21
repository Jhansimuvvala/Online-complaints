import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Footer from './FooterC';

const SignUp = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Select User");
  const [user, setUser] = useState({ name: "", email: "", password: "", phone: "", userType: "" });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 50);
  }, []);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const handleTitle = (role) => {
    setTitle(role);
    setUser(prev => ({ ...prev, userType: role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "Select User") return alert("Please select a user type.");
    try {
      await axios.post("http://localhost:8000/SignUp", { ...user, userType: title });
      alert("Registration successful!");
      navigate("/Login");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar bg="light" variant="light" className="border-bottom shadow-sm">
        <Container>
          <Navbar.Brand className="fw-bold">ComplaintCare</Navbar.Brand>
          <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
            {["/", "/signup", "/login"].map((path, i) => (
              <li className="nav-item" key={i}>
                <Link to={path} className="nav-link text-muted">
                  {path === "/" ? "Home" : path.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Navbar>

      <section style={{
        background: 'linear-gradient(to bottom, #eef2f7, #ffffff)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px'
      }}>
        <div
          className="card shadow rounded-4"
          style={{
            width: '100%',
            maxWidth: '500px',
            backgroundColor: '#ffffffee',
            border: '1px solid #dee2e6',
            transform: animate ? 'translateY(0)' : 'translateY(30px)',
            opacity: animate ? 1 : 0,
            transition: 'all 0.6s ease'
          }}
        >
          <div className="card-body p-4">
            <h3 className="text-center mb-3 fw-light">Create Your Account</h3>
            <form onSubmit={handleSubmit}>
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Password", name: "password", type: "password" },
                { label: "Mobile No.", name: "phone", type: "tel" }
              ].map((field, idx) => (
                <div className="mb-3" key={idx}>
                  <label className="form-label">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={user[field.name]}
                    onChange={handleChange}
                    className="form-control"
                    style={{
                      transition: 'box-shadow 0.2s',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
              ))}

              <div className="mb-3">
                <label className="form-label">Select User Type</label>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary">{title}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {["Ordinary", "Admin", "Agent"].map((role, idx) => (
                      <Dropdown.Item key={idx} onClick={() => handleTitle(role)}>
                        {role}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="d-grid mt-4">
                <button
                  type="submit"
                  className="btn btn-outline-primary btn-lg"
                  style={{
                    transition: 'transform 0.2s ease-in-out',
                    willChange: 'transform'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Sign Up
                </button>
              </div>
            </form>

            <p className="text-center text-muted mt-4">
              Already have an account?{" "}
              <Link to="/Login" className="text-decoration-none">Log in</Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default SignUp;