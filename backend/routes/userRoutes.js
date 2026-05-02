const express = require('express');
const router = express.Router();
const { getUsers, getRiders, registerRider, updateUserStatus } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, admin, getUsers);

router.route('/riders')
  .get(protect, admin, getRiders)
  .post(protect, admin, registerRider);

router.route('/:id/status')
  .put(protect, admin, updateUserStatus);

module.exports = router;
