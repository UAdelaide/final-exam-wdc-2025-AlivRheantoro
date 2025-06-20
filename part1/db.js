import mysql from 'mysql2';

// Connection for when DB is not created yet and not selected.

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
}).promise();

export async function initDatabase() {
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS DogWalkService`);
    await connection.query(`USE DogWalkService`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('owner', 'walker') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Dogs (
        dog_id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        size ENUM('small', 'medium', 'large') NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES Users(user_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS WalkRequests (
        request_id INT AUTO_INCREMENT PRIMARY KEY,
        dog_id INT NOT NULL,
        requested_time DATETIME NOT NULL,
        duration_minutes INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS WalkApplications (
        application_id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL,
        walker_id INT NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
        FOREIGN KEY (walker_id) REFERENCES Users(user_id),
        CONSTRAINT unique_application UNIQUE (request_id, walker_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS WalkRatings (
        rating_id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL,
        walker_id INT NOT NULL,
        owner_id INT NOT NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        comments TEXT,
        rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
        FOREIGN KEY (walker_id) REFERENCES Users(user_id),
        FOREIGN KEY (owner_id) REFERENCES Users(user_id),
        CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
      )
    `);

    console.log("Tables created");

    // Insert Users if none exist
    const [userRows] = await connection.query("SELECT COUNT(*) AS count FROM Users");
    if (userRows[0].count === 0) {
      await connection.query(`
        INSERT INTO Users (username, email, password_hash, role) VALUES
          ('alice123', 'alice@example.com', 'hashed123', 'owner'),
          ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
          ('carol123', 'carol@example.com', 'hashed789', 'owner'),
          ('dogowner', 'dog@example.com', 'hashed111', 'owner'),
          ('eggwalker', 'egg@example.com', 'hashed222', 'walker');
      `);
      console.log("✅ Inserted Users");
    } else {
      console.log("⚠️ Skipped Users (already exists)");
    }

    // Insert Dogs if none exist
    const [dogRows] = await connection.query("SELECT COUNT(*) AS count FROM Dogs");
    if (dogRows[0].count === 0) {
      await connection.query(`
        INSERT INTO Dogs (owner_id, name, size) VALUES
          ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
          ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
          ((SELECT user_id FROM Users WHERE username = 'bobwalker'), 'Bob.jr', 'small'),
          ((SELECT user_id FROM Users WHERE username = 'dogowner'), 'Dug', 'large'),
          ((SELECT user_id FROM Users WHERE username = 'eggwalker'), 'egg', 'small');
      `);
      console.log("Inserted Dogs");
    } else {
      console.log("Skipped Dogs (already exists)");
    }

    // Insert WalkRequests if none exist
    const [walkRows] = await connection.query("SELECT COUNT(*) AS count FROM WalkRequests");
    if (walkRows[0].count === 0) {
      await connection.query(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
          ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
          ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
          ((SELECT dog_id FROM Dogs WHERE name = 'Bob.jr'), '2025-06-10 10:15:00', 60, 'Mayfair', 'accepted'),
          ((SELECT dog_id FROM Dogs WHERE name = 'Dug'), '2025-07-10 11:00:00', 30, 'This Street', 'accepted'),
          ((SELECT dog_id FROM Dogs WHERE name = 'egg'), '2025-07-10 12:30:00', 20, 'That Street', 'cancelled');
      `);
      console.log("Inserted WalkRequests");
    } else {
      console.log("Skipped WalkRequests (already exists)");
    }

  } catch (err) {
    console.error('Failed to initialize DB:', err);
  }
}



export const appPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
}).promise();

export async function getAPIDogs(){
  const [rows] = await connection.query(`
    SELECT
      Dogs.name AS dog_name,
      Dogs.size,
      Users.username AS owner_username
    FROM Dogs
    JOIN Users ON Dogs.owner_id = Users.user_id
  `);
  return rows;
}

export async function getAPIWalkReqsOpen(){
  const [rows] = await connection.query(`
    SELECT
      wr.request_id,
      d.name AS dog_name,
      wr.requested_time,
      wr.duration_minutes,
      wr.location,
      u.username AS owner_username
    FROM WalkRequests wr
    JOIN Dogs d ON wr.dog_id = d.dog_id
    JOIN Users u ON d.owner_id = u.user_id
    WHERE wr.status = 'open'
  `);
  return rows;
}

export async function getAPIWalkerSummary() {
  const [rows] = await connection.query(`
    SELECT
      u.username AS walker_username,
      COUNT(r.rating_id) AS total_ratings,
      ROUND(AVG(r.rating), 1) AS average_rating,
      COUNT(CASE WHEN wr.status = 'completed' THEN 1 END) AS completed_walks
    FROM Users u
    LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id AND wa.status = 'accepted'
    LEFT JOIN WalkRequests wr ON wa.request_id = wr.request_id
    LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
    WHERE u.role = 'walker'
    GROUP BY u.user_id;
  `);
  return rows;
}

export async function getDogs() {
  const [rows] = await appPool.query("SELECT * FROM Dogs");
  return rows;
}
const Dogs = await getDogs();
console.log(Dogs);

