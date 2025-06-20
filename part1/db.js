import mysql from 'mysql2';
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
}).promise();

async function getDogs() {
    const [rows] = await pool.query("Select * FROM Dogs");
    return rows;
}

const Dogs = await getDogs();
console.log(Dogs);

