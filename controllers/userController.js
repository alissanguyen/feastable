const mongoose = require("mongoose");

exports.loginForm = (req, res) => {
  res.render("login", { title: "Login" });
};

exports.registerForm = (req, res) => {
  res.render("register", { title: "Account Register" });
};

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'Please enter your name').notEmpty();
    req.checkBody('email', 'Invalid Email Address, please try again.').isEmail();
    req.sanitizeBody('email').normalizeEmail({ 
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    })
    req.checkBody('password', 'Password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Confirmed password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Passwords do not match, please try again.').equals(req.body.password);

    const errors = req.validationErrors();
    if (error) {
        req.flash('error', errors.map(err => err.msg));
        res.render('register', {title: 'Register', body: req.body, flashes: req.flash() });
    }
}