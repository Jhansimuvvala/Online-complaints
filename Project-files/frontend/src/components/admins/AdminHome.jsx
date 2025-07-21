import React, { useEffect, useState } from 'react';
import { Button, Container, Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

import UserInfo from './UserInfo';
import AccordionAdmin from './AccordionAdmin';
import AgentInfo from './AgentInfo';

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setUserName(user.name);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleNavClick = (component) => setActiveComponent(component);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const contentMap = {
    dashboard: <AccordionAdmin />,
    UserInfo: <UserInfo />,
    Agent: <AgentInfo />
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '240px',
          background: '#f5f7fa',
          padding: '30px 20px',
          borderRight: '1px solid #e5e9ef',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <h5 className="text-muted fw-semibold mb-4">Admin {userName}</h5>
          <Nav className="flex-column">
            {[
              { label: 'Dashboard', key: 'dashboard' },
              { label: 'Users', key: 'UserInfo' },
              { label: 'Agents', key: 'Agent' }
            ].map((item) => (
              <NavLink
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`nav-link mb-2 px-3 py-2 rounded ${
                  activeComponent === item.key ? 'bg-primary text-white' : 'text-secondary'
                }`}
                style={{ fontWeight: 500, cursor: 'pointer' }}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline-danger"
          size="sm"
          className="rounded-pill"
        >
          Log Out
        </Button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: '40px 30px',
          background: 'linear-gradient(to bottom, #f7f9fb, #ffffff)',
          overflowY: 'auto'
        }}
      >
        <Container fluid>
          {contentMap[activeComponent]}
        </Container>
      </div>
    </div>
  );
};

export default AdminHome;