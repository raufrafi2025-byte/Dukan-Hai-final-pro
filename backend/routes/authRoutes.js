const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, registerRider } = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.post('/rider', protect, admin, registerRider);

module.exports = router;
