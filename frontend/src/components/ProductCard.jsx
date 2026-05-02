import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product.image ? `/uploads/${product.image}` : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <Card className="product-card h-100 border-0 shadow-sm">
      <div className="position-relative">
        <Link to={`/product/${product._id}`}>
          <Card.Img 
            variant="top" 
            src={imageUrl} 
            alt={product.name}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        </Link>
        {product.discount_price > 0 && (
          <Badge bg="danger" className="position-absolute top-0 end-0 m-2 px-3 py-2 fw-700 rounded-pill">
            Sale
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column p-3">
        {product.category && (
          <small className="text-muted text-uppercase fw-800" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
            {product.category.name}
          </small>
        )}
        <Card.Title className="mt-1 mb-2 fw-800 fs-6 text-truncate">
          <Link to={`/product/${product._id}`} className="text-dark">
            {product.name}
          </Link>
        </Card.Title>
        
        <div className="mt-auto">
          <div className="mb-3">
            {product.discount_price > 0 ? (
              <>
                <span className="text-muted text-decoration-line-through me-2 extra-small">Rs. {product.price}</span>
                <span className="text-primary fw-900 fs-5">Rs. {product.discount_price}</span>
              </>
            ) : (
              <span className="text-primary fw-900 fs-5">Rs. {product.price}</span>
            )}
          </div>
          <Button variant="primary" className="w-100 rounded-pill fw-800 btn-add-to-cart">
            <i className="fas fa-plus me-2"></i>Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
