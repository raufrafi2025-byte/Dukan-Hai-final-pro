import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Table, Button, Card, Nav, Tab } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [ordersRes, prodsRes, ridersRes] = await Promise.all([
          axios.get('/api/orders', config),
          axios.get('/api/products', config),
          axios.get('/api/users/riders', config)
        ]);
        setOrders(ordersRes.data);
        setProducts(prodsRes.data);
        setRiders(ridersRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data", error);
        setLoading(false);
      }
    };
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') return <Container className="py-5"><h2>Access Denied</h2></Container>;
  if (loading) return <Container className="py-5"><h2>Loading Dashboard...</h2></Container>;

  return (
    <Container className="py-4">
      <h2 className="fw-900 outfit mb-4">Admin Dashboard</h2>
      
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="premium-kpi-card border-0 shadow-sm bg-white">
            <div className="kpi-icon-wrap bg-primary-soft text-primary">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <div>
              <div className="kpi-label">Total Orders</div>
              <div className="kpi-value">{orders.length}</div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="premium-kpi-card border-0 shadow-sm bg-white">
            <div className="kpi-icon-wrap bg-success-subtle text-success" style={{background: '#e6fffa'}}>
              <i className="fas fa-box"></i>
            </div>
            <div>
              <div className="kpi-label">Products</div>
              <div className="kpi-value">{products.length}</div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="premium-kpi-card border-0 shadow-sm bg-white">
            <div className="kpi-icon-wrap bg-warning-subtle text-warning" style={{background: '#fff9e6'}}>
              <i className="fas fa-motorcycle"></i>
            </div>
            <div>
              <div className="kpi-label">Active Riders</div>
              <div className="kpi-value">{riders.length}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="orders">
        <Nav variant="pills" className="mb-4 bg-white p-2 rounded-pill shadow-sm border" style={{width: 'fit-content'}}>
          <Nav.Item>
            <Nav.Link eventKey="orders" className="rounded-pill px-4 fw-700">Orders</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="products" className="rounded-pill px-4 fw-700">Products</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="riders" className="rounded-pill px-4 fw-700">Riders</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="orders">
            <Card className="admin-card border-0 shadow-sm">
              <Card.Body className="p-0">
                <Table responsive className="admin-table mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Rider</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td className="fw-700 text-muted">#{order._id.slice(-6)}</td>
                        <td>{order.user?.name}</td>
                        <td className="fw-700">Rs. {order.totalPrice}</td>
                        <td>
                          <span className={`badge rounded-pill ${order.status === 'delivered' ? 'bg-success' : 'bg-primary'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.rider?.name || 'Not Assigned'}</td>
                        <td>
                          <Button variant="light" size="sm" className="rounded-circle me-1"><i className="fas fa-eye text-primary"></i></Button>
                          <Button variant="light" size="sm" className="rounded-circle"><i className="fas fa-motorcycle text-warning"></i></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>
          
          <Tab.Pane eventKey="products">
            <div className="d-flex justify-content-between mb-3">
              <h5 className="fw-800">Product Management</h5>
              <Button variant="primary" className="rounded-pill px-4"><i className="fas fa-plus me-2"></i>Add New</Button>
            </div>
            <Card className="admin-card border-0 shadow-sm">
              <Card.Body className="p-0">
                <Table responsive className="admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td><img src={p.image ? `/uploads/${p.image}` : 'https://via.placeholder.com/40'} width="40" className="rounded" alt="" /></td>
                        <td className="fw-600">{p.name}</td>
                        <td className="fw-700 text-primary">Rs. {p.price}</td>
                        <td>{p.stock}</td>
                        <td>
                          <Button variant="light" size="sm" className="rounded-circle me-1"><i className="fas fa-edit text-info"></i></Button>
                          <Button variant="light" size="sm" className="rounded-circle"><i className="fas fa-trash text-danger"></i></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="riders">
            <Card className="admin-card border-0 shadow-sm">
              <Card.Body className="p-0">
                <Table responsive className="admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riders.map(r => (
                      <tr key={r._id}>
                        <td className="fw-600">{r.name}</td>
                        <td className="text-muted">{r.email}</td>
                        <td><span className="badge bg-success rounded-pill">Active</span></td>
                        <td>
                          <Button variant="light" size="sm" className="rounded-circle me-1"><i className="fas fa-history text-info"></i></Button>
                          <Button variant="light" size="sm" className="rounded-circle"><i className="fas fa-ban text-danger"></i></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Admin;
