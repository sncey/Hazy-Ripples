const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../db/models/user');
const sendEmail = require('./email');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GAPP_CLIENT_ID,
//       clientSecret: process.env.GAPP_CLIENT_SECRET,
//       callbackURL: '/api/auth/google/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });

//         if (existingUser) {
//           const token = jwt.sign(
//             {
//               name: existingUser.name,
//               email: existingUser.email,
//               exp: Math.floor(Date.now() / 1000) + 1209600, // 14 days expiration
//               iat: Math.floor(Date.now() / 1000), // Issued at date
//             },
//             process.env.JWT_SECRET
//           );

//           return done(null, { user: existingUser, token });
//         }

//         //TODO this function should be reviewd based on our user model

//         const newUser = await new User({
//           firstName: profile.displayName,
//           email: profile.emails[0].value,
//           googleId: profile.id,
//           avatar: profile.photos[0].value,
//         }).save();

//         await sendEmail(
//           newUser.email,
//           'Welcome to Hazy-Ripples voluntary events',
//           `Hello ${newUser.name}, your account has been created successfully.`
//         );

//         const token = jwt.sign(
//           {
//             name: newUser.name,
//             email: newUser.email,
//             exp: Math.floor(Date.now() / 1000) + 1209600, // 14 days expiration
//             iat: Math.floor(Date.now() / 1000), // Issued at date
//           },
//           process.env.JWT_SECRET
//         );

//         return done(null, { user: newUser, token });
//       } catch (error) {
//         console.error('Error with Google OAuth:', error);
//         return done(error, null);
//       }
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GAPP_CLIENT_ID,
      clientSecret: process.env.GAPP_CLIENT_SECRET,
      callbackURL: '/user/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists based on their Google ID
        const existingUser = await UserModel.findOne({ googleId: profile.id });

        if (existingUser) {
          // User already exists, generate token and return
          const token = jwt.sign(
            {
              googleId: existingUser.id,
              username: existingUser.username,
              email: existingUser.email,
              exp: Math.floor(Date.now() / 1000) + 1209600, // 14 days expiration
              iat: Math.floor(Date.now() / 1000), // Issued at date
            },
            process.env.JWT_SECRET
          );

          return done(null, { user: existingUser, token });
        }

        // User doesn't exist, create a new user and save to the database
        const newUser = new UserModel({
          username: profile.displayName, // You may adjust this based on your data model
          email: profile.emails[0].value, // Make sure to check if profile.emails is not empty before accessing index 0
          googleId: profile.id,
          avatar: profile.photos[0]?.value || null, // Make sure to check if profile.photos is not empty before accessing index 0
          // You can set other fields based on your data model here
          firstname: "null",
          lastname: "null",
          password_hash: "nuL1nuL1.",
          phoneNumber: 20,
          age: 20,
          gender: "not-specified",
        });

        await newUser.save();

        const token = jwt.sign(
          {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            exp: Math.floor(Date.now() / 1000) + 1209600, // 14 days expiration
            iat: Math.floor(Date.now() / 1000), // Issued at date
          },
          process.env.JWT_SECRET
        );

        return done(null, { user: newUser, token });
      } catch (error) {
        console.error('Error with Google OAuth:', error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
