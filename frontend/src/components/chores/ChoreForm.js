import React, { useState, useEffect } from 'react';

const ChoreForm = ({ currentChore, familyMembers, isEditing, addChore, updateChore, clearForm }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    points: 0,
    status: 'pending'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentChore) {
      let formattedDueDate = '';
      
      if (currentChore.due_date) {
        const dueDate = new Date(currentChore.due_date);
        formattedDueDate = dueDate.toISOString().slice(0, 16);
      }
      
      setFormData({
        title: currentChore.title || '',
        description: currentChore.description || '',
        assigned_to: currentChore.assigned_to || '',
        due_date: formattedDueDate,
        points: currentChore.points || 0,
        status: currentChore.status || 'pending'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assigned_to: '',
        due_date: '',
        points: 0,
        status: 'pending'
      });
    }
  }, [currentChore]);

  const { title, description, assigned_to, due_date, points, status } = formData;

  const onChange = e => {
    let value = e.target.value;
    
    // Convert points to number
    if (e.target.name === 'points') {
      value = parseInt(value) || 0;
    }
    
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    let success;
    if (isEditing) {
      success = await updateChore(currentChore.chore_id, formData);
    } else {
      success = await addChore(formData);
    }

    if (success) {
      setFormData({
        title: '',
        description: '',
        assigned_to: '',
        due_date: '',
        points: 0,
        status: 'pending'
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="chore-form">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          rows="3"
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="assigned_to" className="form-label">Assign To</label>
        <select
          className="form-select"
          id="assigned_to"
          name="assigned_to"
          value={assigned_to}
          onChange={onChange}
        >
          <option value="">Select a family member</option>
          {familyMembers.map(member => (
            <option key={member.member_id} value={member.member_id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-3">
        <label htmlFor="due_date" className="form-label">Due Date</label>
        <input
          type="datetime-local"
          className="form-control"
          id="due_date"
          name="due_date"
          value={due_date}
          onChange={onChange}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="points" className="form-label">Points</label>
        <input
          type="number"
          className="form-control"
          id="points"
          name="points"
          value={points}
          onChange={onChange}
          min="0"
        />
      </div>
      
      {isEditing && (
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={status}
            onChange={onChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
      
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
            isEditing ? 'Update Chore' : 'Add Chore'
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

export default ChoreForm; 