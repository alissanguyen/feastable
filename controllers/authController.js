const passport = require("passport"); //Library to log users in

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
