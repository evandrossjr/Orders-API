const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');


router.post('/', orderController.createOrder);
router.get('/list', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:orderId', orderController.updateOrder);
//router.delete('/:id', orderController.deleteOrder);

module.exports = router;