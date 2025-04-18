import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/pages/Dashboard';
import FamilyMembers from './components/family/FamilyMembers';
import ChoresManager from './components/chores/ChoresManager';

import AuthContext from './context/AuthContext';
axios.defaults.baseURL = 'http://localhost:5000';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        axios.defaults.headers.common['x-auth-token'] = token;
        const res = await axios.get('/api/users/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setError('Authentication failed, please login again');
      }
      setLoading(false);
    };
    checkAuth();
  }, []);
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Auto logout on auth errors
          logout();
          setError('Your session has expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['x-auth-token'] = token;
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
  };
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
  };
  const PrivateRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        loading, 
        error, 
        login, 
        logout
      }}
    >
      <Router>
        <div className="App">
          <Navbar />
          <div className="container py-4">
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/family" 
                element={
                  <PrivateRoute>
                    <FamilyMembers />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/chores" 
                element={
                  <PrivateRoute>
                    <ChoresManager />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
export default App;
