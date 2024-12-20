const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require("bcryptjs");

const usersService = require("../services/usersService");

passport.use(new LocalStrategy({
    usernameField: "email"
}, async function (email, password, done) {
    try {
        const user = await usersService.getUserByEmail(email);

        if (!user) {
            return done(null, false, {
                message: "Incorrect email!"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return done(null, false, {
                message: "Incorrect password!"
            });
        }

        return done(null, user);
    } catch (err) {
        console.error(err);

        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersService.getUserById(id);

        done(null, user);
    } catch (err) {
        done(err);
    }
});

const authMiddleware = {
    authenticateUser: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                req.flash('error', info.message || 'Invalid credentials');
                return res.redirect('/users/login');
            }

            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    },

    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }

        res.status(401).send('Unauthorized: Please log in first.');
    },

    checkForGivenRole: (role) => {
        return (req, res, next) => {
            if (!req.user) {
                console.error('User not authenticated.');
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }

            if (req.user.status !== role) {
                console.error(`User does not have the required role: ${role}`);
                return res.status(403).json({
                    message: 'Forbidden'
                });
            }

            return next();
        };
    }
};

module.exports = authMiddleware;