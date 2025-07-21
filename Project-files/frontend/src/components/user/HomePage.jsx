import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Footer from '../common/FooterC';
import Complaint from '../user/Complaint';
import Status from '../user/Status';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('Complaint');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUserName(user.name);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [navigate]);

  const handleNavLinkClick = (componentName) => setActiveComponent(componentName);

  const Logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: '#fdfdfd',
          borderBottom: '1px solid #dee2e6',
          fontFamily: 'Segoe UI, sans-serif'
        }}
      >
        <div className="container-fluid d-flex align-items-center justify-content-between px-4">
          <h4 className="mb-0 fw-light text-secondary">Hi, {userName}</h4>

          <ul className="navbar-nav d-flex flex-row gap-3 align-items-center mb-0">
            <li className="nav-item">
              <NavLink
                className={`nav-link px-3 py-2 rounded ${activeComponent === 'Complaint' ? 'bg-light border text-primary' : 'text-muted'}`}
                onClick={() => handleNavLinkClick('Complaint')}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
              >
                Complaint Register
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link px-3 py-2 rounded ${activeComponent === 'Status' ? 'bg-light border text-primary' : 'text-muted'}`}
                onClick={() => handleNavLinkClick('Status')}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
              >
                Status
              </NavLink>
            </li>
          </ul>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={Logout}
            style={{ borderRadius: '20px', padding: '6px 16px' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <section
        style={{
          background: 'linear-gradient(to bottom, #f3f6f9, #ffffff)',
          minHeight: 'calc(100vh - 120px)',
          padding: '30px 20px'
        }}
      >
        <div className="container">
          {activeComponent === 'Complaint' && <Complaint />}
          {activeComponent === 'Status' && <Status />}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;