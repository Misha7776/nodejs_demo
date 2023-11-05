const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if ( !cookies?.jwt ) return res.sendStatus(401)

  const refreshToken = cookies.jwt;

  // search for the refresh token in the database
  const foundUser = await User.findOne({ refreshToken }).exec();

  // if the refresh token is not in the database, send a 403 Forbidden response
  if (!foundUser) return res.sendStatus(403);

  // verify the refresh token and create a new access token
  jwt.verify(refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      // if the refresh token is invalid, send a 403 Forbidden response
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

      const roles = Object.values(foundUser.roles);

      // create a new access token
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": decoded.username,
            "roles": roles
          } 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ accessToken });
    }
  );
}

module.exports = { handleRefreshToken };