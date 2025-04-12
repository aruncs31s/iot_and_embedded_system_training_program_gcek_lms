import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { FaGraduationCap, FaUsers, FaChartBar } from 'react-icons/fa';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const location = useLocation();
  
  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3} lg={2} className="mb-4">
          <Card bg={theme === 'dark' ? 'dark' : 'light'} text={theme === 'dark' ? 'light' : 'dark'}>
            <Card.Header>
              <h5 className="mb-0">Admin Panel</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav className="flex-column">
                <Nav.Link 
                  as={Link} 
                  to="/admin" 
                  active={location.pathname === '/admin'}
                  className="d-flex align-items-center px-3 py-2"
                >
                  <FaChartBar className="me-2" /> Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/admin/courses" 
                  active={location.pathname.includes('/admin/courses')}
                  className="d-flex align-items-center px-3 py-2"
                >
                  <FaGraduationCap className="me-2" /> Courses
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/admin/users" 
                  active={location.pathname.includes('/admin/users')}
                  className="d-flex align-items-center px-3 py-2"
                >
                  <FaUsers className="me-2" /> Users
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
          
          <Card 
            bg={theme === 'dark' ? 'dark' : 'light'} 
            text={theme === 'dark' ? 'light' : 'dark'}
            className="mt-3"
          >
            <Card.Body>
              <div className="d-flex align-items-center">
                <div 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: theme === 'dark' ? '#495057' : '#e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px'
                  }}
                >
                  {userProfile?.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt="Admin" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '1.2rem' }}>👤</span>
                  )}
                </div>
                <div>
                  <h6 className="mb-0">{userProfile?.full_name || 'Admin'}</h6>
                  <small className="text-muted">Administrator</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9} lg={10}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
