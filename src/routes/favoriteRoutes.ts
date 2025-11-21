import express from 'express';
const router = express.Router();

import { addFavorite, removeFavorite, getFavorites, checkFavorite } from '../controllers/favoriteController';
import { userAuth } from '../middleware/jwt.middleware';

router.use(userAuth);

// Get all favorites
router.get('/', getFavorites);

// Check if product is favorited
router.get('/check/:productId', checkFavorite);

// Add to favorites
router.post('/:productId', addFavorite);

// Remove from favorites
router.delete('/:productId', removeFavorite);

module.exports = router;
