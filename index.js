const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('./models/User');
require('./services/passport');
const keys = require('./config/keys');
mongoose.connect(keys.mongoURI);
const cookieSession = require('cookie-session')


const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);