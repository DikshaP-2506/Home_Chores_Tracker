import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/users/login', {
        username,
        password
      });

      if (res.data.token) {
        // Get user data
        const userRes = await axios.get('/api/users/me', {
          headers: {
            'x-auth-token': res.data.token
          }
        });
        
        login(res.data.token, userRes.data);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Login failed. Please check your credentials.'
      );
    }
    
    setLoading(false);
  };

  return (
    <div className="row justify-content-center auth-form">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <i className="fas fa-user-circle fa-3x text-primary mb-3"></i>
              <h2 className="fw-bold">Welcome Back</h2>
              <p className="text-muted">Sign in to manage your family chores</p>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="form-label">Username</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={username}
                    onChange={onChange}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mt-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p>
                Don't have an account? <Link to="/register" className="text-primary fw-bold">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 