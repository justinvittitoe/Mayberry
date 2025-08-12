import React from 'react';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import AdminPlanManager from '../components/AdminPlanManager';
import AdminOptionsManager from '../components/AdminOptionsManager';
import AdminInteriorPackagesManager from '../components/AdminInteriorPackagesManager';
import AdminLotPremiumsManager from '../components/AdminLotPremiumsManager';
import AuthService from '../utils/auth';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  // Check if user is admin
  const isAdmin = AuthService.loggedIn() && AuthService.getRole() === 'admin';

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <Container>
          <Row>
            <Col>
              <h1 className="display-6 fw-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-white-50 mb-0">Manage floor plans, options, and application settings</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Tab.Container defaultActiveKey="plans">
          <Row>
            <Col lg={3}>
              <Nav variant="pills" className="flex-column admin-nav">
                <Nav.Item>
                  <Nav.Link eventKey="plans">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                      <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                    </svg>
                    Floor Plans
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="options">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    Options
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="interiors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                      <path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/>
                    </svg>
                    Interior Packages
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="lots">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Lot Premiums
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            
            <Col lg={9}>
              <Tab.Content>
                <Tab.Pane eventKey="plans">
                  <AdminPlanManager />
                </Tab.Pane>
                
                <Tab.Pane eventKey="options">
                  <AdminOptionsManager />
                </Tab.Pane>
                
                <Tab.Pane eventKey="interiors">
                  <AdminInteriorPackagesManager />
                </Tab.Pane>
                
                <Tab.Pane eventKey="lots">
                  <AdminLotPremiumsManager />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AdminDashboard;