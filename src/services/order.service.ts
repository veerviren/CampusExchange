import { Response } from "express";
import { OrderRepository } from "../repositories/order.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const orderRepository = new OrderRepository();

export class OrderService {
    async createOrderService(userId: string, shippingData: any, res: Response) {
        try {
            // 1. Get Cart Items
            const cartItems = await prisma.cartItem.findMany({
                where: { userId },
                include: { product: true }
            });

            if (cartItems.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }

            // 2. Validate Stock (Check if any item is already sold or insufficient quantity)
            for (const item of cartItems) {
                if (item.product.isSold) {
                    return res.status(400).json({
                        message: `Product "${item.product.name}" is no longer available.`
                    });
                }

                // Check quantity
                const availableQty = (item.product as any).quantity ?? 1;
                if (item.quantity > availableQty) {
                    return res.status(400).json({
                        message: `Insufficient stock for "${item.product.name}". Available: ${availableQty}, Requested: ${item.quantity}`
                    });
                }
            }

            // 3. Calculate Total
            let subtotal = 0;
            cartItems.forEach(item => {
                subtotal += item.product.price * item.quantity;
            });

            const tax = subtotal * 0.08;
            const shipping = subtotal > 50 ? 0 : 5;
            const total = subtotal + tax + shipping;

            // 4. Create Order
            const order = await orderRepository.createOrder(userId, shippingData, cartItems, total);

            return res.status(201).json({
                message: "Order placed successfully",
                orderId: order.id,
                order
            });

        } catch (error) {
            console.error("Error creating order:", error);
            return res.status(500).json({ message: "Failed to place order" });
        }
    }

    async getUserOrdersService(userId: string, res: Response) {
        try {
            const orders = await orderRepository.getOrdersByUserId(userId);
            return res.status(200).json({ orders });
        } catch (error) {
            console.error("Error fetching user orders:", error);
            return res.status(500).json({ message: "Failed to fetch orders" });
        }
    }
}
