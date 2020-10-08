const mongoose = require("mongoose");

exports.loginForm = (req, res) => {
  res.render("login", { title: "Login" });
};

exports.registerForm = (req, res) => {
  res.render("register", { title: "Account Register" });
};

exports.validateRegister = (req, res, next) {
    req.sanitizeBody('name');
    req.checkBody('name', 'Please enter your name').notEmpty();
    req.checkBody('email', 'Invalid Email Address, please try again.').isEmail();
    req.sanitizeBody('email').normalizeEmail({ 
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    })
    req.checkBody('password',)
}