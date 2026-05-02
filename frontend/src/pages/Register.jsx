import React, { useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="auth-logo text-primary fw-900 outfit" style={{ fontSize: '2.4rem', letterSpacing: '-1.5px' }}>Dukan</div>
          <p className="auth-subtitle mb-0 fw-600 text-muted">Create an account to start shopping.</p>
        </div>

        {error && (
          <div className="alert alert-danger mb-3">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name"><i className="fas fa-user me-1 text-primary"></i>Full Name</label>
            <input type="text" id="name" className="form-control" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email"><i className="fas fa-envelope me-1 text-primary"></i>Email Address</label>
            <input type="email" id="email" className="form-control" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="regPwd"><i className="fas fa-lock me-1 text-primary"></i>Password</label>
            <div className="input-group">
              <input type={showPwd ? 'text' : 'password'} id="regPwd" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPwd(!showPwd)}><i className={showPwd ? "fas fa-eye-slash" : "fas fa-eye"}></i></button>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="regPwdConf"><i className="fas fa-check-circle me-1 text-primary"></i>Confirm Password</label>
            <input type={showPwd ? 'text' : 'password'} id="regPwdConf" className="form-control" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-3 fw-800 rounded-pill shadow-lg mt-2">
            Create Account <i className="fas fa-user-plus ms-2"></i>
          </button>
          <p className="text-center text-muted small mb-0 mt-3">
            Already have an account? <Link to="/login" className="text-primary fw-600 text-decoration-none">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
