import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Rider = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiderOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/orders/rider', config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rider orders", error);
        setLoading(false);
      }
    };
    if (user && user.role === 'rider') {
      fetchRiderOrders();
    }
  }, [user]);

  const markAsDelivered = async (orderId) => {
    if (!window.confirm("Mark this order as delivered?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${orderId}/deliver`, {}, config);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'delivered' } : o));
      alert("Order marked as delivered!");
    } catch (error) {
      alert("Error updating order status");
    }
  };

  if (!user || user.role !== 'rider') return <Container className="py-5"><h2>Access Denied</h2></Container>;
  if (loading) return <Container className="py-5"><h2>Loading Deliveries...</h2></Container>;

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', fontSize: '1.5rem'}}>
          <i className="fas fa-motorcycle"></i>
        </div>
        <div>
          <h2 className="fw-900 outfit mb-0">Rider Dashboard</h2>
          <p className="text-muted mb-0">Welcome, {user.name} | Manage your deliveries</p>
        </div>
      </div>

      <h5 className="fw-800 mb-3 mt-4">Assigned Deliveries</h5>
      {orders.length === 0 ? (
        <Card className="bg-white p-5 rounded-card shadow-sm text-center border-0">
          <i className="fas fa-box-open fs-1 text-muted mb-3"></i>
          <h4>No orders assigned yet</h4>
          <p className="text-muted">Orders assigned by Admin will appear here.</p>
        </Card>
      ) : (
        <Row className="g-4">
          {orders.map(order => (
            <Col md={6} key={order._id}>
              <Card className="border-0 shadow-sm rounded-card overflow-hidden">
                <div className="bg-primary p-3 text-white d-flex justify-content-between align-items-center">
                  <span className="fw-800">Order #{order._id.slice(-6)}</span>
                  <Badge bg="white" className="text-primary rounded-pill px-3 py-2 fw-700">{order.status}</Badge>
                </div>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <label className="text-muted extra-small fw-800 text-uppercase mb-1 d-block">Customer Details</label>
                    <div className="fw-700 fs-5 mb-1">{order.user?.name}</div>
                    <div className="text-muted"><i className="fas fa-phone me-2"></i>{order.deliveryAddress?.phone}</div>
                  </div>
                  <div className="mb-4">
                    <label className="text-muted extra-small fw-800 text-uppercase mb-1 d-block">Delivery Address</label>
                    <div className="fw-600"><i className="fas fa-map-marker-alt me-2 text-primary"></i>{order.deliveryAddress?.address}, {order.deliveryAddress?.city}</div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="flex-grow-1 rounded-pill fw-700 py-2">
                      <i className="fas fa-phone me-2"></i>Call
                    </Button>
                    {order.status !== 'delivered' && (
                      <Button 
                        variant="success" 
                        className="flex-grow-1 rounded-pill fw-700 py-2"
                        onClick={() => markAsDelivered(order._id)}
                      >
                        <i className="fas fa-check-circle me-2"></i>Mark Delivered
                      </Button>
                    )}
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

export default Rider;
