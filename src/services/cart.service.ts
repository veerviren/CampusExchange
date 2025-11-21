import { CartRepository } from '../repositories/cart.repository';
import { Response } from 'express';

const cartRepo = new CartRepository();

export class CartService {
    async addToCart(userId: string, productId: string, quantity: number, res: Response) {
        try {
            const item = await cartRepo.addToCart(userId, productId, quantity);
            return res.status(200).json({ cartItem: item });
        } catch (err) {
            return res.status(400).json({ message: 'Could not add to cart' });
        }
    }

    async getCart(userId: string, res: Response) {
        try {
            const items = await cartRepo.getCart(userId);
            return res.status(200).json({ cart: items });
        } catch (err) {
            return res.status(400).json({ message: 'Could not fetch cart' });
        }
    }

    async removeFromCart(userId: string, cartItemId: string, res: Response) {
        try {
            await cartRepo.removeFromCart(cartItemId, userId);
            return res.status(200).json({ message: 'Removed from cart' });
        } catch (err) {
            return res.status(400).json({ message: 'Could not remove from cart' });
        }
    }

    async updateCartQuantity(userId: string, cartItemId: string, quantity: number, res: Response) {
        try {
            if (quantity < 1) {
                return res.status(400).json({ message: 'Quantity must be at least 1' });
            }
            const item = await cartRepo.updateCartQuantity(cartItemId, userId, quantity);
            return res.status(200).json({ cartItem: item, message: 'Quantity updated' });
        } catch (err) {
            return res.status(400).json({ message: 'Could not update quantity' });
        }
    }

    async clearCart(userId: string, res: Response) {
        try {
            await cartRepo.clearCart(userId);
            return res.status(200).json({ message: 'Cart cleared' });
        } catch (err) {
            return res.status(400).json({ message: 'Could not clear cart' });
        }
    }
}
