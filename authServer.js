
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = 57896; // Use the provided port

app.use(cors());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, cb) => {
    // In a real application, you would save the user profile to your database
    // and return the user. For this example, we'll just return the profile.
    return cb(null, profile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, generate a JWT
    const user = req.user;
    const token = jwt.sign({ id: user.id, displayName: user.displayName, emails: user.emails }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Redirect to a frontend URL with the token
    res.redirect(`http://localhost:51260/?token=${token}`);
  });

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
