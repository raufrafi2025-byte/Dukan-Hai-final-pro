const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all riders
const getRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' });
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new rider
// @route   POST /api/users/riders
const registerRider = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({
      name,
      email,
      password,
      role: 'rider'
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block or Unblock User
const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.status = req.body.status || user.status;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getRiders, registerRider, updateUserStatus };
