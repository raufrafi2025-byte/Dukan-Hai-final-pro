import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Rider = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Fetch status and orders
        const [ordersRes, userRes] = await Promise.all([
          axios.get('/api/orders/rider', config),
          axios.get('/api/users/profile', config) // Assuming this exists to get latest isOnline
        ]);
        setOrders(ordersRes.data);
        setIsOnline(userRes.data.isOnline);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rider data", error);
        setLoading(false);
      }
    };
    if (user && user.role === 'rider') {
      fetchData();
    }
  }, [user]);

  const toggleStatus = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put('/api/users/rider-status', { isOnline: !isOnline }, config);
      setIsOnline(data.isOnline);
      alert(data.isOnline ? "You are now ONLINE 🛵" : "You are now OFFLINE 💤");
    } catch (error) {
      alert("Error updating status");
    }
  };

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

  if (!user || user.role !== 'rider') return <Container className="py-5 text-center"><h2>Access Denied</h2></Container>;
  if (loading) return <Container className="py-5 text-center"><div className="spinner-border text-primary"></div><h4 className="mt-3">Loading Dashboard...</h4></Container>;

  return (
    <Container className="py-4 animate-up">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
            <div className={`rounded-circle p-1 border-2 border ${isOnline ? 'border-success' : 'border-danger'}`}>
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0062ff&color=fff`} width="60" className="rounded-circle" alt=""/>
            </div>
            <div>
              <h2 className="fw-900 outfit mb-0">Rider Portal</h2>
              <div className="d-flex align-items-center gap-2">
                 <div className={`rounded-circle ${isOnline ? 'bg-success' : 'bg-danger'}`} style={{width: '10px', height: '10px'}}></div>
                 <span className="fw-700 text-muted small">{isOnline ? 'Accepting Orders' : 'Offline'}</span>
              </div>
            </div>
        </div>
        <Card className={`border-0 shadow-sm p-2 rounded-pill px-4 ${isOnline ? 'bg-success-subtle' : 'bg-light'}`}>
            <Form.Check 
                type="switch"
                id="online-switch"
                label={isOnline ? <span className="fw-800 text-success ms-2">I am Online</span> : <span className="fw-800 text-muted ms-2">Go Online</span>}
                checked={isOnline}
                onChange={toggleStatus}
                className="fs-5 d-flex align-items-center"
            />
        </Card>
      </div>

      <h5 className="fw-900 outfit mb-3 mt-4 text-primary"><i className="fas fa-route me-2"></i>Active Deliveries</h5>
      {orders.filter(o => o.status !== 'delivered').length === 0 ? (
        <Card className="bg-white p-5 rounded-lg shadow-sm text-center border-0 animate-up">
          <i className="fas fa-box-open fs-1 text-muted mb-3 opacity-25"></i>
          <h4 className="fw-800">No active orders</h4>
          <p className="text-muted">Stay online to receive new delivery assignments.</p>
        </Card>
      ) : (
        <Row className="g-4">
          {orders.filter(o => o.status !== 'delivered').map(order => (
            <Col md={6} key={order._id}>
              <Card className="border-0 shadow-lg rounded-lg overflow-hidden animate-up">
                <div className="bg-primary p-3 text-white d-flex justify-content-between align-items-center">
                  <span className="fw-900 outfit">ORDER #{order._id.slice(-6)}</span>
                  <Badge bg="white" text="primary" pill className="px-3 py-2 fw-800">{order.status.toUpperCase()}</Badge>
                </div>
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <label className="text-muted small fw-800 text-uppercase mb-2 d-block">Customer</label>
                    <div className="fw-800 fs-4 mb-1">{order.user?.name}</div>
                    <div className="text-muted fw-600"><i className="fas fa-phone me-2"></i>{order.deliveryAddress?.phone}</div>
                  </div>
                  <div className="mb-4">
                    <label className="text-muted small fw-800 text-uppercase mb-2 d-block">Address</label>
                    <div className="fw-700"><i className="fas fa-map-marker-alt me-2 text-primary"></i>{order.deliveryAddress?.address}, {order.deliveryAddress?.city}</div>
                  </div>
                  
                  <div className="d-flex gap-3 mt-4">
                    <Button variant="outline-primary" className="flex-grow-1 rounded-pill fw-800 py-3 shadow-sm">
                      <i className="fas fa-phone-alt me-2"></i>Call
                    </Button>
                    <Button variant="success" className="flex-grow-1 rounded-pill fw-900 py-3 shadow-lg" onClick={() => markAsDelivered(order._id)}>
                        <i className="fas fa-check-double me-2"></i>Delivered
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {orders.filter(o => o.status === 'delivered').length > 0 && (
          <>
            <h5 className="fw-900 outfit mb-3 mt-5 opacity-50">Order History</h5>
            <div className="bg-white rounded-lg shadow-sm p-0 overflow-hidden border">
                <Table responsive hover className="mb-0">
                    <thead className="bg-light small fw-800 text-muted"><tr><th>ID</th><th>Customer</th><th>Date</th><th>Status</th></tr></thead>
                    <tbody>
                        {orders.filter(o => o.status === 'delivered').map(o => (
                            <tr key={o._id}>
                                <td className="fw-700">#{o._id.slice(-6)}</td>
                                <td className="fw-600">{o.user?.name}</td>
                                <td className="text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                                <td><Badge bg="success-subtle" text="success" pill>DELIVERED</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
          </>
      )}
    </Container>
  );
};

const Table = ({ children, className }) => <table className={`table ${className}`}>{children}</table>;

export default Rider;
