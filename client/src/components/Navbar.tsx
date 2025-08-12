import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import AuthService from '../utils/auth';

const AppNavbar = () => {

  return (
      <Navbar bg='light' variant='light' expand='lg'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/'>
          🏠 Mayberry Home Builder
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              <Nav.Link as={Link} to='/'>
              View Plans
              </Nav.Link>
            {/* if user is logged in show saved homes and logout */}
            {AuthService.loggedIn() ? (
                <>
                <Nav.Link as={Link} to='/saved-homes'>
                  My Saved Homes
                  </Nav.Link>
                  {/* Show admin link only for admin users */}
                  {AuthService.getProfile()?.data.role === 'admin' && (
                    <Nav.Link as={Link} to='/admin'>
                      Admin Dashboard
                    </Nav.Link>
                  )}
                <Nav.Link onClick={AuthService.logout}>Logout</Nav.Link>
                </>
              ) : (
              <>
                <Nav.Link as={Link} to='/login'>Login</Nav.Link>
                <Nav.Link as={Link} to='/signup'>Sign Up</Nav.Link>
              </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};

export default AppNavbar;
