import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-up">
      {/* Hero Section (Exact Photo Style) */}
      <section className="py-5 bg-white overflow-hidden">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="d-inline-flex align-items-center bg-primary-soft text-primary px-3 py-2 rounded-pill mb-4 small fw-800">
                <i className="fas fa-truck me-2"></i>30 Minute Delivery
              </div>
              <h1 className="hero-title outfit fw-900 mb-4" style={{fontSize: 'clamp(3rem, 8vw, 5rem)', lineHeight: '1'}}>
                Groceries <span className="text-primary">Freshly</span> <br />Delivered.
              </h1>
              <p className="lead text-muted mb-5 fw-600 opacity-75">Order from your favorite local store and get it delivered in minutes. High quality, fresh essentials at your doorstep.</p>
              
              <div className="bg-light p-2 rounded-pill shadow-sm border d-flex align-items-center mb-4" style={{maxWidth: '500px'}}>
                <i className="fas fa-search text-muted ms-3 me-2"></i>
                <Form.Control type="text" placeholder="Search for milk, bread, fruit..." className="border-0 bg-transparent shadow-none py-2" />
                <Button variant="primary" className="rounded-pill px-4 ms-2 fw-800">Find Food</Button>
              </div>
            </Col>
            <Col lg={6} className="text-center mobile-hide">
              <div className="position-relative">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" className="img-fluid shadow-lg" style={{borderRadius: '60px', transform: 'rotate(-2deg)'}} alt="Hero" />
                <div className="bg-white p-3 rounded-lg shadow-lg position-absolute bottom-0 start-0 m-4 animate-up border d-flex align-items-center gap-2">
                   <div className="bg-success rounded-circle p-1 text-white small"><i className="fas fa-check"></i></div>
                   <div className="fw-900 small">100% Organic</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories (Photo Style) */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h6 className="text-primary fw-800 small mb-1">SHOP BY</h6>
                <h3 className="fw-900 outfit mb-0">Categories</h3>
            </div>
            <Link to="/products" className="text-primary fw-800 text-decoration-none small">View All <i className="fas fa-arrow-right ms-1"></i></Link>
        </div>
        <div className="d-flex gap-4 overflow-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <Link to={`/products?category=${cat._id}`} key={cat._id} className="text-decoration-none text-center" style={{minWidth: '100px'}}>
              <div className="bg-white shadow-sm rounded-circle p-1 border-2 border-transparent hover-border-primary mx-auto mb-2" style={{width: '90px', height: '90px', transition: '0.3s'}}>
                <img src={cat.image} width="100%" height="100%" className="rounded-circle" style={{objectFit: 'cover'}} alt={cat.name} />
              </div>
              <span className="fw-800 text-dark" style={{fontSize: '12px'}}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </Container>

      {/* Popular Products (Photo Style) */}
      <Container className="py-4 pb-5 mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
            <h3 className="fw-900 outfit mb-0">Popular Products</h3>
            <Link to="/products" className="text-primary fw-800 text-decoration-none small">View All</Link>
        </div>
        <Row className="g-3">
          {products.slice(0, 4).map(product => (
            <Col xs={6} md={3} key={product._id}>
              <Card className="h-100 border-0 shadow-sm overflow-hidden p-2">
                <div className="position-relative bg-light rounded-lg overflow-hidden" style={{height: '140px'}}>
                  <img src={product.image} className="w-100 h-100" style={{objectFit: 'cover'}} alt={product.name} />
                  {product.originalPrice > product.price && (
                    <Badge bg="primary" className="position-absolute top-0 start-0 m-2 px-2 py-1" style={{fontSize: '10px'}}>SAVE Rs.{product.originalPrice - product.price}</Badge>
                  )}
                </div>
                <Card.Body className="px-1 py-3 text-start">
                  <h6 className="fw-900 mb-1 outfit">{product.name}</h6>
                  <div className="text-muted small mb-3 fw-700">{product.unit}</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-900 text-primary">Rs. {product.price}</span>
                    <Button variant="primary" size="sm" className="rounded-pill px-3 fw-800" style={{fontSize: '11px'}}>+ Add</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
