const {
    validationResult,
    body
} = require('express-validator');

const usersService = require("../services/usersService");
const authMiddleware = require("../middlewares/authMiddleware");

const createTextChain = (name) => body(name).escape().trim().notEmpty().isLength({
    min: 5,
    max: 30
}).withMessage(`${ name } must be between 5-30 characters`);

const usersMiddleware = {
    userSignUp: [
        createTextChain("firstname"),
        createTextChain("lastname"),
        createTextChain("email").isEmail().withMessage("Please provide a proper email"),
        createTextChain("password"),
        createTextChain("confPassword").custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error("Confirmation must match the password");
            }

            return true;
        }),

        function (req, res, next) {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).send({
                    errors: result.array()
                });
            }

            usersService.createUser(req.body);

            res.redirect('/');
        }
    ],

    userLogin: [
        createTextChain("email"),
        createTextChain("password"),

        function (req, res, next) {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).send({
                    errors: result.array()
                });
            }

            next();
        },

        authMiddleware.authenticateUser
    ],

    userLogout: [
        function (req, res, next) {
            req.logout((err) => {
                if (err) {
                    return next(err);
                }

                res.redirect('/users/login');
            });
        }
    ],

    updateUserStatus: [
        createTextChain("secret"),

        async function (req, res, next) {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).send({
                    errors: result.array()
                });
            }

            if (req.body.secret === 'secret') {
                await usersService.updateUserStatus(req.user.id);
            }

            res.redirect('/');
        },
    ]
}

module.exports = usersMiddleware;