import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container className="text-center">
        <h4 className="outfit fw-800 mb-3"><i className="fas fa-shopping-basket text-primary me-2"></i>Dukan</h4>
        <p className="mb-0 text-muted small">&copy; {new Date().getFullYear()} Dukan Grocery. All rights reserved.</p>
        <p className="text-muted small mt-1">Converted to MERN Stack</p>
      </Container>
    </footer>
  );
};

export default Footer;
