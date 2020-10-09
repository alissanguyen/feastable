const passport = require("passport"); //Library to log users in
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model("User");

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
      req.flash('error', "Sorry we couldn't find a Feastable account connected with that email. If you can't find your account, you can try register for a new one.")
      return res.redirect('back');
  }

  // 2. Set reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = Date.now() + 1200000; // 20 minutes from now
  await user.save();

  // 3. Send them an email with the token
  const resetURL = `http://${req.headers.host}.account/reset/${user.resetPasswordToken}`;
  req.flash('success', `Your password reset link has been emailed to you. ${resetURL}`);

  // 4. Redirect to login page
  res.redirect('/login');

};
