const passport = require('passport'); //Library to log users in

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed to Sign In. Please try again.',
    successRedirect: '/',
    successFlash: 'Successfully signed in.'
});

