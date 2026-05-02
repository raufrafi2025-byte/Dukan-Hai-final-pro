import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products') // using all products as featured for now
        ]);
        setCategories(catsRes.data);
        setFeaturedProducts(prodsRes.data.slice(0, 8)); // Get first 8
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section py-5" style={{ background: '#f7f9fc', borderRadius: '0 0 80px 80px', position: 'relative', overflow: 'hidden' }}>
        <Container className="py-lg-5">
          <Row className="align-items-center g-5">
            <Col lg={6} className="hero-content" style={{ zIndex: 2 }}>
              <span className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill fw-700 mb-3">
                <i className="fas fa-bolt me-2"></i>Express Delivery
              </span>
              <h1 className="display-2 fw-900 outfit mb-4" style={{ letterSpacing: '-4px', lineHeight: 0.95, color: '#1e272e' }}>
                Groceries <br /><span className="text-primary">Freshly</span> <br />Delivered.
              </h1>
              <p className="lead text-muted mb-5 fw-500">
                Order from your favorite local store and get it delivered in minutes. High quality, fresh essentials at your doorstep.
              </p>
              
              <div className="panda-search-wrap shadow-lg p-2 bg-white rounded-pill d-flex align-items-center mb-4 border">
                <i className="fas fa-search ms-3 text-muted"></i>
                <div className="flex-grow-1" style={{ marginBottom: 0 }}>
                  <input type="text" className="form-control border-0 shadow-none" placeholder="Search for milk, bread, fruits..." style={{ fontSize: '1.1rem', fontWeight: 500 }} />
                </div>
                <button className="btn btn-primary rounded-pill px-4 py-3 fw-800" style={{ minWidth: '140px' }}>Find Food</button>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block text-center position-relative">
              <div className="hero-circle-bg" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '500px', background: 'var(--primary-soft)', borderRadius: '50%', zIndex: 0 }}></div>
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" className="img-fluid rounded-circle shadow-lg position-relative" alt="Groceries" style={{ width: '450px', height: '450px', objectFit: 'cover', border: '15px solid #fff', zIndex: 1 }} />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Circular Categories */}
      <section className="container py-5 mt-n5" style={{ zIndex: 10, position: 'relative' }}>
        <div className="category-scroll-container bg-white p-4 rounded-card shadow-md">
          <h5 className="fw-800 outfit mb-4" style={{ letterSpacing: '-0.5px' }}>Browse by Category</h5>
          {loading ? (
            <p>Loading categories...</p>
          ) : (
            <div className="d-flex gap-4 pb-3 overflow-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat) => (
                <Link to={`/products?category=${cat._id}`} key={cat._id} className="panda-cat-item text-center flex-shrink-0" style={{ width: '100px' }}>
                  <div className="panda-cat-circle shadow-sm mx-auto d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', background: '#f8fbff', borderRadius: '50%', border: '1px solid #f1f2f6' }}>
                    {cat.image ? (
                      <img src={`/uploads/${cat.image}`} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <i className="fas fa-box text-primary fs-3"></i>
                    )}
                  </div>
                  <div className="panda-cat-name mt-2 fw-700 small text-dark">{cat.name}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Section */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="fw-900 outfit mb-1" style={{ letterSpacing: '-1.5px' }}>Fresh Finds Today</h2>
            <p className="text-muted mb-0">Handpicked items for your daily needs</p>
          </div>
          <Link to="/products" className="btn btn-outline-primary rounded-pill px-4 fw-800">
            Explore Store <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        </div>
        
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <Row className="g-4">
            {featuredProducts.map((p) => (
              <Col xs={6} md={4} lg={3} key={p._id}>
                <ProductCard product={p} />
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* Why Dukan Section */}
      <section className="container py-5 mb-5">
        <div className="bg-primary text-white rounded-card p-5 shadow-lg position-relative overflow-hidden" style={{ borderRadius: '40px' }}>
          <Row className="align-items-center">
            <Col lg={7} className="position-relative" style={{ zIndex: 2 }}>
              <h2 className="display-5 fw-900 outfit mb-4" style={{ letterSpacing: '-2px' }}>Dukan for <br />Your Daily Needs</h2>
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <div className="d-flex gap-3 align-items-center">
                    <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}><i className="fas fa-shipping-fast"></i></div>
                    <div className="fw-700 fs-5">30 Min Delivery</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex gap-3 align-items-center">
                    <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}><i className="fas fa-medal"></i></div>
                    <div className="fw-700 fs-5">Premium Quality</div>
                  </div>
                </Col>
              </Row>
              <Link to="/products" className="btn btn-white btn-lg px-5 fw-900 text-primary rounded-pill shadow-lg">Start Shopping</Link>
            </Col>
            <Col lg={5} className="d-none d-lg-block text-center position-relative">
              <i className="fas fa-shopping-basket" style={{ fontSize: '20rem', opacity: 0.1, position: 'absolute', right: '-5rem', top: '50%', transform: 'translateY(-50%)' }}></i>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Home;
