// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20");
// // Local Strategt which means not to use google, FB or other to login
// const LocalStrategy = require("passport-local");
// const bcrypt = require("bcrypt");

// // To find MongoDB database, does it exist the current login user
// const User = require("../models/user-model");

// // Cookie-session
// passport.serializeUser((user, done) => {
//   console.log("Serializing user now");
//   // _id is MongoDB id
//   return done(null, user._id);
// });

// passport.deserializeUser((_id, done) => {
//   console.log("Deserializing user now");
//   User.findById({ _id }).then((user) => {
//     console.log("Found user");
//     return done(null, user);
//   });
// });

// passport.use(
//   new LocalStrategy((username, password, done) => {
//     console.log(username, password);
//     User.findOne({ email: username })
//       .then(async (user) => {
//         if (!user) {
//           return done(null, false);
//         }
//         await bcrypt.compare(password, user.password, function (err, result) {
//           if (err) {
//             return done(null, false);
//           }
//           if (!result) {
//             return done(null, false);
//           } else {
//             return done(null, user);
//           }
//         });
//       })
//       .catch((err) => {
//         return done(null, false);
//       });
//   })
// );

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/redirect",
//       userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       //   passport callback
//       console.log(profile);
//       User.findOne({ googleID: profile.id }).then((foundUser) => {
//         if (foundUser) {
//           console.log("User already exist");
//           return done(null, foundUser);
//         } else {
//           new User({
//             name: profile.displayName,
//             googleID: profile.id,
//             thumbnail: profile.photos[0].value,
//             email: profile.emails[0].value,
//           })
//             .save()
//             .then((newUser) => {
//               console.log("Success create new user");
//               return done(null, newUser);
//             });
//         }
//       });
//     }
//   )
// );

// ---------------new---------------------------------------------

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  console.log("Serializing user now");
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  console.log("Deserializing user now");
  User.findById({ _id }).then((user) => {
    console.log("Found user.");
    done(null, user);
  });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(username, password);
    User.findOne({ email: username })
      .then(async (user) => {
        if (!user) {
          return done(null, false);
        }
        await bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            return done(null, false);
          }
          if (!result) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        });
      })
      .catch((err) => {
        return done(null, false);
      });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      User.findOne({ googleID: profile.id }).then((foundUser) => {
        if (foundUser) {
          console.log("User already exist");
          done(null, foundUser);
        } else {
          new User({
            name: profile.displayName,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
            email: profile.emails[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("New user created.");
              done(null, newUser);
            });
        }
      });
    }
  )
);
