const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// @route   GET api/chores
// @desc    Get all chores for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const chores = await pool.query(
      `SELECT c.*, f.name as assigned_to_name 
       FROM chores c 
       LEFT JOIN family_members f ON c.assigned_to = f.member_id 
       WHERE c.created_by = $1`,
      [req.user.id]
    );

    res.json(chores.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/chores/member/:id
// @desc    Get all chores for a specific family member
// @access  Private
router.get('/member/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if family member belongs to user
    const memberCheck = await pool.query(
      'SELECT * FROM family_members WHERE member_id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Family member not found or not authorized' });
    }

    // Get chores for member
    const chores = await pool.query(
      'SELECT * FROM chores WHERE assigned_to = $1',
      [id]
    );

    res.json(chores.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/chores
// @desc    Create a new chore
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, assigned_to, due_date, points } = req.body;

  try {
    // Check if assigned family member belongs to user
    if (assigned_to) {
      const memberCheck = await pool.query(
        'SELECT * FROM family_members WHERE member_id = $1 AND user_id = $2',
        [assigned_to, req.user.id]
      );

      if (memberCheck.rows.length === 0) {
        return res.status(404).json({ msg: 'Family member not found or not authorized' });
      }
    }

    // Create chore
    const newChore = await pool.query(
      'INSERT INTO chores (title, description, created_by, assigned_to, due_date, points) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, req.user.id, assigned_to, due_date, points]
    );

    res.json(newChore.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/chores/:id
// @desc    Update a chore
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, assigned_to, due_date, points, status } = req.body;
  const { id } = req.params;

  try {
    // Check if chore exists and belongs to user
    const choreCheck = await pool.query(
      'SELECT * FROM chores WHERE chore_id = $1 AND created_by = $2',
      [id, req.user.id]
    );

    if (choreCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Chore not found or not authorized' });
    }

    // Check if assigned family member belongs to user
    if (assigned_to) {
      const memberCheck = await pool.query(
        'SELECT * FROM family_members WHERE member_id = $1 AND user_id = $2',
        [assigned_to, req.user.id]
      );

      if (memberCheck.rows.length === 0) {
        return res.status(404).json({ msg: 'Family member not found or not authorized' });
      }
    }

    // Update chore
    const updatedChore = await pool.query(
      'UPDATE chores SET title = $1, description = $2, assigned_to = $3, due_date = $4, points = $5, status = $6 WHERE chore_id = $7 RETURNING *',
      [title, description, assigned_to, due_date, points, status, id]
    );

    res.json(updatedChore.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/chores/:id
// @desc    Delete a chore
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if chore exists and belongs to user
    const choreCheck = await pool.query(
      'SELECT * FROM chores WHERE chore_id = $1 AND created_by = $2',
      [id, req.user.id]
    );

    if (choreCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Chore not found or not authorized' });
    }

    // Delete chore
    await pool.query(
      'DELETE FROM chores WHERE chore_id = $1',
      [id]
    );

    res.json({ msg: 'Chore removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/chores/:id/complete
// @desc    Mark a chore as completed
// @access  Private
router.post('/:id/complete', auth, async (req, res) => {
  const { id } = req.params;
  const { completed_by, notes } = req.body;

  try {
    // Check if chore exists
    const choreCheck = await pool.query(
      'SELECT * FROM chores WHERE chore_id = $1',
      [id]
    );

    if (choreCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Chore not found' });
    }

    // Check if family member belongs to user
    const memberCheck = await pool.query(
      'SELECT * FROM family_members WHERE member_id = $1 AND user_id = $2',
      [completed_by, req.user.id]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Family member not found or not authorized' });
    }

    // Mark chore as completed
    const completedChore = await pool.query(
      'INSERT INTO completed_chores (chore_id, completed_by, approved_by, notes) VALUES($1, $2, $3, $4) RETURNING *',
      [id, completed_by, req.user.id, notes]
    );

    // Update chore status
    await pool.query(
      'UPDATE chores SET status = $1 WHERE chore_id = $2',
      ['completed', id]
    );

    res.json(completedChore.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 