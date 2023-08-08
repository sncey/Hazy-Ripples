const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../db/models/user');
const sendEmail = require('./email');
const welcomeTemplate = require('../emailTemplates/welcome');
require("dotenv").config();

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

const generateJWT = (user) => { 
  return jwt.sign(
      {
          id: user.id,
          username: user.username,
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + 1209600,
          iat: Math.floor(Date.now() / 1000), // Issued at date
      },
      process.env.JWT_SECRET
  );
}

const dataRequest = async (accessToken,personFields) => {
  const  url = `https://people.googleapis.com/v1/people/me?personFields=${personFields}&key=${process.env.GOOGLE_PEOPLE_API_KEY}&access_token=${accessToken}`
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return await response.json();
  } catch (error) {
    console.log('Error fetching data:', error);
  }
  
}

const getbirthDay = async (accessToken) => {
  const data = await dataRequest(accessToken,"birthdays");
  const dateObject = data.birthdays[0]?.date;
  const formattedDate = `${dateObject.year}-${dateObject.month.toString().padStart(2, '0')}-${dateObject.day.toString().padStart(2, '0')}`;
  return formattedDate;
}

const getPhoneNumber = async (accessToken) => {
  const data = await dataRequest(accessToken,"phoneNumbers");
  const phoneNumberValue = data.phoneNumbers?.canonicalForm;
  return phoneNumberValue;
}

const getGender = async (accessToken) => {
  const data = await dataRequest(accessToken,"genders")
  const genderObject = data.genders[0]?.value;
  return genderObject;
}

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
          const token = await generateJWT(existingUser);
          return done(null, { user: existingUser, token });
        }
        const birthday = await getbirthDay(accessToken);
        const phoneNumber = await getPhoneNumber(accessToken);
        const gender = await getGender(accessToken);

        // User doesn't exist, create a new user and save to the database
        const newUser = new UserModel({
          username: profile.displayName, // You may adjust this based on your data model
          email: profile.emails[0].value, // Make sure to check if profile.emails is not empty before accessing index 0
          googleId: profile.id,
          avatar: profile.photos[0]?.value || null, // Make sure to check if profile.photos is not empty before accessing index 0
          firstname: profile._json.given_name,
          lastname: profile._json.family_name,
          phoneNumber: phoneNumber || "00000000000",
          gender: gender || null,
          birthday: birthday || null,
        });
        await newUser.save();

        const token = generateJWT(newUser);
        const emailText = welcomeTemplate(newUser.username);
        sendEmail(newUser.email, 'Welcome onboard', emailText);
        return done(null, { user: newUser, token });
      } catch (error) {
        console.error('Error with Google OAuth:', error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;