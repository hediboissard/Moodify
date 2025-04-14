const User = require('../models/User');

const user = await User.findUserByEmail(email);
await User.createUser(email, hashedpassword, username);