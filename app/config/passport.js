var LocalStratery = require('passport-local').Stratery;
var users = require('../models').users

module.exports = (passport) => {
    passport.serializeUser(function (user, done) {
        done(null, user);
    })

    passport.deserializeUser(function (id, done) {
        users.findById(id, function (err, user) {
            done(err, user);
        });
    });


}