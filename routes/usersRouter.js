const express = require('express');
const router = express.Router();

const usersMiddleware = require("../middlewares/usersMiddleware");

router.get("/signup", (req, res) => res.render('sign_up_form'));
router.post("/signup", usersMiddleware.userSignUp);
router.get("/login", (req, res) => {
    const error = req.flash("error");
    res.render("login_form", {
        error
    });
});
router.post("/login", usersMiddleware.userLogin);
router.get('/logout', usersMiddleware.userLogout);
router.post("/updateStatus", usersMiddleware.updateUserStatus);

module.exports = router;