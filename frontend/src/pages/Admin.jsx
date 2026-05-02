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
        <div className="mb-4">
            <h5 className="text-muted small fw-700 mb-1">Welcome back,</h5>
            <h2 className="fw-900 outfit text-primary">Admin Dashboard 👋</h2>
        </div>

      <Row className="g-3 mb-5">
        <Col xs={4}><Card className="premium-kpi-card border-0 shadow-sm bg-white p-3 text-center"><div className="kpi-label">Orders</div><div className="kpi-value fs-3">{orders.length}</div></Card></Col>
        <Col xs={4}><Card className="premium-kpi-card border-0 shadow-sm bg-white p-3 text-center"><div className="kpi-label">Products</div><div className="kpi-value fs-3">{products.length}</div></Card></Col>
        <Col xs={4}><Card className="premium-kpi-card border-0 shadow-sm bg-white p-3 text-center"><div className="kpi-label">Riders</div><div className="kpi-value fs-3">{riders.length}</div></Card></Col>
      </Row>

      <Tab.Container defaultActiveKey="orders">
        <Nav variant="pills" className="mb-4 bg-white p-2 rounded-pill shadow-sm border mx-auto overflow-auto no-scrollbar" style={{width: 'fit-content', flexWrap: 'nowrap'}}>
          <Nav.Item><Nav.Link eventKey="orders" className="rounded-pill px-4 fw-700">Orders</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="products" className="rounded-pill px-4 fw-700">Products</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="categories" className="rounded-pill px-4 fw-700">Categories</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="riders" className="rounded-pill px-4 fw-700">Riders</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="settings" className="rounded-pill px-4 fw-700">Settings</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="orders">
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
                <Table responsive hover className="mb-0">
                    <thead className="bg-light"><tr><th>ID</th><th>User</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>{orders.map(o => (<tr key={o._id}><td>#{o._id.slice(-5)}</td><td>{o.user?.name}</td><td className="fw-800 text-primary">Rs.{o.totalPrice}</td><td><Badge bg="primary" pill>{o.status}</Badge></td></tr>))}</tbody>
                </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="products">
            <div className="d-flex justify-content-between mb-3"><h5 className="fw-800 mb-0">Products</h5><Button variant="primary" size="sm" className="rounded-pill px-3" onClick={() => setShowProdModal(true)}><i className="fas fa-plus me-1"></i>Add New</Button></div>
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
                <Table responsive hover className="mb-0">
                    <tbody>{products.map(p => (<tr key={p._id}><td><img src={p.image} width="40" height="40" className="rounded" style={{objectFit:'cover'}} alt=""/></td><td><div className="fw-700">{p.name}</div><div className="small text-muted">Rs.{p.price}</div></td><td><div className="small text-success fw-700">In Stock</div><div>{p.stock}</div></td></tr>))}</tbody>
                </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="categories">
            <div className="d-flex justify-content-between mb-3"><h5 className="fw-800 mb-0">Categories</h5><Button variant="primary" size="sm" className="rounded-pill px-3" onClick={() => setShowCatModal(true)}><i className="fas fa-plus me-1"></i>Add Category</Button></div>
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
                <Table responsive hover className="mb-0">
                    <tbody>{categories.map(c => (<tr key={c._id}><td><img src={c.image} width="40" height="40" className="rounded-circle" style={{objectFit:'cover'}} alt=""/></td><td><div className="fw-700">{c.name}</div></td></tr>))}</tbody>
                </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="riders">
            <div className="d-flex justify-content-between mb-3"><h5 className="fw-800 mb-0">Riders</h5><Button variant="warning" size="sm" className="rounded-pill px-3 fw-700" onClick={() => setShowRiderModal(true)}><i className="fas fa-user-plus me-1"></i>New Rider</Button></div>
            <Card className="admin-card border-0 shadow-sm overflow-hidden">
                <Table responsive hover className="mb-0">
                    <tbody>{riders.map(r => (<tr key={r._id}><td className="fw-700">{r.name}</td><td className="text-muted">{r.email}</td><td><Badge bg="success" pill>Active</Badge></td></tr>))}</tbody>
                </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="settings">
            <Card className="admin-card border-0 shadow-sm p-4">
               <h5 className="fw-800 mb-4">Store Settings</h5>
               <Form onSubmit={handleUpdateSettings}>
                  <Row className="g-3">
                     <Col xs={12}><Form.Group><Form.Label className="small fw-700">Delivery Fee (Rs.)</Form.Label><Form.Control type="number" className="rounded-pill p-3 border-2" value={settings.deliveryFee} onChange={(e) => setSettings({...settings, deliveryFee: e.target.value})} /></Form.Group></Col>
                     <Col xs={12}><Form.Group><Form.Label className="small fw-700">Free Delivery Above (Rs.)</Form.Label><Form.Control type="number" className="rounded-pill p-3 border-2" value={settings.minOrderForFreeDelivery} onChange={(e) => setSettings({...settings, minOrderForFreeDelivery: e.target.value})} /></Form.Group></Col>
                  </Row>
                  <Button variant="primary" type="submit" className="w-100 mt-4 rounded-pill py-3 fw-800">SAVE SETTINGS</Button>
               </Form>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Modals */}
      <Modal show={showProdModal} onHide={() => setShowProdModal(false)} centered><Modal.Header closeButton className="border-0"><Modal.Title className="fw-900 outfit">New Product</Modal.Title></Modal.Header><Modal.Body><Form onSubmit={handleAddProduct}><Form.Group className="mb-3"><Form.Label className="small fw-700">Name</Form.Label><Form.Control type="text" className="rounded-pill p-3" required onChange={e => setNewProduct({...newProduct, name: e.target.value})} /></Form.Group><Row><Col><Form.Group className="mb-3"><Form.Label className="small fw-700">Price</Form.Label><Form.Control type="number" className="rounded-pill p-3" required onChange={e => setNewProduct({...newProduct, price: e.target.value})} /></Form.Group></Col><Col><Form.Group className="mb-3"><Form.Label className="small fw-700">Stock</Form.Label><Form.Control type="number" className="rounded-pill p-3" required onChange={e => setNewProduct({...newProduct, stock: e.target.value})} /></Form.Group></Col></Row><Form.Group className="mb-3"><Form.Label className="small fw-700">Category</Form.Label><Form.Select className="rounded-pill p-3" required onChange={e => setNewProduct({...newProduct, category: e.target.value})}><option value="">Select</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</Form.Select></Form.Group><Form.Group className="mb-4"><Form.Label className="small fw-700">Image</Form.Label><Form.Control type="file" className="rounded-pill" onChange={e => handleImageChange(e, 'product')} /></Form.Group><Button variant="primary" type="submit" className="w-100 rounded-pill py-3 fw-900 shadow">ADD PRODUCT</Button></Form></Modal.Body></Modal>

      <Modal show={showCatModal} onHide={() => setShowCatModal(false)} centered><Modal.Header closeButton className="border-0"><Modal.Title className="fw-900 outfit">New Category</Modal.Title></Modal.Header><Modal.Body><Form onSubmit={handleAddCategory}><Form.Group className="mb-3"><Form.Label className="small fw-700">Category Name</Form.Label><Form.Control type="text" className="rounded-pill p-3" required value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} /></Form.Group><Form.Group className="mb-4"><Form.Label className="small fw-700">Category Image</Form.Label><Form.Control type="file" className="rounded-pill" onChange={e => handleImageChange(e, 'category')} /></Form.Group><Button variant="primary" type="submit" className="w-100 rounded-pill py-3 fw-900 shadow">ADD CATEGORY</Button></Form></Modal.Body></Modal>

      <Modal show={showRiderModal} onHide={() => setShowRiderModal(false)} centered><Modal.Header closeButton className="border-0"><Modal.Title className="fw-900 outfit">New Rider</Modal.Title></Modal.Header><Modal.Body><Form onSubmit={handleAddRider}><Form.Group className="mb-3"><Form.Label className="small fw-700">Name</Form.Label><Form.Control type="text" className="rounded-pill p-3" required value={newRider.name} onChange={e => setNewRider({...newRider, name: e.target.value})} /></Form.Group><Form.Group className="mb-3"><Form.Label className="small fw-700">Email</Form.Label><Form.Control type="email" className="rounded-pill p-3" required value={newRider.email} onChange={e => setNewRider({...newRider, email: e.target.value})} /></Form.Group><Form.Group className="mb-4"><Form.Label className="small fw-700">Password</Form.Label><Form.Control type="password" placeholder="Min 6 chars" className="rounded-pill p-3" required value={newRider.password} onChange={e => setNewRider({...newRider, password: e.target.value})} /></Form.Group><Button variant="warning" type="submit" className="w-100 rounded-pill py-3 fw-900 shadow">CREATE RIDER</Button></Form></Modal.Body></Modal>
    </Container>
  );
};

export default Admin;
