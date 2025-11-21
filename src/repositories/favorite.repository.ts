import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class FavoriteRepository {
    async addFavorite(userId: string, productId: string) {
        // Check if already exists to avoid unique constraint error
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });

        if (existing) return existing;

        return prisma.favorite.create({
            data: {
                userId,
                productId
            },
            include: {
                product: true
            }
        });
    }

    async removeFavorite(userId: string, productId: string) {
        try {
            return await prisma.favorite.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                }
            });
        } catch (error) {
            // Ignore if not found
            return null;
        }
    }

    async getFavorites(userId: string) {
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        });

        // Format products similar to cart repository (parsing images)
        return favorites.map(fav => ({
            ...fav,
            product: fav.product ? {
                ...fav.product,
                images: fav.product.images
                    ? fav.product.images.split(',').map((img: string) => img.trim()).filter((img: string) => img)
                    : []
            } : null
        }));
    }

    async isFavorite(userId: string, productId: string) {
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });
        return !!favorite;
    }
}
