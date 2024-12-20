const express = require('express');

const messagesMiddleware = require("../middlewares/messagesMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get('/create', authMiddleware.ensureAuthenticated, (req, res, next) => {
    res.render('create_message_form');
});
router.post('/create', authMiddleware.ensureAuthenticated, messagesMiddleware.createMessage);
router.post('/delete', authMiddleware.checkForGivenRole("admin"), messagesMiddleware.deleteMessage)

module.exports = router;