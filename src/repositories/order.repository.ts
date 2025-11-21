import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class OrderRepository {
    async createOrder(userId: string, shippingData: any, cartItems: any[], total: number) {
        // Use a transaction to ensure data integrity
        return await prisma.$transaction(async (tx) => {
            // 1. Create the Order
            const order = await tx.order.create({
                data: {
                    userId,
                    total,
                    fullName: shippingData.fullName,
                    address: shippingData.address,
                    city: shippingData.city,
                    state: shippingData.state,
                    zipCode: shippingData.zipCode,
                    phone: shippingData.phone,
                    status: 'COMPLETED'
                }
            });

            // 2. Create OrderItems
            for (const item of cartItems) {
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price
                    }
                });

                // 3. Update Product Status (Decrement Quantity)
                const product = await tx.product.findUnique({ where: { id: item.productId } });

                if (product) {
                    // Use default of 1 if quantity is null/undefined (legacy data)
                    const currentQuantity = product.quantity ?? 1;
                    const newQuantity = Math.max(0, currentQuantity - item.quantity);
                    const isSoldOut = newQuantity <= 0;

                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            quantity: newQuantity,
                            isSold: isSoldOut,
                            buyerId: isSoldOut ? userId : undefined // Only mark buyer if sold out, or potentially don't use buyerId for multi-stock items
                        }
                    });
                }
            }

            // 4. Clear User's Cart
            await tx.cartItem.deleteMany({
                where: { userId }
            });

            return order;
        });
    }

    async getOrdersByUserId(userId: string) {
        return await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getOrderById(orderId: string) {
        return await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
    }
}
