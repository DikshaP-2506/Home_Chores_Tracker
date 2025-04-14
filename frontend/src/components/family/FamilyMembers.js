import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FamilyMemberForm from './FamilyMemberForm';

const FamilyMembers = () => {
  const [members, setMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch family members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  // Fetch all family members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/family');
      setMembers(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching family members:', err);
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Failed to load family members'
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a new family member
  const addMember = async (memberData) => {
    try {
      await axios.post('/api/family', memberData);
      fetchMembers();
      return true;
    } catch (err) {
      console.error('Error adding family member:', err);
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Failed to add family member'
      );
      return false;
    }
  };

  // Update a family member
  const updateMember = async (id, memberData) => {
    try {
      await axios.put(`/api/family/${id}`, memberData);
      fetchMembers();
      setIsEditing(false);
      setCurrentMember(null);
      return true;
    } catch (err) {
      console.error('Error updating family member:', err);
      setError(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Failed to update family member'
      );
      return false;
    }
  };

  // Delete a family member
  const deleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this family member?')) {
      try {
        console.log(`Attempting to delete member with ID: ${id}`);
        const response = await axios.delete(`/api/family/${id}`);
        console.log('Delete response:', response);
        
        // Check if we got a successful response
        if (response.status === 200) {
          console.log('Successfully deleted family member');
          await fetchMembers(); // Refresh the list
          setError(null);
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error deleting family member:', err);
        
        // Additional debugging info
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', err.response.data);
          console.error('Error response status:', err.response.status);
          console.error('Error response headers:', err.response.headers);
        } else if (err.request) {
          // The request was made but no response was received
          console.error('Error request:', err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', err.message);
        }
        
        setError(
          err.response && err.response.data.msg
            ? err.response.data.msg
            : 'Failed to delete family member'
        );
      }
    }
  };

  // Set current member for editing
  const editMember = (member) => {
    setCurrentMember(member);
    setIsEditing(true);
  };

  // Clear form
  const clearForm = () => {
    setCurrentMember(null);
    setIsEditing(false);
  };

  return (
    <div className="row">
      <div className="col-md-12 mb-4">
        <h1>Family Members</h1>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
      
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">{isEditing ? 'Edit Member' : 'Add New Member'}</h5>
          </div>
          <div className="card-body">
            <FamilyMemberForm 
              currentMember={currentMember}
              isEditing={isEditing}
              addMember={addMember}
              updateMember={updateMember}
              clearForm={clearForm}
            />
          </div>
        </div>
      </div>
      
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Family Members List</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border"></div>
              </div>
            ) : members.length === 0 ? (
              <p className="text-center">No family members added yet</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member.member_id}>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                              style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{member.name}</span>
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => editMember(member)}
                          >
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteMember(member.member_id)}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMembers; 