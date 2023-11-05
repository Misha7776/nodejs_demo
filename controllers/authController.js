const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => { 
  const { username, password } = req.body;

  // check for missing username or password
  if ( !username || !password ) return res.status(400).send({ 'message': 'Missing username or password' });

  // check if the user exists
  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser) return res.sendStatus(401);

  // compare the password with the hashed password
  const match = await bcrypt.compare(password, foundUser.password);

  // if the password matches, create JWTs and send it back to the client
  if (match) {
    const roles = Object.values(foundUser.roles);
    console.log(roles);

    // create JWTs and send it back to the client
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles
        }
      }, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' });

    // create a refresh token
    const refreshToken = jwt.sign({ "username": foundUser.username }, process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1h' });

    // store the refresh token in the database

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 3600000 })
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { handleLogin };