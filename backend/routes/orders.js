const express = require('express');

const OrderController = require('../controllers/orders');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, OrderController.createOrder);

router.put('/:id', checkAuth, OrderController.updateOrder);

router.get('', OrderController.getOrders);

router.get('/:id', OrderController.getOrder);

router.delete('/:id', checkAuth, OrderController.deleteOrder);

module.exports = router;
