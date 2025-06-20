import mysql from 'mysql2';

//a connection only if 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
}).promise();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
}).promise();

export async function getDogs() {
    const [rows] = await pool.query("Select * FROM Dogs");
    return rows;
}

const Dogs = await getDogs();
console.log(Dogs);

