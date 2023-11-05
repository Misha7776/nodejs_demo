const User = require('../models/User');

const ROLES_LIST = require('../config/roles_list');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if ( !username || !password ) return res.status(400).send({ 'message': 'Missing username or password' });

  // check for duplicate username
  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409);

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // create and save the new user

    const result = await User.create({
      "username": username,
      "password": hashedPwd,
    });
    console.log(result);

    res.status(201).json({ 'success': `New user ${result.username} created` });
  } catch (err) {
    res.status(500).send({ 'message': err.message });
  }
}

module.exports = { handleNewUser };