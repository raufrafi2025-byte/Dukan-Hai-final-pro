import React, { useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div style={{ width: '70px', height: '70px', background: 'var(--primary-soft)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.2rem', color: 'var(--primary)', boxShadow: 'var(--shadow-md)' }}>
            <i className="fas fa-shopping-basket"></i>
          </div>
          <div className="auth-logo text-primary fw-900 outfit" style={{ fontSize: '2.4rem', letterSpacing: '-1.5px' }}>Dukan</div>
          <p className="auth-subtitle mb-0 fw-600 text-muted">Welcome back! Sign in to continue.</p>
        </div>

        {error && (
          <div className="alert alert-danger mb-3">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email"><i className="fas fa-envelope me-1 text-primary"></i>Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="loginPwd"><i className="fas fa-lock me-1 text-primary"></i>Password</label>
            <div className="input-group">
              <input 
                type={showPwd ? 'text' : 'password'} 
                id="loginPwd" 
                className="form-control" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPwd(!showPwd)}>
                <i className={showPwd ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label text-muted small" htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="small text-primary text-decoration-none">Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-3 fw-800 rounded-pill shadow-lg mt-2">
            Sign In <i className="fas fa-arrow-right ms-2"></i>
          </button>
          <p className="text-center text-muted small mb-0 mt-3">
            Don't have an account? <Link to="/register" className="text-primary fw-600 text-decoration-none">Create one</Link>
          </p>
        </form>

        <div className="text-center mt-3">
          <Link to="/" className="text-muted small text-decoration-none"><i className="fas fa-home me-1"></i>Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
