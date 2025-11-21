import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

const orderService = new OrderService();

export const createOrder = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    const shippingData = req.body;

    // Basic validation
    if (!shippingData.fullName || !shippingData.address || !shippingData.city || !shippingData.state || !shippingData.zipCode || !shippingData.phone) {
        return res.status(400).json({ message: "Missing shipping information" });
    }

    return await orderService.createOrderService(userId, shippingData, res);
};

export const getUserOrders = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    return await orderService.getUserOrdersService(userId, res);
};
