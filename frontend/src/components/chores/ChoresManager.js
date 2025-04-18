import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChoreForm from './ChoreForm';
import ChoresList from './ChoresList';
import '../../styles/Chores.css';

const ChoresManager = () => {
  const [chores, setChores] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [currentChore, setCurrentChore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch chores and family members on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all chores and family members
  const fetchData = async () => {
    try {
      setLoading(true);
      const [choresRes, familyRes] = await Promise.all([
        axios.get('/api/chores'),
        axios.get('/api/family')
      ]);
      
      setChores(choresRes.data);
      setFamilyMembers(familyRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching chores data:', err);
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Failed to load data'
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a new chore
  const addChore = async (choreData) => {
    try {
      await axios.post('/api/chores', choreData);
      fetchData();
      return true;
    } catch (err) {
      console.error('Error adding chore:', err);
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Failed to add chore'
      );
      return false;
    }
  };

  // Update a chore
  const updateChore = async (id, choreData) => {
    try {
      await axios.put(`/api/chores/${id}`, choreData);
      fetchData();
      setIsEditing(false);
      setCurrentChore(null);
      return true;
    } catch (err) {
      console.error('Error updating chore:', err);
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Failed to update chore'
      );
      return false;
    }
  };

  // Delete a chore
  const deleteChore = async (id) => {
    if (window.confirm('Are you sure you want to delete this chore?')) {
      try {
        await axios.delete(`/api/chores/${id}`);
        fetchData();
        setError(null);
      } catch (err) {
        console.error('Error deleting chore:', err);
        setError(
          err.response && err.response.data.msg
            ? err.response.data.msg
            : 'Failed to delete chore'
        );
      }
    }
  };

  // Mark a chore as completed
  const completeChore = async (choreId, memberId) => {
    try {
      await axios.post(`/api/chores/${choreId}/complete`, {
        completed_by: memberId
      });
      fetchData();
      setError(null);
    } catch (err) {
      console.error('Error completing chore:', err);
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Failed to mark chore as completed'
      );
    }
  };

  // Set current chore for editing
  const editChore = (chore) => {
    setCurrentChore(chore);
    setIsEditing(true);
  };

  // Clear form
  const clearForm = () => {
    setCurrentChore(null);
    setIsEditing(false);
  };

  // Filter chores based on active tab
  const filteredChores = chores.filter(chore => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return chore.status === 'pending';
    if (activeTab === 'completed') return chore.status === 'completed';
    return true;
  });

  return (
    <div className="chores-manager">
      <div className="row">
        <div className="col-md-12 mb-4">
          <h1>Chores Manager</h1>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">{isEditing ? 'Edit Chore' : 'Add New Chore'}</h5>
            </div>
            <div className="card-body">
              <ChoreForm 
                currentChore={currentChore}
                familyMembers={familyMembers}
                isEditing={isEditing}
                addChore={addChore}
                updateChore={updateChore}
                clearForm={clearForm}
              />
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('pending')}
                  >
                    Pending
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <ChoresList 
                chores={filteredChores}
                familyMembers={familyMembers}
                loading={loading}
                editChore={editChore}
                deleteChore={deleteChore}
                completeChore={completeChore}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoresManager; 
 