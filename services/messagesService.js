const pool = require("./connectDB");

const messagesService = {
    createMessage: async function (message, userId) {
        try {
            const result = await pool.query("INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3)", [
                message.title,
                message.message,
                userId,
            ]);

            return result.rows[0];
        } catch (err) {
            console.error(err);

            return;
        }
    },

    getAllMessages: async function () {
        try {
            const result = await pool.query("SELECT * FROM messages");

            return result.rows;
        } catch (err) {
            console.error(err);

            return;
        }
    },

    deleteMessage: async function (id) {
        try {
            const result = await pool.query("DELETE FROM messages WHERE id = $1", [id]);

            return result.rows;
        } catch (err) {
            console.error(err);

            return;
        }
    }
};

module.exports = messagesService;