import express from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController';
import { userAuth } from '../middleware/jwt.middleware';

const router = express.Router();

router.post('/', userAuth, createOrder);
router.get('/', userAuth, getUserOrders);

export default router;
