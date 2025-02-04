const {
    Pool
} = require('pg');

const pool = new Pool({
    user: '',
    password: '',
    database: '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

module.exports = pool;