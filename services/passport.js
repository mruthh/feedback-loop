const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, null);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          console.log('user exists')
          // we already have a record with the given profile ID
          done(null, existingUser);
        } else {
          // we don't have a user record with this ID, make a new record!
          new User({ googleId: profile.id })
            console.log(`creating new user`)
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);

// passport.use(
  //   new GoogleStrategy(
  //     {
  //       clientID: keys.googleClientID,
  //       clientSecret: keys.googleClientSecret,
  //       callbackURL: '/auth/google/callback'
  //     },
  //       (accessToken, refreshToken, profile, done) => {
          
  //         let currentUser = new User({googleId: profile.id});
  //         User.findOne({googleId: currentUser.googleId}, (err, user) => {
  //           if (err) throw err;
  //           if (user) {
  //             console.log(user)
  //             done(null, user)
  //           } else {
  //             currentUser.save((err, currentUser) => {
  //               if (err) throw err;
  //               console.log(`saved ${currentUser.id}`)
  //             })
  //             done(null, currentUser);
  //           }
  //         })
  //     }
  //   )
  // );