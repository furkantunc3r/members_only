const {
    validationResult,
    body
} = require('express-validator');

const messagesService = require("../services/messagesService");

const createTextChain = (name) => body(name).escape().trim().notEmpty().isLength({
    min: 5,
    max: 30
}).withMessage(`${ name } must be between 5-30 characters`);


const messagesMiddleware = {
    createMessage: [
        createTextChain("title"),
        createTextChain("message"),

        function (req, res, next) {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).send({
                    errors: result.array()
                });
            }

            messagesService.createMessage(req.body, req.user.id);

            res.redirect('/');
        }
    ],

    getAllMessages: async function (req, res, next) {
        const messages = await messagesService.getAllMessages();

        return messages;
    },

    deleteMessage: async function (req, res, next) {
        await messagesService.deleteMessage(req.body.messageId);

        res.redirect('/');
    }
};

module.exports = messagesMiddleware;