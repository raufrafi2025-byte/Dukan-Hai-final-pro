import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Table, Button, Card, Nav, Tab, Modal, Form, Badge, Dropdown } from 'react-bootstrap';
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
  const [showCatModal, setShowCatModal] = useState(false);

  // Form States
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '', image: '', unit: 'kg' });
  const [newRider, setNewRider] = useState({ name: '', email: '', password: '' });
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });

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
      alert("Error updating settings: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAssignRider = async (orderId, riderId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${orderId}/assign`, { riderId }, config);
      setOrders(orders.map(o => o._id === orderId ? { ...o, rider: riders.find(r => r._id === riderId), status: 'shipped' } : o));
      alert("Rider assigned and order updated to SHIPPED!");
    } catch (error) {
      alert("Error assigning rider");
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
      alert("Product added!");
    } catch (error) { alert("Error adding product"); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/categories', newCategory, config);
      setCategories([...categories, data]);
      setShowCatModal(false);
      setNewCategory({ name: '', image: '' });
      alert("Category added!");
    } catch (error) { alert("Error adding category"); }
  };

  const handleAddRider = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/users/riders', newRider, config);
      setRiders([...riders, data]);
      setShowRiderModal(false);
      setNewRider({ name: '', email: '', password: '' });
      alert("Rider added!");
    } catch (error) { 
        alert("Error adding rider: " + (error.response?.data?.message || error.message)); 
    }
  };

  const handleImageChange = (e, target) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if(target === 'product') setNewProduct({...newProduct, image: reader.result});
        if(target === 'category') setNewCategory({...newCategory, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user || user.role !== 'admin') return <Container className="py-5 text-center"><h2>Access Denied</h2></Container>;

  return (
    <Container className="py-4 pb-5 mb-5 animate-up">
        <div className="mb-4 d-flex justify-content-between align-items-end">
            <div>
                <h5 className="text-muted small fw-700 mb-1">Dukan Hai</h5>
                <h2 className="fw-900 outfit text-primary">Control Center ⚡</h2>
            </div>
            <div className="d-flex gap-2">
                <Button variant="outline-primary" className="rounded-circle shadow-sm" onClick={() => window.location.reload()}><i className="fas fa-sync"></i></Button>
            </div>
        </div>

      <Row className="g-3 mb-5">
        <Col xs={6} md={3}><Card className="premium-kpi-card border-0 shadow-sm bg-white p-3 text-center"><div className="kpi-label">Orders</div><div className="kpi-value fs-4">{orders.length}</div></Card></Col>
        <Col xs={6} md={3}><Card className="premium-kpi-card border-0 shadow-sm bg-white p-3 text-center"><div className="kpi-label">Revenue</div><div className="kpi-value fs-4 text-success">Rs.{orders.reduce((a,b)=>a+b.totalPrice,0)}</div></Card></Col>
        <Col xs={6} md={3}><Card className="premium-kpi-card border-0 shadow-sm bg-white p-3 text-center"><div className="kpi-label">Riders</div><div className="kpi-value fs-4">{riders.filter(r=>r.isOnline).length}<span className="small text-muted">/{riders.length}</span></div></Card></Col>
        <Col xs={6} md={3}><Card className="premium-kpi-card border-0 shadow-sm bg-primary text-white p-3 text-center"><div className="kpi-label text-white opacity-75">Deliv. Fee</div><div className="kpi-value fs-4 text-white">Rs.{settings.deliveryFee}</div></Card></Col>
      </Row>

      <Tab.Container defaultActiveKey="orders">
        <Nav variant="pills" className="mb-4 bg-white p-2 rounded-pill shadow-sm border mx-auto overflow-auto no-scrollbar" style={{width: 'fit-content', flexWrap: 'nowrap'}}>
          <Nav.Item><Nav.Link eventKey="orders" className="rounded-pill px-4 fw-800">Orders</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="products" className="rounded-pill px-4 fw-800">Products</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="categories" className="rounded-pill px-4 fw-800">Categories</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="riders" className="rounded-pill px-4 fw-800">Riders</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="settings" className="rounded-pill px-4 fw-800">Settings</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="orders">
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
                <Table responsive hover className="mb-0">
                    <thead className="bg-light"><tr><th>ID</th><th>User</th><th>Total</th><th>Status</th><th>Assign Rider</th></tr></thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o._id}>
                                <td className="fw-700">#{o._id.slice(-5)}</td>
                                <td><div className="fw-700">{o.user?.name}</div><div className="small text-muted">{o.deliveryAddress?.city}</div></td>
                                <td className="fw-900 text-primary">Rs.{o.totalPrice}</td>
                                <td><Badge bg={o.status === 'delivered' ? 'success' : 'primary'} pill className="px-3">{o.status}</Badge></td>
                                <td>
                                    {o.status === 'pending' ? (
                                        <Dropdown>
                                            <Dropdown.Toggle variant="light" size="sm" className="rounded-pill border shadow-sm fw-700">Assign <i className="fas fa-motorcycle ms-1"></i></Dropdown.Toggle>
                                            <Dropdown.Menu className="shadow-lg border-0 rounded-lg">
                                                <Dropdown.Header className="fw-800">ONLINE RIDERS</Dropdown.Header>
                                                {riders.filter(r => r.isOnline).length > 0 ? (
                                                    riders.filter(r => r.isOnline).map(r => (
                                                        <Dropdown.Item key={r._id} onClick={() => handleAssignRider(o._id, r._id)} className="fw-700 py-2">
                                                            <div className="bg-success rounded-circle d-inline-block me-2" style={{width: '8px', height: '8px'}}></div>
                                                            {r.name}
                                                        </Dropdown.Item>
                                                    ))
                                                ) : <Dropdown.Item disabled className="small text-danger">No Riders Online</Dropdown.Item>}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    ) : <span className="small text-muted fw-700">{o.rider?.name || 'Processing...'}</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="products">
            <div className="d-flex justify-content-between mb-3"><h5 className="fw-900 outfit mb-0">Products List</h5><Button variant="primary" size="sm" className="rounded-pill px-4 fw-800" onClick={() => setShowProdModal(true)}><i className="fas fa-plus me-2"></i>Add New</Button></div>
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
                <Table responsive hover className="mb-0">
                    <thead className="bg-light"><tr><th>Item</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
                    <tbody>{products.map(p => (<tr key={p._id}><td><div className="d-flex align-items-center gap-3"><img src={p.image} width="45" height="45" className="rounded shadow-sm" style={{objectFit:'cover'}} alt=""/><div className="fw-800">{p.name}</div></div></td><td className="small text-muted fw-700">{p.category?.name || 'General'}</td><td className="fw-900 text-primary">Rs.{p.price}</td><td><Badge bg={p.stock > 10 ? 'success-subtle' : 'danger-subtle'} text={p.stock > 10 ? 'success' : 'danger'} pill className="px-3">{p.stock} units</Badge></td></tr>))}</tbody>
                </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="categories">
            <div className="d-flex justify-content-between mb-3"><h5 className="fw-900 outfit mb-0">Categories</h5><Button variant="primary" size="sm" className="rounded-pill px-4 fw-800" onClick={() => setShowCatModal(true)}><i className="fas fa-plus me-2"></i>New Cat</Button></div>
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
                <Table responsive hover className="mb-0">
                    <tbody>{categories.map(c => (<tr key={c._id}><td><img src={c.image} width="50" height="50" className="rounded-circle border" style={{objectFit:'cover'}} alt=""/></td><td className="fw-900">{c.name}</td><td><Button variant="light" size="sm" className="rounded-circle"><i className="fas fa-trash text-danger"></i></Button></td></tr>))}</tbody>
                </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="riders">
            <div className="d-flex justify-content-between mb-3"><h5 className="fw-900 outfit mb-0">Rider Management</h5><Button variant="warning" size="sm" className="rounded-pill px-4 fw-800" onClick={() => setShowRiderModal(true)}><i className="fas fa-user-plus me-2"></i>Add Rider</Button></div>
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
                <Table responsive hover className="mb-0">
                    <thead className="bg-light"><tr><th>Rider Name</th><th>Status</th><th>Email</th><th>Actions</th></tr></thead>
                    <tbody>
                        {riders.map(r => (
                            <tr key={r._id}>
                                <td className="fw-800">{r.name}</td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className={`rounded-circle ${r.isOnline ? 'bg-success' : 'bg-danger'}`} style={{width: '10px', height: '10px'}}></div>
                                        <span className={`fw-800 small ${r.isOnline ? 'text-success' : 'text-danger'}`}>{r.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                                    </div>
                                </td>
                                <td className="text-muted small fw-700">{r.email}</td>
                                <td><Button variant="light" size="sm" className="rounded-circle shadow-sm"><i className="fas fa-ban text-danger"></i></Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="settings">
            <Card className="admin-card border-0 shadow-sm p-4 animate-up">
               <h5 className="fw-900 outfit mb-4 text-primary">Global Configuration</h5>
               <Form onSubmit={handleUpdateSettings}>
                  <Row className="g-4">
                     <Col md={6}><Form.Group><Form.Label className="small fw-800 text-muted">DELIVERY FEE (RS.)</Form.Label><Form.Control type="number" className="rounded-pill p-3 border-2" value={settings.deliveryFee} onChange={(e) => setSettings({...settings, deliveryFee: e.target.value})} /></Form.Group></Col>
                     <Col md={6}><Form.Group><Form.Label className="small fw-800 text-muted">FREE DELIVERY ABOVE (RS.)</Form.Label><Form.Control type="number" className="rounded-pill p-3 border-2" value={settings.minOrderForFreeDelivery} onChange={(e) => setSettings({...settings, minOrderForFreeDelivery: e.target.value})} /></Form.Group></Col>
                  </Row>
                  <Button variant="primary" type="submit" className="mt-4 rounded-pill px-5 py-3 fw-900 shadow-lg border-0">SAVE SETTINGS <i className="fas fa-save ms-2"></i></Button>
               </Form>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Modals are updated with Gallery/File support */}
      <Modal show={showProdModal} onHide={() => setShowProdModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0"><Modal.Title className="fw-900 outfit">Add New Product</Modal.Title></Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleAddProduct}>
            <Row className="g-3">
              <Col md={6}><Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">NAME</Form.Label><Form.Control type="text" className="rounded-pill p-3 border-2" required onChange={e => setNewProduct({...newProduct, name: e.target.value})} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">CATEGORY</Form.Label><Form.Select className="rounded-pill p-3 border-2" required onChange={e => setNewProduct({...newProduct, category: e.target.value})}><option value="">Select Category</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">PRICE (RS.)</Form.Label><Form.Control type="number" className="rounded-pill p-3 border-2" required onChange={e => setNewProduct({...newProduct, price: e.target.value})} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">STOCK</Form.Label><Form.Control type="number" className="rounded-pill p-3 border-2" required onChange={e => setNewProduct({...newProduct, stock: e.target.value})} /></Form.Group></Col>
              <Col md={12}><Form.Group className="mb-4"><Form.Label className="small fw-800 text-muted">PRODUCT IMAGE (GALLERY)</Form.Label><Form.Control type="file" className="rounded-pill border-2" onChange={e => handleImageChange(e, 'product')} /></Form.Group></Col>
            </Row>
            <Button variant="primary" type="submit" className="w-100 rounded-pill py-3 fw-900 shadow-lg">CREATE PRODUCT</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Category Modal */}
      <Modal show={showCatModal} onHide={() => setShowCatModal(false)} centered>
        <Modal.Header closeButton className="border-0"><Modal.Title className="fw-900 outfit">New Category</Modal.Title></Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleAddCategory}>
            <Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">CATEGORY NAME</Form.Label><Form.Control type="text" className="rounded-pill p-3 border-2" required value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} /></Form.Group>
            <Form.Group className="mb-4"><Form.Label className="small fw-800 text-muted">CATEGORY IMAGE</Form.Label><Form.Control type="file" className="rounded-pill border-2" onChange={e => handleImageChange(e, 'category')} /></Form.Group>
            <Button variant="primary" type="submit" className="w-100 rounded-pill py-3 fw-900 shadow-lg">SAVE CATEGORY</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Rider Modal */}
      <Modal show={showRiderModal} onHide={() => setShowRiderModal(false)} centered>
        <Modal.Header closeButton className="border-0"><Modal.Title className="fw-900 outfit">Register Rider</Modal.Title></Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleAddRider}>
            <Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">NAME</Form.Label><Form.Control type="text" className="rounded-pill p-3 border-2" required value={newRider.name} onChange={e => setNewRider({...newRider, name: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="small fw-800 text-muted">EMAIL</Form.Label><Form.Control type="email" className="rounded-pill p-3 border-2" required value={newRider.email} onChange={e => setNewRider({...newRider, email: e.target.value})} /></Form.Group>
            <Form.Group className="mb-4"><Form.Label className="small fw-800 text-muted">PASSWORD</Form.Label><Form.Control type="password" placeholder="Min 6 chars" className="rounded-pill p-3 border-2" required value={newRider.password} onChange={e => setNewRider({...newRider, password: e.target.value})} /></Form.Group>
            <Button variant="warning" type="submit" className="w-100 rounded-pill py-3 fw-900 shadow-lg text-white">ADD TO FLEET</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Admin;
