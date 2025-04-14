import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get family members and chores on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [familyRes, choresRes] = await Promise.all([
          axios.get('/api/family'),
          axios.get('/api/chores')
        ]);

        setFamilyMembers(familyRes.data);
        setChores(choresRes.data);
        setError(null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(
          err.response && err.response.data.msg
            ? err.response.data.msg
            : 'Failed to load dashboard data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalChores = chores.length;
  const completedChores = chores.filter(chore => chore.status === 'completed').length;
  const pendingChores = totalChores - completedChores;
  const completionRate = totalChores > 0 ? Math.round((completedChores / totalChores) * 100) : 0;

  // Group chores by family member
  const choresByMember = chores.reduce((acc, chore) => {
    if (chore.assigned_to) {
      if (!acc[chore.assigned_to]) {
        acc[chore.assigned_to] = [];
      }
      acc[chore.assigned_to].push(chore);
    }
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="bg-light p-4 rounded-3 mb-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%)' }}>
        <h1 className="mb-2 fw-bold">
          <i className="fas fa-tachometer-alt me-2 text-primary"></i>
          Dashboard
        </h1>
        <p className="text-muted">Manage and track your family's chores</p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-list-ul fa-2x mb-3"></i>
              <h3>{totalChores}</h3>
              <p className="mb-0">Total Chores</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-check-circle fa-2x mb-3"></i>
              <h3>{completedChores}</h3>
              <p className="mb-0">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="fas fa-clock fa-2x mb-3"></i>
              <h3>{pendingChores}</h3>
              <p className="mb-0">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-chart-pie fa-2x mb-3"></i>
              <h3>{completionRate}%</h3>
              <p className="mb-0">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center bg-white">
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-users me-2 text-primary"></i>
                Family Members
              </h5>
              <Link to="/family" className="btn btn-sm btn-primary">
                <i className="fas fa-cog me-1"></i> Manage
              </Link>
            </div>
            <div className="card-body">
              {familyMembers.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No family members added yet</p>
                  <Link to="/family" className="btn btn-outline-primary btn-sm">
                    <i className="fas fa-plus me-1"></i> Add Family Member
                  </Link>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {familyMembers.map(member => (
                    <li 
                      key={member.member_id} 
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                    >
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                          style={{ width: '40px', height: '40px' }}>
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-medium">{member.name}</span>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {choresByMember[member.member_id] ? choresByMember[member.member_id].length : 0} chores
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center bg-white">
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-clipboard-list me-2 text-primary"></i>
                Recent Chores
              </h5>
              <Link to="/chores" className="btn btn-sm btn-primary">
                <i className="fas fa-plus me-1"></i> Manage
              </Link>
            </div>
            <div className="card-body">
              {chores.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No chores added yet</p>
                  <Link to="/chores" className="btn btn-outline-primary btn-sm">
                    <i className="fas fa-plus me-1"></i> Add Chore
                  </Link>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {chores.slice(0, 5).map(chore => (
                    <li 
                      key={chore.chore_id} 
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                    >
                      <div>
                        <div className="fw-medium">{chore.title}</div>
                        {chore.due_date && (
                          <small className="text-muted">
                            <i className="far fa-calendar-alt me-1"></i>
                            {new Date(chore.due_date).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                      <span className={`badge ${
                        chore.status === 'completed' ? 'bg-success' : 'bg-warning'
                      } rounded-pill`}>
                        {chore.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {chores.length > 0 && (
              <div className="card-footer bg-white text-center">
                <Link to="/chores" className="text-decoration-none">View all chores</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 