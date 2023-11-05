const User = require('../models/User');

const handleLogOut = async (req, res) => {
  // on client side, delete the access token and refresh token

  const cookies = req.cookies;
  if ( !cookies?.jwt ) return res.sendStatus(204) // no content

  const refreshToken = cookies.jwt;

  //  is refreshToken in the database?
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true });
    return res.sendStatus(204);
  }

  // remove the refresh token from the database
  foundUser.refreshToken = null;
  await foundUser.save();

  res.clearCookie('jwt', { httpOnly: true });
  res.sendStatus(204);
}

module.exports = { handleLogOut };