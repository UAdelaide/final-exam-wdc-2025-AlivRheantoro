// seed.js
const db = require('./db');

async function seedDatabase() {
  try {
    const [users] = await db.query('SELECT COUNT(*) AS count FROM Users');
    if (users[0].count > 0) return; // Skip if already seeded

    await db.query(`
      INSERT INTO Users (username, email, password_hash, role) VALUES
      ('alice123', 'alice@example.com', 'hashed123', 'owner'),
      ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
      ('carol123', 'carol@example.com', 'hashed789', 'owner'),
      ('dogowner', 'dog@example.com', 'hashed111', 'owner'),
      ('eggwalker', 'egg@example.com', 'hashed222', 'walker')
    `);

    await db.query(`
      INSERT INTO Dogs (owner_id, name, size) VALUES
      ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
      ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
      ((SELECT user_id FROM Users WHERE username = 'bobwalker'), 'Bob.jr', 'small'),
      ((SELECT user_id FROM Users WHERE username = 'dogowner'), 'Dug', 'large'),
      ((SELECT user_id FROM Users WHERE username = 'eggwalker'), 'egg', 'small')
    `);

    await db.query(`
      INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
      ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
      ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
      ((SELECT dog_id FROM Dogs WHERE name = 'Bob.jr'), '2025-06-10 10:15:00', 60, 'Mayfair', 'accepted'),
      ((SELECT dog_id FROM Dogs WHERE name = 'Dug'), '2025-07-10 11:00:00', 30, 'This Street', 'accepted'),
      ((SELECT dog_id FROM Dogs WHERE name = 'egg'), '2025-07-10 12:30:00', 20, 'That Street', 'cancelled')
    `);

    console.log('Database seeded');
  } catch (err) {
    console.error('Seed error:', err);
  }
}

module.exports = seedDatabase;
