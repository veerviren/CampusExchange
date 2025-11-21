import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CartRepository {
    async addToCart(userId: string, productId: string, quantity: number = 1) {
        // If item already in cart, increase quantity
        const existing = await prisma.cartItem.findFirst({
            where: { userId, productId },
        });
        if (existing) {
            return prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + quantity },
            });
        }
        return prisma.cartItem.create({
            data: { userId, productId, quantity },
        });
    }

    async getCart(userId: string) {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });

        // Parse images string into array for each product
        return cartItems.map(item => ({
            ...item,
            product: item.product ? {
                ...item.product,
                images: item.product.images
                    ? item.product.images.split(',').map((img: string) => img.trim()).filter((img: string) => img)
                    : []
            } : null
        }));
    }

    async removeFromCart(cartItemId: string, userId: string) {
        return prisma.cartItem.delete({
            where: { id: cartItemId, userId },
        });
    }

    async updateCartQuantity(cartItemId: string, userId: string, quantity: number) {
        return prisma.cartItem.update({
            where: { id: cartItemId, userId },
            data: { quantity },
            include: { product: true },
        });
    }

    async clearCart(userId: string) {
        return prisma.cartItem.deleteMany({
            where: { userId },
        });
    }
}
