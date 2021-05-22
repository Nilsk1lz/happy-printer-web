var passport = require("passport");
var BasicStrategy = require("passport-http").BasicStrategy;
var BearerStrategy = require("passport-http-bearer").Strategy;
var LocalAPIKeyStrategy = require("passport-localapikey").Strategy;

const User = require("../models/user.model");

module.exports = function (passport) {
  passport.use(
    new BasicStrategy(function (username, password, done) {
      console.log("Using basic strategy");
      User.findOne({ "local.email": username })
        .populate("devices")
        .exec(function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          if (!user.authenticate(password, user.local.hash, user.local.salt)) {
            return done(null, false);
          }
          user.generateToken();
          user.save();
          return done(null, user);
        });
    })
  );

  passport.use(
    new BearerStrategy(function (token, done) {
      console.log("Using bearer strategy");
      console.log(token);
      User.findOne({ "local.token": token })
        .populate("devices")
        .exec(function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        });
    })
  );

  passport.use(
    new LocalAPIKeyStrategy(function (apikey, done) {
      console.log("Using local strategy");
      User.findOne({ "local.api_key": apikey }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );
};
