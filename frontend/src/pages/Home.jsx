import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
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
        setProducts(prodRes.data.slice(0, 8));
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
      {/* Hero Section */}
      <section className="hero-section text-center text-md-start">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <Badge bg="primary-light" className="text-primary px-3 py-2 rounded-pill mb-3 fw-700">
                <i className="fas fa-truck me-2"></i>30 Minute Delivery
              </Badge>
              <h1 className="hero-title outfit fw-900 mb-4">
                Groceries <span className="text-primary">Freshly</span> <br />Delivered.
              </h1>
              <p className="lead text-muted mb-5 fw-500">Order from your favorite local store and get it delivered in minutes. High quality, fresh essentials at your doorstep.</p>
              
              <div className="search-box bg-white p-2 rounded-pill shadow-lg border d-flex align-items-center mb-4">
                <i className="fas fa-search text-muted ms-3 me-2"></i>
                <Form.Control type="text" placeholder="Search for milk, bread, fruit..." className="border-0 shadow-none py-2" />
                <Button variant="primary" className="rounded-pill px-4 ms-2">Find Food</Button>
              </div>
            </Col>
            <Col md={6} className="text-center mobile-hide">
              <div className="position-relative">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" className="img-fluid rounded-lg shadow-2xl" style={{borderRadius: '40px', transform: 'rotate(-2deg)'}} alt="Hero" />
                <div className="bg-white p-3 rounded-xl shadow-lg position-absolute bottom-0 start-0 m-4 animate-up border" style={{width: '200px'}}>
                   <div className="d-flex align-items-center gap-2">
                      <div className="bg-success rounded-circle p-1"><i className="fas fa-check text-white small"></i></div>
                      <div className="fw-800 small">100% Organic</div>
                   </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Horizontal Scroll */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-800 outfit mb-0">Browse Categories</h4>
            <Link to="/products" className="text-primary fw-700 text-decoration-none">View All <i className="fas fa-arrow-right ms-1"></i></Link>
        </div>
        <div className="d-flex gap-4 overflow-auto pb-3 no-scrollbar">
          {categories.map(cat => (
            <Link to={`/products?category=${cat._id}`} key={cat._id} className="category-item">
              <div className="category-circle">
                <img src={cat.image} width="50" height="50" className="rounded-circle" style={{objectFit: 'cover'}} alt={cat.name} />
              </div>
              <span className="fw-700 small">{cat.name}</span>
            </Link>
          ))}
        </div>
      </Container>

      {/* Featured Products */}
      <Container className="py-4 mb-5">
        <h4 className="fw-800 outfit mb-4">Popular Near You</h4>
        <Row className="g-4">
          {products.map(product => (
            <Col xs={6} md={3} key={product._id}>
              <Card className="product-card h-100 shadow-sm border-0">
                <div className="product-image-wrap">
                  {product.originalPrice > product.price && (
                    <div className="discount-badge">
                      -{Math.round((1 - product.price/product.originalPrice) * 100)}%
                    </div>
                  )}
                  <img src={product.image} className="product-image" alt={product.name} />
                </div>
                <Card.Body className="p-3">
                  <div className="text-muted small mb-1 fw-600 uppercase">{product.unit}</div>
                  <Card.Title className="fw-800 fs-6 mb-2">{product.name}</Card.Title>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <span className="fw-900 text-primary fs-5">Rs. {product.price}</span>
                        {product.originalPrice > product.price && (
                            <div className="text-muted text-decoration-line-through small">Rs. {product.originalPrice}</div>
                        )}
                    </div>
                    <Button variant="light" className="rounded-circle shadow-sm border p-0" style={{width: '35px', height: '35px'}}>
                      <i className="fas fa-plus text-primary"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Mobile Special Promo */}
      <Container className="mb-5 d-md-none">
          <div className="bg-primary p-4 rounded-xl text-white overflow-hidden position-relative">
              <h4 className="fw-900 mb-2">Free Delivery!</h4>
              <p className="mb-0 opacity-75 small">On your first 3 orders above Rs. 500</p>
              <i className="fas fa-gift position-absolute opacity-25" style={{fontSize: '5rem', right: '-10px', bottom: '-10px'}}></i>
          </div>
      </Container>
    </div>
  );
};

const Badge = ({ children, bg, className }) => (
    <span className={`badge ${className}`} style={{background: bg === 'primary-light' ? 'var(--primary-light)' : ''}}>
        {children}
    </span>
);

export default Home;
