import sql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DATABASE;


const db = sql.createPool({
    host: host,
    user: user,
    password: password,
    database: database
})

export default db;