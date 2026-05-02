import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  // Mock cart for UI demonstration until we build real cart logic
  const [cartItems, setCartItems] = useState([
    { _id: '1', name: 'Fresh Milk 1L', price: 200, qty: 2, image: '' }
  ]);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/login?redirect=checkout'); // Mock redirect flow
  };

  return (
    <Container className="py-5">
      <h2 className="fw-900 outfit mb-4">Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="bg-white p-5 rounded-card shadow-sm text-center">
          <i className="fas fa-shopping-cart fs-1 text-muted mb-3"></i>
          <h4>Your cart is empty</h4>
          <Link to="/products" className="btn btn-primary rounded-pill mt-3 px-4">Browse Store</Link>
        </div>
      ) : (
        <Row className="g-4">
          <Col md={8}>
            <div className="bg-white rounded-card shadow-sm p-4 border">
              {cartItems.map(item => (
                <Row key={item._id} className="align-items-center mb-3 pb-3 border-bottom">
                  <Col md={2}>
                    <div style={{ width: '80px', height: '80px', background: '#f0f0f5', borderRadius: '12px' }}></div>
                  </Col>
                  <Col md={4}><Link to={`/product/${item._id}`} className="text-dark fw-700">{item.name}</Link></Col>
                  <Col md={2} className="fw-800 text-primary">Rs. {item.price}</Col>
                  <Col md={2}>
                    <Form.Control as="select" value={item.qty} readOnly className="rounded-pill">
                      {[...Array(5).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button variant="light" className="text-danger rounded-circle"><i className="fas fa-trash"></i></Button>
                  </Col>
                </Row>
              ))}
            </div>
          </Col>
          <Col md={4}>
            <div className="bg-white rounded-card shadow-sm p-4 border">
              <h5 className="fw-800 border-bottom pb-3">Order Summary</h5>
              <div className="d-flex justify-content-between my-3 fw-600">
                <span>Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)</span>
                <span>Rs. {cartItems.reduce((a, c) => a + c.price * c.qty, 0)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4 fs-5 fw-900">
                <span>Total</span>
                <span className="text-primary">Rs. {cartItems.reduce((a, c) => a + c.price * c.qty, 0)}</span>
              </div>
              <Button 
                variant="primary" 
                className="w-100 rounded-pill py-3 fw-800 shadow-sm"
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
