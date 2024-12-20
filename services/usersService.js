const bcrypt = require('bcryptjs');
const pool = require("./connectDB");

const usersService = {
    createUser: (user) => {
        bcrypt.hash(user.password, 10, async (err, hash) => {
            if (err) {
                console.log('Could not hash password!');

                return;
            }

            try {
                const result = await pool.query("INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)", [
                    user.firstname,
                    user.lastname,
                    user.email,
                    hash
                ]);

                return result.rows[0];
            } catch (err) {
                console.error(err);

                return;
            }
        });
    },

    getUserByEmail: async (email) => {
        try {
            const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

            return result.rows[0];
        } catch (err) {
            console.error(err);

            return;
        }
    },

    getUserById: async (id) => {
        try {
            const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

            return result.rows[0];
        } catch (err) {
            console.error(err);

            return;
        }
    },

    updateUserStatus: async (id) => {
        try {
            const result = await pool.query("UPDATE users SET status = 'gold' WHERE id = $1", [id]);

            return result.rows[0];
        } catch (err) {
            console.error(err);

            return;
        }
    }
};

module.exports = usersService;