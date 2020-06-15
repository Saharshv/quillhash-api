import { Pool } from "pg";

// POSTGRES DB CONNECTION DETAIL
export const pool =  new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '12345678',
    database: 'quillhash',
    port: 5432    
});

