const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db'); // ✅ MySQL connection

// Multer config to store uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

// ✅ Helper function to calculate name similarity
function calculateMatchPercentage(itemName1, itemName2) {
  if (!itemName1 || !itemName2) return 0;
  const name1 = itemName1.toLowerCase();
  const name2 = itemName2.toLowerCase();
  let matches = 0;
  const len = Math.max(name1.length, name2.length);
  for (let i = 0; i < Math.min(name1.length, name2.length); i++) {
    if (name1[i] === name2[i]) matches++;
  }
  return Math.floor((matches / len) * 100);
}

// -------------------- Report Lost Item --------------------
// -------------------- Report Lost Item --------------------
router.post('/lost', upload.single('image'), (req, res) => {
  const { user_id, item_name, description, category, location, date } = req.body;
  const image = req.file ? req.file.filename : null;

  // ✅ Correct SQL query (no nested const)
  const insertLostSql = `
    INSERT INTO lost_items 
    (user_id, item_name, description, category, location, date, image, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
  `;

  db.query(insertLostSql, [user_id, item_name, description, category, location, date, image], (err, result) => {
    if (err) {
      console.error('❌ Failed to insert lost item:', err);
      return res.status(500).json({ error: 'Failed to add lost item', details: err });
    }

    // ✅ Search for similar FOUND items
    const matchSql = `
      SELECT f.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
      FROM found_items f
      JOIN users u ON f.user_id = u.id
      WHERE f.item_name LIKE ?
    `;
    db.query(matchSql, [`%${item_name}%`], (err, matches) => {
      if (err) {
        console.error('❌ Failed to fetch matches:', err);
        return res.status(500).json({ error: 'Failed to find matches', details: err });
      }
      res.json({ message: 'Lost item reported successfully', itemId: result.insertId, matches });
    });
  });
});


// -------------------- Report Found Item --------------------
// -------------------- Report Found Item --------------------
router.post('/found', upload.single('image'), (req, res) => {
  const { user_id, item_name, description, category, location, date } = req.body;
  const image = req.file ? req.file.filename : null;

  // ✅ Correct SQL query (no nested const)
  const insertFoundSql = `
    INSERT INTO found_items 
    (user_id, item_name, description, category, location, date, image, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, 'available')
  `;

  db.query(insertFoundSql, [user_id, item_name, description, category, location, date, image], (err, result) => {
    if (err) {
      console.error('❌ Failed to insert found item:', err);
      return res.status(500).json({ error: 'Failed to add found item', details: err });
    }

    // ✅ Search for similar LOST items
    const matchSql = `
      SELECT l.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
      FROM lost_items l
      JOIN users u ON l.user_id = u.id
      WHERE l.item_name LIKE ?
    `;
    db.query(matchSql, [`%${item_name}%`], (err, matches) => {
      if (err) {
        console.error('❌ Failed to fetch matches:', err);
        return res.status(500).json({ error: 'Failed to find matches', details: err });
      }
      res.json({ message: 'Found item reported successfully', itemId: result.insertId, matches });
    });
  });
});


// -------------------- Get all lost items by user --------------------
router.get('/lost/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM lost_items WHERE user_id = ?';
  db.query(sql, [userId], (err, lostItems) => {
    if (err) return res.status(500).json({ error: err });
    res.json(lostItems);
  });
});

// -------------------- Get all found items by user --------------------
router.get('/found/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM found_items WHERE user_id = ?';
  db.query(sql, [userId], (err, foundItems) => {
    if (err) return res.status(500).json({ error: err });
    res.json(foundItems);
  });
});

// -------------------- Get matches for a lost item --------------------
router.get('/lost/:itemId/matches', (req, res) => {
  const { itemId } = req.params;

  const sqlLost = 'SELECT * FROM lost_items WHERE id = ?';
  db.query(sqlLost, [itemId], (err, lostRows) => {
    if (err || lostRows.length === 0) return res.status(404).json({ error: 'Lost item not found' });

    const lostItem = lostRows[0];
    const sqlFound = `
      SELECT f.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
      FROM found_items f
      JOIN users u ON f.user_id = u.id
    `;
    db.query(sqlFound, [], (err, foundItems) => {
      if (err) return res.status(500).json({ error: err });

      const matches = foundItems
        .map(f => ({
          ...f,
          match_percentage: calculateMatchPercentage(lostItem.item_name, f.item_name)
        }))
        .filter(m => m.match_percentage >= 50);

      res.json(matches);
    });
  });
});

// -------------------- Get matches for a found item --------------------
router.get('/found/:itemId/matches', (req, res) => {
  const { itemId } = req.params;

  const sqlFound = 'SELECT * FROM found_items WHERE id = ?';
  db.query(sqlFound, [itemId], (err, foundRows) => {
    if (err || foundRows.length === 0) return res.status(404).json({ error: 'Found item not found' });

    const foundItem = foundRows[0];
    const sqlLost = `
      SELECT l.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
      FROM lost_items l
      JOIN users u ON l.user_id = u.id
    `;
    db.query(sqlLost, [], (err, lostItems) => {
      if (err) return res.status(500).json({ error: err });

      const matches = lostItems
        .map(l => ({
          ...l,
          match_percentage: calculateMatchPercentage(foundItem.item_name, l.item_name)
        }))
        .filter(m => m.match_percentage >= 50);

      res.json(matches);
    });
  });
});

// -------------------- Confirm Match (share contact) --------------------
router.post('/match/confirm', (req, res) => {
  const { lost_id, found_id } = req.body;
  const getUserQuery = `
    SELECT u.name AS user_name, u.email AS user_email, u.phone AS user_phone
    FROM users u
    JOIN lost_items l ON u.id = l.user_id
    WHERE l.id = ?
    UNION
    SELECT u.name AS user_name, u.email AS user_email, u.phone AS user_phone
    FROM users u
    JOIN found_items f ON u.id = f.user_id
    WHERE f.id = ?
  `;

  db.query(getUserQuery, [lost_id, found_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, contacts: results });
  });
});

// -------------------- Mark Item as Got/Returned --------------------
router.post('/markGot', (req, res) => {
  const { id } = req.body;
  const updateLost = 'UPDATE lost_items SET status = "completed" WHERE id = ?';
  const updateFound = 'UPDATE found_items SET status = "completed" WHERE id = ?';

  db.query(updateLost, [id], () => {
    db.query(updateFound, [id], () => {
      res.json({ success: true, message: 'Item status updated successfully' });
    });
  });
});

module.exports = router;