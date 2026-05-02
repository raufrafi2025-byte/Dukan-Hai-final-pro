import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Table, Button, Card, Nav, Tab, Modal, Form, Badge } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [riders, setRiders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({ deliveryFee: 50, minOrderForFreeDelivery: 1000 });
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showProdModal, setShowProdModal] = useState(false);
  const [showRiderModal, setShowRiderModal] = useState(false);

  // Form States
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '', image: '', unit: 'kg' });
  const [newRider, setNewRider] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [ordersRes, prodsRes, ridersRes, catsRes, settingsRes] = await Promise.all([
          axios.get('/api/orders', config),
          axios.get('/api/products', config),
          axios.get('/api/users/riders', config),
          axios.get('/api/categories', config),
          axios.get('/api/settings')
        ]);
        setOrders(ordersRes.data);
        setProducts(prodsRes.data);
        setRiders(ridersRes.data);
        setCategories(catsRes.data);
        setSettings(settingsRes.data);
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

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('/api/settings', settings, config);
      alert("Settings updated successfully!");
    } catch (error) {
      alert("Error updating settings");
    }
  };

  // Gallery to Base64 Conversion
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/products', newProduct, config);
      setProducts([...products, data]);
      setShowProdModal(false);
      setNewProduct({ name: '', description: '', price: '', stock: '', category: '', image: '', unit: 'kg' });
      alert("Product added successfully!");
    } catch (error) {
      alert("Error adding product: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAddRider = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/users/riders', newRider, config);
      setRiders([...riders, data]);
      setShowRiderModal(false);
      setNewRider({ name: '', email: '', password: '' });
      alert("Rider registered successfully!");
    } catch (error) {
      alert("Error adding rider: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("Delete this product?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        alert("Error deleting product");
      }
    }
  };

  if (!user || user.role !== 'admin') return <Container className="py-5 text-center"><h2 className="fw-900 text-danger">Access Denied</h2></Container>;
  if (loading) return <Container className="py-5 text-center"><div className="spinner-border text-primary"></div><h4 className="mt-3">Loading Dukan Dashboard...</h4></Container>;

  return (
    <Container className="py-4 animate-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-900 outfit mb-0 text-primary">Admin Control Center</h2>
        <div className="d-flex gap-2">
            <Button variant="outline-primary" className="rounded-pill px-3 shadow-sm" onClick={() => window.location.reload()}><i className="fas fa-sync-alt"></i></Button>
            <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => setShowProdModal(true)}><i className="fas fa-plus me-2"></i>Add Product</Button>
        </div>
      </div>
      
      <Row className="g-3 mb-5">
        <Col xs={6} md={3}>
          <Card className="premium-kpi-card border-0 shadow-sm bg-white p-3">
            <div className="kpi-icon-wrap bg-primary-soft text-primary"><i className="fas fa-shopping-bag"></i></div>
            <div><div className="kpi-label">Orders</div><div className="kpi-value">{orders.length}</div></div>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="premium-kpi-card border-0 shadow-sm bg-white p-3">
            <div className="kpi-icon-wrap bg-success-subtle text-success" style={{background: '#e6fffa'}}><i className="fas fa-box"></i></div>
            <div><div className="kpi-label">Items</div><div className="kpi-value">{products.length}</div></div>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="premium-kpi-card border-0 shadow-sm bg-white p-3">
            <div className="kpi-icon-wrap bg-warning-subtle text-warning" style={{background: '#fff9e6'}}><i className="fas fa-motorcycle"></i></div>
            <div><div className="kpi-label">Riders</div><div className="kpi-value">{riders.length}</div></div>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="premium-kpi-card border-0 shadow-sm bg-primary text-white p-3">
            <div className="kpi-icon-wrap bg-white text-primary"><i className="fas fa-truck"></i></div>
            <div><div className="kpi-label text-white opacity-75">Fee</div><div className="kpi-value text-white">Rs. {settings.deliveryFee}</div></div>
          </Card>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="orders">
        <Nav variant="pills" className="mb-4 bg-white p-2 rounded-pill shadow-sm border mx-auto overflow-auto no-scrollbar" style={{width: 'fit-content', flexWrap: 'nowrap'}}>
          <Nav.Item><Nav.Link eventKey="orders" className="rounded-pill px-4 fw-700">Orders</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="products" className="rounded-pill px-4 fw-700">Products</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="riders" className="rounded-pill px-4 fw-700">Fleet</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="settings" className="rounded-pill px-4 fw-700">Settings</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="orders">
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
              <Table responsive hover className="admin-table mb-0">
                <thead className="bg-light">
                  <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td className="fw-700 text-muted">#{order._id.slice(-6)}</td>
                      <td><div className="fw-700">{order.user?.name}</div><div className="small text-muted">{order.user?.email}</div></td>
                      <td className="fw-800 text-primary">Rs. {order.totalPrice}</td>
                      <td><Badge pill bg={order.status === 'delivered' ? 'success' : 'primary'} className="px-3 py-2">{order.status}</Badge></td>
                      <td><Button variant="light" size="sm" className="rounded-circle shadow-sm"><i className="fas fa-eye text-primary"></i></Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>
          
          <Tab.Pane eventKey="products">
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
              <Table responsive hover className="admin-table mb-0">
                <thead className="bg-light"><tr><th>Product</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td><div className="d-flex align-items-center gap-3"><img src={p.image?.startsWith('data:image') || p.image?.startsWith('http') ? p.image : `/uploads/${p.image}`} width="50" height="50" className="rounded-lg shadow-sm border" style={{objectFit: 'cover'}} alt="" /><div className="fw-700">{p.name}</div></div></td>
                      <td className="fw-800 text-primary">Rs. {p.price}</td>
                      <td><Badge bg="light" text="dark" className="border">{p.stock} {p.unit}</Badge></td>
                      <td><Button variant="light" size="sm" className="rounded-circle shadow-sm" onClick={() => handleDeleteProduct(p._id)}><i className="fas fa-trash text-danger"></i></Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="riders">
            <div className="d-flex justify-content-end mb-3">
                <Button variant="warning" className="rounded-pill px-4 fw-800 shadow-sm" onClick={() => setShowRiderModal(true)}><i className="fas fa-user-plus me-2"></i>Register Rider</Button>
            </div>
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
              <Table responsive hover className="admin-table mb-0">
                <thead className="bg-light"><tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {riders.map(r => (
                    <tr key={r._id}>
                      <td className="fw-700">{r.name}</td>
                      <td className="text-muted">{r.email}</td>
                      <td><Badge bg="success" pill className="px-3">Active</Badge></td>
                      <td><Button variant="light" size="sm" className="rounded-circle shadow-sm"><i className="fas fa-ban text-danger"></i></Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="settings">
            <Card className="admin-card border-0 shadow-sm p-4">
               <h5 className="fw-800 mb-4">Store Configuration</h5>
               <Form onSubmit={handleUpdateSettings}>
                  <Row className="g-4">
                     <Col md={6}>
                        <Form.Group>
                           <Form.Label className="small fw-800 text-muted">DELIVERY FEE (RS.)</Form.Label>
                           <Form.Control type="number" className="rounded-pill p-3 border-2" value={settings.deliveryFee} onChange={(e) => setSettings({...settings, deliveryFee: e.target.value})} />
                        </Form.Group>
                     </Col>
                     <Col md={6}>
                        <Form.Group>
                           <Form.Label className="small fw-800 text-muted">FREE DELIVERY ABOVE (RS.)</Form.Label>
                           <Form.Control type="number" className="rounded-pill p-3 border-2" value={settings.minOrderForFreeDelivery} onChange={(e) => setSettings({...settings, minOrderForFreeDelivery: e.target.value})} />
                        </Form.Group>
                     </Col>
                  </Row>
                  <Button variant="primary" type="submit" className="mt-4 rounded-pill px-5 py-2 fw-800 shadow">SAVE SETTINGS</Button>
               </Form>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Modals remain same as before with minor UI tweaks... */}
      <Modal show={showProdModal} onHide={() => setShowProdModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 px-4 pt-4"><Modal.Title className="fw-900 outfit fs-3">New Product</Modal.Title></Modal.Header>
        <Modal.Body className="p-4 pt-2">
          <Form onSubmit={handleAddProduct}>
            <Row className="g-3">
              <Col md={6}><Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">NAME</Form.Label><Form.Control type="text" className="rounded-pill p-3 border-2" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">CATEGORY</Form.Label><Form.Select className="rounded-pill p-3 border-2" required value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">PRICE</Form.Label><Form.Control type="number" className="rounded-pill p-3 border-2" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} /></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">STOCK</Form.Label><Form.Control type="number" className="rounded-pill p-3 border-2" required value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} /></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">UNIT</Form.Label><Form.Select className="rounded-pill p-3 border-2" value={newProduct.unit} onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}><option value="kg">kg</option><option value="dozen">dozen</option><option value="piece">piece</option></Form.Select></Form.Group></Col>
              <Col md={12}><Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">GALLERY IMAGE</Form.Label><div className="p-4 text-center rounded-lg bg-light" style={{border: '2px dashed #0062ff', cursor: 'pointer'}} onClick={() => document.getElementById('galleryInput').click()}><i className="fas fa-cloud-upload-alt fs-2 text-primary mb-2"></i><p className="mb-0 fw-700 small">Click to Pick from Mobile Gallery</p><input id="galleryInput" type="file" hidden accept="image/*" onChange={handleImageChange} /></div>{newProduct.image && <img src={newProduct.image} className="mt-2 rounded shadow-sm" width="80" alt="" />}</Form.Group></Col>
            </Row>
            <Button variant="primary" type="submit" className="w-100 rounded-pill py-3 fw-900 shadow mt-3">ADD PRODUCT</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showRiderModal} onHide={() => setShowRiderModal(false)} centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4"><Modal.Title className="fw-900 outfit fs-3">New Rider</Modal.Title></Modal.Header>
        <Modal.Body className="p-4 pt-2">
          <Form onSubmit={handleAddRider}>
            <Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">NAME</Form.Label><Form.Control type="text" className="rounded-pill p-3 border-2" required value={newRider.name} onChange={(e) => setNewRider({...newRider, name: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">EMAIL</Form.Label><Form.Control type="email" className="rounded-pill p-3 border-2" required value={newRider.email} onChange={(e) => setNewRider({...newRider, email: e.target.value})} /></Form.Group>
            <Form.Group className="mb-4"><Form.Label className="small fw-800 text-muted">PASSWORD</Form.Label><Form.Control type="password" className="rounded-pill p-3 border-2" required value={newRider.password} onChange={(e) => setNewRider({...newRider, password: e.target.value})} /></Form.Group>
            <Button variant="warning" type="submit" className="w-100 rounded-pill py-3 fw-900 shadow">CREATE RIDER</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Admin;
