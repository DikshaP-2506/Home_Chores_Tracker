import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="home-page">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Welcome to Home Chores Tracker</h1>
        <p className="lead">
          The simple way to organize and track chores for your family
        </p>
        
        {!isAuthenticated && (
          <div className="mt-4">
            <Link to="/register" className="btn btn-primary me-3">
              Register
            </Link>
            <Link to="/login" className="btn btn-outline-primary">
              Login
            </Link>
          </div>
        )}
        
        {isAuthenticated && (
          <div className="mt-4">
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>

      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="fas fa-users fa-3x mb-3 text-primary"></i>
              <h3>Manage Family</h3>
              <p>Add family members and assign them specific chores based on their role.</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="fas fa-tasks fa-3x mb-3 text-primary"></i>
              <h3>Track Chores</h3>
              <p>Create chores, assign them to family members, and track their completion.</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="fas fa-chart-line fa-3x mb-3 text-primary"></i>
              <h3>Monitor Progress</h3>
              <p>View statistics and reports on chore completion and family participation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 