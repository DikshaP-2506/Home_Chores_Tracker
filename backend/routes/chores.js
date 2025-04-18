const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
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
router.get('/member/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const memberCheck = await pool.query(
      'SELECT * FROM family_members WHERE member_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Family member not found or not authorized' });
    }
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
router.post('/', auth, async (req, res) => {
  const { title, description, assigned_to, due_date, points } = req.body;
  try {
    if (assigned_to) {
      const memberCheck = await pool.query(
        'SELECT * FROM family_members WHERE member_id = $1 AND user_id = $2',
        [assigned_to, req.user.id]
      );
      if (memberCheck.rows.length === 0) {
        return res.status(404).json({ msg: 'Family member not found or not authorized' });
      }
    }
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
router.put('/:id', auth, async (req, res) => {
  const { title, description, assigned_to, due_date, points, status } = req.body;
  const { id } = req.params;
  try {
    const choreCheck = await pool.query(
      'SELECT * FROM chores WHERE chore_id = $1 AND created_by = $2',
      [id, req.user.id]
    );
    if (choreCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Chore not found or not authorized' });
    }
    if (assigned_to) {
      const memberCheck = await pool.query(
        'SELECT * FROM family_members WHERE member_id = $1 AND user_id = $2',
        [assigned_to, req.user.id]
      );
      if (memberCheck.rows.length === 0) {
        return res.status(404).json({ msg: 'Family member not found or not authorized' });
      }
    }
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
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const choreCheck = await pool.query(
      'SELECT * FROM chores WHERE chore_id = $1 AND created_by = $2',
      [id, req.user.id]
    );
    if (choreCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Chore not found or not authorized' });
    }
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
router.post('/:id/complete', auth, async (req, res) => {
  const { id } = req.params;
  const { completed_by, notes } = req.body;
  try {
    const choreCheck = await pool.query(
      'SELECT * FROM chores WHERE chore_id = $1',
      [id]
    );
    if (choreCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Chore not found' });
    }
    const memberCheck = await pool.query(
      'SELECT * FROM family_members WHERE member_id = $1 AND user_id = $2',
      [completed_by, req.user.id]
    );
    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Family member not found or not authorized' });
    }
    const completedChore = await pool.query(
      'INSERT INTO completed_chores (chore_id, completed_by, approved_by, notes) VALUES($1, $2, $3, $4) RETURNING *',
      [id, completed_by, req.user.id, notes]
    );
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