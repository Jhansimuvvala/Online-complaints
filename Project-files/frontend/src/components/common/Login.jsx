import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Footer from './FooterC';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 50);
  }, []);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/Login", user);
      const userData = res.data;
      localStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true);
      alert("Successfully logged in");

      switch (userData.userType?.toLowerCase()) {
        case "admin":
          navigate("/AdminHome"); break;
        case "ordinary":
          navigate("/HomePage"); break;
        case "agent":
          navigate("/AgentHome"); break;
        default:
          navigate("/Login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar bg="light" variant="light" className="border-bottom shadow-sm">
        <Container>
          <Navbar.Brand className="fw-bold">ComplaintCare</Navbar.Brand>
          <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
            {["/", "/signup", "/login"].map((path, idx) => (
              <li className="nav-item" key={idx}>
                <Link to={path} className="nav-link text-muted">
                  {path === "/" ? "Home" : path.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Navbar>

      <section
        style={{
          background: 'linear-gradient(to bottom, #f1f5f9, #ffffff)',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px'
        }}
      >
        <div
          className="card shadow rounded-4"
          style={{
            width: '100%',
            maxWidth: '500px',
            backgroundColor: '#ffffffdd',
            border: '1px solid #dee2e6',
            transform: animate ? 'translateY(0)' : 'translateY(30px)',
            opacity: animate ? 1 : 0,
            transition: 'all 0.6s ease'
          }}
        >
          <div className="card-body p-4">
            <h3 className="text-center mb-3 fw-light">Welcome Back</h3>
            <p className="text-muted text-center mb-4">Please log in to continue</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your password"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="d-grid">
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
                  Login
                </button>
              </div>
            </form>

            <p className="text-center text-muted mt-4 mb-0">
              Don’t have an account?{" "}
              <Link to="/SignUp" className="text-decoration-none">Sign up</Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Login;