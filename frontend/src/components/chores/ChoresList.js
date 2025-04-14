import React from 'react';

const ChoresList = ({ chores, familyMembers, loading, editChore, deleteChore, completeChore }) => {
  // Format date to readable format
  const formatDate = dateString => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get family member name by ID
  const getMemberName = id => {
    if (!id) return 'Unassigned';
    
    const member = familyMembers.find(m => m.member_id === id);
    return member ? member.name : 'Unknown';
  };

  const handleComplete = (choreId, assignedId) => {
    if (!assignedId) {
      alert('This chore is not assigned to anyone');
      return;
    }
    
    completeChore(choreId, assignedId);
  };

  if (loading) {
    return (
      <div className="text-center my-4">
        <div className="spinner-border"></div>
      </div>
    );
  }

  if (chores.length === 0) {
    return <p className="text-center">No chores found</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Points</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chores.map(chore => (
            <tr key={chore.chore_id} className={chore.status === 'completed' ? 'table-success' : ''}>
              <td>{chore.title}</td>
              <td>{getMemberName(chore.assigned_to)}</td>
              <td>{formatDate(chore.due_date)}</td>
              <td>{chore.points}</td>
              <td>
                <span className={`badge ${
                  chore.status === 'completed' ? 'bg-success' : 'bg-warning'
                }`}>
                  {chore.status}
                </span>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => editChore(chore)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deleteChore(chore.chore_id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  
                  {chore.status !== 'completed' && (
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleComplete(chore.chore_id, chore.assigned_to)}
                      disabled={!chore.assigned_to}
                      title={!chore.assigned_to ? 'Chore must be assigned to be completed' : ''}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChoresList; 