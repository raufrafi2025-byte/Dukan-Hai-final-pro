import React, { useContext } from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AppNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop & Tablet Top Navbar */}
      <Navbar expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="outfit fw-900 fs-3 text-primary">
            <i className="fas fa-shopping-basket me-2"></i>Dukan
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none mobile-hide" />
          
          <Navbar.Collapse id="basic-navbar-nav" className="mobile-hide">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/products">Products</Nav.Link>
              
              <Nav.Link as={Link} to="/cart" className="position-relative">
                <i className="fas fa-shopping-cart fs-5"></i>
                <Badge pill bg="primary" className="position-absolute top-0 start-100 translate-middle" style={{fontSize: '0.6rem'}}>0</Badge>
              </Nav.Link>

              {user ? (
                <>
                  {user.role === 'admin' && <Nav.Link as={Link} to="/admin" className="text-warning fw-700">Admin</Nav.Link>}
                  {user.role === 'rider' && <Nav.Link as={Link} to="/rider" className="text-success fw-700">Rider</Nav.Link>}
                  <Nav.Link onClick={handleLogout} className="btn-primary text-white ms-lg-3 rounded-pill">Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/login" className="btn-primary text-white ms-lg-3 rounded-pill px-4">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Bottom Navigation (Foodpanda Style) */}
      <div className="mobile-bottom-nav d-lg-none">
        <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        <Link to="/products" className={`bottom-nav-item ${location.pathname === '/products' ? 'active' : ''}`}>
          <i className="fas fa-search"></i>
          <span>Search</span>
        </Link>
        <Link to="/cart" className={`bottom-nav-item ${location.pathname === '/cart' ? 'active' : ''}`}>
          <div className="position-relative">
            <i className="fas fa-shopping-cart"></i>
            <Badge pill bg="primary" className="position-absolute top-0 start-100 translate-middle" style={{fontSize: '0.5rem'}}>0</Badge>
          </div>
          <span>Cart</span>
        </Link>
        {user ? (
          <Link to={user.role === 'admin' ? '/admin' : (user.role === 'rider' ? '/rider' : '/orders')} className={`bottom-nav-item ${['/admin', '/rider', '/orders'].includes(location.pathname) ? 'active' : ''}`}>
            <i className="fas fa-user"></i>
            <span>Account</span>
          </Link>
        ) : (
          <Link to="/login" className={`bottom-nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
            <i className="fas fa-sign-in-alt"></i>
            <span>Login</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default AppNavbar;
