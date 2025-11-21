import { Request, Response } from 'express';
import { FavoriteService } from '../services/favorite.service';

const favoriteService = new FavoriteService();

export const addFavorite = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    const { productId } = req.params;
    return favoriteService.addFavorite(userId, productId, res);
};

export const removeFavorite = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    const { productId } = req.params;
    return favoriteService.removeFavorite(userId, productId, res);
};

export const getFavorites = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    return favoriteService.getFavorites(userId, res);
};

export const checkFavorite = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    const { productId } = req.params;
    return favoriteService.checkFavorite(userId, productId, res);
};
