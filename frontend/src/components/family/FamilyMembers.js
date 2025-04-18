import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FamilyMemberForm from './FamilyMemberForm';
import '../../styles/Family.css';

const FamilyMembers = () => {
  const [members, setMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/family');
      setMembers(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch family members');
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData) => {
    try {
      const res = await axios.post('/api/family', memberData);
      setMembers([...members, res.data]);
      return true;
    } catch (err) {
      setError('Failed to add family member');
      return false;
    }
  };

  const updateMember = async (id, memberData) => {
    try {
      const res = await axios.put(`/api/family/${id}`, memberData);
      setMembers(members.map(member => 
        member.member_id === id ? res.data : member
      ));
      return true;
    } catch (err) {
      setError('Failed to update family member');
      return false;
    }
  };

  const deleteMember = async (id) => {
    try {
      await axios.delete(`/api/family/${id}`);
      setMembers(members.filter(member => member.member_id !== id));
    } catch (err) {
      setError('Failed to delete family member');
    }
  };

  const editMember = (member) => {
    setCurrentMember(member);
    setIsEditing(true);
  };

  const clearForm = () => {
    setCurrentMember(null);
    setIsEditing(false);
  };

  return (
    <div className="family-members">
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
                              <div className="bg-primary text-white rounded-circle member-avatar me-2">
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
    </div>
  );
};

export default FamilyMembers; 