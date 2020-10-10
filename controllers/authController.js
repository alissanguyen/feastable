const passport = require("passport"); //Library to log users in
const crypto = require("crypto"); //Generate random URL for resetting password
const mongoose = require("mongoose");
const promisify = require("es6-promisify");
const User = mongoose.model("User");
const mail = require('../handlers/mail')

exports.login = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Failed to Sign In. Please try again.",
  successRedirect: "/",
  successFlash: "Successfully signed in.",
});

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Account successfully signed out.");
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash("error", "Please sign in to do that");
  res.redirect("/login");
};

exports.resetPassword = async (req, res) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash(
      "error",
      "Sorry we couldn't find a Feastable account connected with that email. If you can't find your account, you can try register for a new one."
    );
    return res.redirect("back");
  }

  // 2. Set reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = Date.now() + 1200000; // 20 minutes from now
  await user.save();

  // 3. Send them an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    subject: 'Password Reset Link',
    resetURL,
    filename: 'password-reset',
  })
  req.flash(
    "success",
    `Your password reset link has been emailed to you. ${resetURL}`
  );

  // 4. Redirect to login page
  res.redirect("/login");
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash("error", "Reset URL is invalid or has expired.");
    return res.redirect("/login");
  }
  // If there is a user, show the reset password form
  res.render("reset", { title: "Reset Password" });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    next(); //Proceed to update
    return;
  }
  req.flash("error", "Passwords do not match! Please try again.");
  res.redirect("back");
};

exports.passwordUpdate = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash("error", "Reset URL is invalid or has expired.");
    return res.redirect("/login");
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser); //automatically logged in after updated password
  req.flash("success", "Password successfully updated! You are now signed in.");
  res.redirect("/");
};
