import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = 0; // Replace with actual cart state later

  return (
    <>
      <Navbar bg="white" expand="lg" sticky="top" className="dukan-navbar py-2">
        <Container>
          <Navbar.Brand as={Link} to="/" className="dukan-brand">
            <i className="fas fa-shopping-basket me-2 text-primary"></i>Dukan
          </Navbar.Brand>

          {/* Mobile cart + toggler */}
          <div className="d-flex align-items-center d-lg-none gap-2 ms-auto me-2">
            <Link to="/cart" className="nav-cart-btn position-relative text-decoration-none">
              <i className="fas fa-shopping-cart"></i>
              <Badge bg="danger" className="cart-badge rounded-circle">{cartCount}</Badge>
            </Link>
          </div>

          <Navbar.Toggle aria-controls="navbarMain">
            <i className="fas fa-bars text-dark"></i>
          </Navbar.Toggle>

          <Navbar.Collapse id="navbarMain">
            {/* Search Bar */}
            <div className="search-wrapper mx-auto position-relative mt-3 mt-lg-0">
              <div className="input-group search-group">
                <input type="text" className="form-control search-input" placeholder="Search for groceries..." />
                <button className="btn btn-search" type="button"><i className="fas fa-search"></i></button>
              </div>
            </div>

            {/* Nav Links */}
            <Nav className="ms-auto align-items-center gap-1 mt-3 mt-lg-0">
              <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Home</Nav.Link>
              <Nav.Link as={Link} to="/products" active={location.pathname === '/products'}>Products</Nav.Link>

              {/* Desktop Cart */}
              <Nav.Link as={Link} to="/cart" className="d-none d-lg-block position-relative mx-2">
                <i className="fas fa-shopping-cart fs-5 text-dark"></i>
                <Badge bg="danger" className="cart-badge rounded-circle">{cartCount}</Badge>
              </Nav.Link>

              {/* Auth */}
              {user ? (
                <NavDropdown 
                  title={<><i className="fas fa-user-circle me-1"></i>{user.name.split(' ')[0]}</>} 
                  id="user-dropdown" 
                  align="end"
                >
                  <NavDropdown.Header>{user.name} ({user.role})</NavDropdown.Header>
                  
                  {user.role === 'admin' && (
                    <NavDropdown.Item as={Link} to="/admin" className="text-primary">
                      <i className="fas fa-tachometer-alt me-2"></i>Admin Panel
                    </NavDropdown.Item>
                  )}
                  {user.role === 'rider' && (
                    <NavDropdown.Item as={Link} to="/rider" className="text-primary">
                      <i className="fas fa-motorcycle me-2"></i>Rider Dashboard
                    </NavDropdown.Item>
                  )}
                  {user.role === 'user' && (
                    <NavDropdown.Item as={Link} to="/orders">
                      <i className="fas fa-box me-2"></i>My Orders
                    </NavDropdown.Item>
                  )}
                  
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className="btn btn-primary text-white rounded-pill px-4 fw-bold ms-2">
                  Login
                </Nav.Link>
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
          <span>Browse</span>
        </Link>
        <Link to="/cart" className={`bottom-nav-item position-relative ${location.pathname === '/cart' ? 'active' : ''}`}>
          <i className="fas fa-shopping-cart"></i>
          <span>Cart</span>
          <Badge bg="danger" className="position-absolute top-0 start-50 translate-middle-x" style={{ fontSize: '0.6rem', marginTop: '-2px' }}>{cartCount}</Badge>
        </Link>
        
        {user ? (
          user.role === 'admin' ? (
            <Link to="/admin" className="bottom-nav-item">
              <i className="fas fa-user-shield"></i>
              <span>Admin</span>
            </Link>
          ) : user.role === 'rider' ? (
            <Link to="/rider" className="bottom-nav-item">
              <i className="fas fa-motorcycle"></i>
              <span>Rider</span>
            </Link>
          ) : (
            <Link to="/orders" className={`bottom-nav-item ${location.pathname === '/orders' ? 'active' : ''}`}>
              <i className="fas fa-receipt"></i>
              <span>Orders</span>
            </Link>
          )
        ) : (
          <Link to="/login" className={`bottom-nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
            <i className="fas fa-user"></i>
            <span>Login</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
