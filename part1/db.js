import mysql from 'mysql2'
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
}).promise()

async function getDogs()
const result = await pool.query("Select * FROM Dogs")
console.log(result)


