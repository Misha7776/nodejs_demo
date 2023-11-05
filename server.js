require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOption');
const verityJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler');
const { logEvents, logger } = require('./middleware/logEvents');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;


// connect to database
connectDB();

app.use(logger)

// cross origin resource sharing
app.use(cors(corsOptions));

// build-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

// build-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verityJWT);
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
  res.status(404)
  console.log(req.accepts('json'))
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: 'Not found json' });
  } else {
    res.type('txt').send('Not found txt');
  }
});

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to database');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

