const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus,
  assignRider,
  getRiderOrders
} = require('../controllers/orderController');
const { protect, admin, rider, adminOrRider } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/rider').get(protect, rider, getRiderOrders);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, adminOrRider, updateOrderToDelivered);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/assign').put(protect, admin, assignRider);

module.exports = router;
