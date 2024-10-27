const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../../models');
const { generateAccessToken } = require('../../middleware/isAuthenicatedMiddleware');




const createAdmin = async (req, res) => {
  const { adminId, email, password, userName } = req.body;
  console.log(adminId, email, password, userName);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingEmail = await db.Admin.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingUserName = await db.Admin.findOne({ where: { userName } });
    if (existingUserName) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    const newAdmin = await db.Admin.create({
      adminId,
      email,
      password,
      username: userName
    });

    const accessToken = generateAccessToken(newAdmin.email, process.env.JWTADMIN_TOKEN, '10m');
    const refreshToken = generateAccessToken(newAdmin.email, process.env.REFRESH_REFRESHADMIN_TOKEN_SECRET, '24h');

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({ accessToken });
  } catch (err) {
    console.error('createAdmin error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await db.Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const accessToken = generateAccessToken(admin.email, process.env.JWTADMIN_TOKEN, '2h');
    const refreshToken = generateAccessToken(admin.email, process.env.REFRESHADMIN_TOKEN_SECRET, '24h');

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error('loginAdmin error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};




const totalTablesCount = async (req, res) => {

}

module.exports = {
  createAdmin,
  loginAdmin,
  totalTablesCount
};
