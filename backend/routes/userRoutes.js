const express = require('express');
const router = express.Router();
const { getUsers, getRiders, updateUserStatus } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, admin, getUsers);

router.route('/riders')
  .get(protect, admin, getRiders);

router.route('/:id/status')
  .put(protect, admin, updateUserStatus);

module.exports = router;
