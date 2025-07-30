import {Pool} from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const PGUSER = process.env.PGUSER
const PGHOST = process.env.PGHOST
const PGDATABASE = process.env.PGDATABASE
const PGPASSWORD = process.env.PGPASSWORD
const PGPORT = process.env.PGPORT

const pool = new Pool({
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: PGPORT
})

export default pool