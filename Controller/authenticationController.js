const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new admin
exports.registerAdmin = async (req, res) => {
  try {
    const { fullname,email, password } = req.query;

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        status: 'failure',
        code: 400,
        error: 'Admin already exists',
        data: null,
      });
    }

    // Hash the admin's password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const admin = new Admin({ fullname,email, password: hashedPassword });
    const savedAdmin = await admin.save();

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Admin registered successfully',
      data: [savedAdmin],
    });
  } catch (error) {
    res.status(500).json({
      status: 'failure',
      code: 500,
      error: error.message,
      data: null,
    });
  }
};

// Login admin and get a token
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.query;

    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        status: 'failure',
        code: 404,
        error: 'Authentication failed. Admin not found.',
        data: null,
      });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(400).json({
        status: 'failure',
        code: 400,
        error: 'Authentication failed. Incorrect password.',
        data: null,
      });
    }

    // Create and send a JWT token for authentication
    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
      },
      'your-secret-key', // Replace with your secret key
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Admin logged in successfully',
      data:[ {
        adminId: admin._id,
        email: admin.email,
        token: token,
      }],
    });
  } catch (error) {
    res.status(500).json({
      status: 'failure',
      code: 500,
      error: error.message,
      data: null,
    });
  }
};