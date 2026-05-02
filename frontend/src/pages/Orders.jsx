import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders", error);
        setLoading(false);
      }
    };
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  if (!user) return <Container className="py-5"><h2>Please Login to see orders</h2></Container>;
  if (loading) return <Container className="py-5"><h2>Loading your orders...</h2></Container>;

  return (
    <Container className="py-5">
      <h2 className="fw-900 outfit mb-4"><i className="fas fa-receipt me-3 text-primary"></i>My Order History</h2>
      
      {orders.length === 0 ? (
        <div className="bg-white p-5 rounded-card shadow-sm text-center border">
          <i className="fas fa-shopping-bag fs-1 text-muted mb-3"></i>
          <h4>You haven't placed any orders yet</h4>
          <Link to="/products" className="btn btn-primary rounded-pill mt-3 px-4 fw-700">Start Shopping</Link>
        </div>
      ) : (
        <Row className="g-4">
          {orders.map(order => (
            <Col lg={12} key={order._id}>
              <Card className="border-0 shadow-sm rounded-card overflow-hidden">
                <div className="bg-primary p-3 text-white d-flex justify-content-between align-items-center">
                  <span className="fw-800">Order #{order._id.slice(-6)}</span>
                  <span className="small opacity-75">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <Card.Body className="p-4">
                  <Row className="align-items-center">
                    <Col md={4}>
                      <label className="text-muted extra-small fw-800 text-uppercase mb-1 d-block">Status</label>
                      <Badge bg={order.status === 'delivered' ? 'success' : 'warning'} className="rounded-pill px-3 py-2 fw-700 uppercase" style={{letterSpacing: '1px'}}>
                        {order.status}
                      </Badge>
                    </Col>
                    <Col md={4}>
                      <label className="text-muted extra-small fw-800 text-uppercase mb-1 d-block">Items</label>
                      <div className="fw-700">{order.orderItems.length} Product(s)</div>
                    </Col>
                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                      <label className="text-muted extra-small fw-800 text-uppercase mb-1 d-block">Total Price</label>
                      <div className="fw-900 fs-4 text-primary">Rs. {order.totalPrice}</div>
                    </Col>
                  </Row>
                  <hr className="my-3" />
                  <div className="text-muted small">
                    <i className="fas fa-map-marker-alt me-2"></i>{order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Orders;
