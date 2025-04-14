import React, { useState, useEffect } from 'react';

const FamilyMemberForm = ({ currentMember, isEditing, addMember, updateMember, clearForm }) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(false);

  // Set form data when editing a member
  useEffect(() => {
    if (currentMember) {
      setFormData({
        name: currentMember.name || ''
      });
    } else {
      setFormData({
        name: ''
      });
    }
  }, [currentMember]);

  const { name } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    let success;
    if (isEditing) {
      success = await updateMember(currentMember.member_id, formData);
    } else {
      success = await addMember(formData);
    }

    if (success) {
      setFormData({
        name: ''
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="d-flex">
        <button
          type="submit"
          className="btn btn-primary flex-grow-1"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {isEditing ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            isEditing ? 'Update Member' : 'Add Member'
          )}
        </button>
        
        {isEditing && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={clearForm}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default FamilyMemberForm; 