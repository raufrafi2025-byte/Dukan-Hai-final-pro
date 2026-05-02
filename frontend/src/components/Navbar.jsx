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
      {/* Desktop Top Navbar */}
      <Navbar expand="lg" sticky="top" className="shadow-sm bg-white py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="outfit fw-900 fs-3 text-primary">
            <i className="fas fa-shopping-basket me-2"></i>Dukan Hai
          </Navbar.Brand>
          
          <Navbar.Toggle className="border-0 shadow-none mobile-hide" />
          
          <Navbar.Collapse className="mobile-hide">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/" className="mx-2">Home</Nav.Link>
              <Nav.Link as={Link} to="/products" className="mx-2">Products</Nav.Link>
              
              <Nav.Link as={Link} to="/cart" className="position-relative mx-3">
                <i className="fas fa-shopping-cart fs-5"></i>
                <Badge pill bg="primary" className="position-absolute top-0 start-100 translate-middle" style={{fontSize: '0.6rem'}}>0</Badge>
              </Nav.Link>

              {user ? (
                <>
                  {user.role === 'admin' && <Nav.Link as={Link} to="/admin" className="text-warning fw-800">Admin</Nav.Link>}
                  <Button variant="primary" onClick={handleLogout} className="rounded-pill px-4 ms-2">Logout</Button>
                </>
              ) : (
                <Nav.Link as={Link} to="/login" className="btn-primary text-white px-4 ms-2 rounded-pill">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Bottom Navigation (Photo Inspired) */}
      <div className="mobile-bottom-nav d-lg-none">
        <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        <Link to="/products" className={`bottom-nav-item ${location.pathname === '/products' ? 'active' : ''}`}>
          <i className="fas fa-th-large"></i>
          <span>Categories</span>
        </Link>

        {/* Center Floating Action Button */}
        <Link to="/cart" className="fab-button">
          <i className="fas fa-shopping-bag"></i>
        </Link>

        <Link to="/orders" className={`bottom-nav-item ${location.pathname === '/orders' ? 'active' : ''}`}>
          <i className="fas fa-box-open"></i>
          <span>Orders</span>
        </Link>
        <Link to={user?.role === 'admin' ? '/admin' : '/login'} className={`bottom-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
          <i className="fas fa-user-circle"></i>
          <span>{user?.role === 'admin' ? 'Admin' : 'Account'}</span>
        </Link>
      </div>
    </>
  );
};

const Button = ({ children, onClick, className, variant }) => (
    <button onClick={onClick} className={`btn btn-${variant} ${className}`}>{children}</button>
);

export default AppNavbar;
