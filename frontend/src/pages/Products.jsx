import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const categoryFilter = query.get('category');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products')
        ]);
        setCategories(catsRes.data);
        
        let fetchedProducts = prodsRes.data;
        if (categoryFilter) {
          fetchedProducts = fetchedProducts.filter(p => p.category && p.category._id === categoryFilter);
        }
        
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryFilter]);

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item active">All Products</li>
        </ol>
      </nav>

      <Row className="g-4">
        {/* Sidebar Filter */}
        <Col lg={3}>
          <div className="bg-white p-4 rounded-card shadow-sm border">
            <h6 className="fw-800"><i className="fas fa-filter me-2 text-primary"></i>Filters</h6>
            <hr />
            
            {/* Categories */}
            <div className="mb-4">
              <p className="fw-700 small mb-2 text-muted text-uppercase">Category</p>
              <div className="filter-check">
                <Form.Check 
                  type="radio" 
                  id="cat_all" 
                  label="All Categories" 
                  name="category"
                  checked={!categoryFilter}
                  onChange={() => window.location.href='/products'}
                  className="mb-2"
                />
                {categories.map((cat) => (
                  <Form.Check 
                    key={cat._id}
                    type="radio" 
                    id={`cat_${cat._id}`} 
                    label={cat.name} 
                    name="category"
                    checked={categoryFilter === cat._id}
                    onChange={() => window.location.href=`/products?category=${cat._id}`}
                    className="mb-2"
                  />
                ))}
              </div>
            </div>

            <Button variant="outline-secondary" size="sm" className="w-100 mt-2" onClick={() => window.location.href='/products'}>Clear Filters</Button>
          </div>
        </Col>

        {/* Products Grid */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-800 mb-0 outfit">All Products</h5>
              <small className="text-muted">{products.length} products found</small>
            </div>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <div className="empty-state bg-white rounded-card p-5 text-center shadow-sm border">
              <div className="empty-icon fs-1 text-muted mb-3"><i className="fas fa-search"></i></div>
              <h4 className="fw-800">No products found</h4>
              <p className="text-muted">Try adjusting your filters.</p>
              <Link to="/products" className="btn btn-primary mt-2 rounded-pill px-4 fw-700">Browse All Products</Link>
            </div>
          ) : (
            <Row className="g-3">
              {products.map((p) => (
                <Col xs={6} md={4} key={p._id}>
                  <ProductCard product={p} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
