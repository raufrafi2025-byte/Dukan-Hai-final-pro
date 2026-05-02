import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Container className="py-5"><h2>Loading...</h2></Container>;
  if (!product.name) return <Container className="py-5"><h2>Product not found</h2></Container>;

  const imageUrl = product.image ? `/uploads/${product.image}` : 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <Container className="py-5">
      <Link to="/products" className="btn btn-light mb-4 rounded-pill shadow-sm">
        <i className="fas fa-arrow-left me-2"></i>Back to Shop
      </Link>
      <Row className="bg-white p-4 p-md-5 rounded-card shadow-lg align-items-center">
        <Col md={6} className="text-center mb-4 mb-md-0 position-relative">
          {product.discount_price > 0 && (
            <Badge bg="danger" className="position-absolute top-0 start-0 m-3 px-3 py-2 fw-800 rounded-pill fs-6" style={{zIndex: 2}}>
              Sale
            </Badge>
          )}
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="img-fluid"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </Col>
        <Col md={6}>
          {product.category && (
            <div className="text-primary fw-800 text-uppercase mb-2" style={{ letterSpacing: '1px' }}>
              {product.category.name}
            </div>
          )}
          <h1 className="fw-900 outfit mb-3" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>{product.name}</h1>
          <hr className="my-4" />
          
          <div className="mb-4">
            {product.discount_price > 0 ? (
              <div className="d-flex align-items-center gap-3">
                <span className="display-5 fw-900 text-primary">Rs. {product.discount_price}</span>
                <span className="text-muted text-decoration-line-through fs-4">Rs. {product.price}</span>
              </div>
            ) : (
              <span className="display-5 fw-900 text-primary">Rs. {product.price}</span>
            )}
          </div>

          <p className="lead text-muted mb-4">{product.description}</p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'} px-3 py-2 rounded-pill fw-700`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
            {product.stock > 0 && <span className="text-muted fw-600">{product.stock} items available</span>}
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            className="rounded-pill px-5 py-3 fw-900 w-100 shadow-sm btn-add-to-cart"
            disabled={product.stock === 0}
          >
            <i className="fas fa-shopping-cart me-2"></i> Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
