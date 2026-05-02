import React, { useState, useContext } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Mock order creation
      const orderData = {
        orderItems: [{ product: '123', name: 'Mock Item', quantity: 1, price: 200, image: 'mock.jpg' }],
        deliveryAddress: { address, city, phone },
        paymentMethod: 'Cash on Delivery',
        totalPrice: 200
      };
      
      const { data } = await axios.post('/api/orders', orderData, config);
      alert('Order placed successfully! Order ID: ' + data._id);
      navigate('/orders');
    } catch (error) {
      alert('Error placing order');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="bg-white rounded-card shadow-sm p-4 p-md-5 border">
            <h2 className="fw-900 outfit mb-4 text-center">Checkout</h2>
            <Form onSubmit={submitHandler}>
              <h5 className="fw-800 mb-3"><i className="fas fa-map-marker-alt me-2 text-primary"></i>Delivery Address</h5>
              <Row className="g-3 mb-4">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control type="text" placeholder="123 Main St" required value={address} onChange={(e) => setAddress(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="Karachi" required value={city} onChange={(e) => setCity(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" placeholder="0300-1234567" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <h5 className="fw-800 mb-3"><i className="fas fa-wallet me-2 text-primary"></i>Payment Method</h5>
              <div className="mb-4">
                <Form.Check 
                  type="radio" 
                  label="Cash on Delivery (COD)" 
                  id="payment-cod" 
                  checked 
                  readOnly
                  className="fw-600"
                />
              </div>

              <hr className="my-4" />
              
              <Button type="submit" variant="primary" className="w-100 rounded-pill py-3 fw-900 shadow-sm fs-5">
                Place Order <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
