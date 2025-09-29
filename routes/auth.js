const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'User created successfully' });
        });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

        const user = results[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, name: user.name }, 'secret_key');
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
});
// ✅ Confirm match and store in database (you can create a Matches table)
router.post('/confirm-match', async (req, res) => {
  const { itemId, matchId, type, userId } = req.body;

  try {
    // You can create a new Match model/table (Matches)
    const newMatch = await Match.create({
      user_item_id: itemId,
      matched_item_id: matchId,
      user_id: userId,
      type: type
    });

    res.json({ message: 'Match confirmed! Contact info shared.', match: newMatch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error confirming match' });
  }
});


module.exports = router;