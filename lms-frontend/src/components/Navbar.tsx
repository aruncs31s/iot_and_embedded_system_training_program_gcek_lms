import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';

function NavbarComponent() {
  const { theme } = useTheme();
  const { user, userProfile, signOut } = useAuth();

  // Log user state changes
  useEffect(() => {
    // console.log('Navbar user state changed:', user);
    // console.log('Navbar userProfile state:', userProfile);
  }, [user, userProfile]);

  const handleLogout = async () => {
    console.log('Logout clicked');
    try {
      const { error } = await signOut();

      // if (error) {
      //   console.error('Error during logout:', error);
      // }

      // console.log('Logout completed');
      // Force a page reload to ensure all state is reset
      window.location.href = '/';
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      // Still redirect to home page
      window.location.href = '/';
    }
  };

  return (
    <BootstrapNavbar
      expand="lg"
      bg={theme === 'dark' ? 'dark' : 'light'}
      variant={theme === 'dark' ? 'dark' : 'light'}
      className="mb-2"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">GCEK LMS</BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto fixed w-full bg-black/30 backdrop-blur-md border-b border-white/10 z-50">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/">Courses</Nav.Link>
            <NavDropdown title="Resources" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Documentation</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">FAQ</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Support</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">About</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="d-flex align-items-center">
            <ThemeToggle />
            {user ? (
              <NavDropdown
                title={<span>👤 {userProfile?.full_name || user.email?.split('@')[0] || 'User'}</span>}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                {userProfile?.is_admin && (
                  <NavDropdown.Item as={Link} to="/admin">Admin Dashboard</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <Button variant="outline-primary" size="sm" className="me-2">Login</Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default NavbarComponent;
