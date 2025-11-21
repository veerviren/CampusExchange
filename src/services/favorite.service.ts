import { FavoriteRepository } from '../repositories/favorite.repository';
import { Response } from 'express';

const favoriteRepo = new FavoriteRepository();

export class FavoriteService {
    async addFavorite(userId: string, productId: string, res: Response) {
        try {
            const favorite = await favoriteRepo.addFavorite(userId, productId);
            return res.status(200).json({ favorite, message: 'Added to favorites' });
        } catch (err) {
            console.error('Error adding favorite:', err);
            return res.status(400).json({ message: 'Could not add to favorites' });
        }
    }

    async removeFavorite(userId: string, productId: string, res: Response) {
        try {
            await favoriteRepo.removeFavorite(userId, productId);
            return res.status(200).json({ message: 'Removed from favorites' });
        } catch (err) {
            console.error('Error removing favorite:', err);
            return res.status(400).json({ message: 'Could not remove from favorites' });
        }
    }

    async getFavorites(userId: string, res: Response) {
        try {
            const favorites = await favoriteRepo.getFavorites(userId);
            return res.status(200).json({ favorites });
        } catch (err) {
            console.error('Error fetching favorites:', err);
            return res.status(400).json({ message: 'Could not fetch favorites' });
        }
    }

    async checkFavorite(userId: string, productId: string, res: Response) {
        try {
            const isFavorite = await favoriteRepo.isFavorite(userId, productId);
            return res.status(200).json({ isFavorite });
        } catch (err) {
            console.error('Error checking favorite:', err);
            return res.status(400).json({ message: 'Could not check favorite status' });
        }
    }
}
