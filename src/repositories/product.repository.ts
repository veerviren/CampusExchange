import { PrismaClient } from "@prisma/client";
import { Product } from "../controllers/interfaces/product.interface";
const prisma = new PrismaClient()

interface Payload {
    data: Product
}

export class ProductMethods {

    findAllProduct = async (userId: any, status?: string, category?: string, isSold?: string, isFeatured?: string) => {
        console.log('findAllProduct params:', { userId, status, category, isSold, isFeatured });
        let whereClause: any = {
            // Always exclude deleted products
            isDeleted: false
        };

        if (status === 'Listings') {
            // Only products where current user is seller and no buyer
            whereClause.sellerId = userId;
            whereClause.buyerId = null;
        } else if (status === 'Sales') {
            whereClause.sellerId = userId;
            whereClause.buyerId = { not: null };
        }
        // If no status is specified, return all products (for explore page)

        if (category) {
            whereClause.category = category;
        }
        if (typeof isSold !== 'undefined') {
            if (isSold === 'true') whereClause.isSold = true;
            else if (isSold === 'false') whereClause.isSold = false;
        }
        if (typeof isFeatured !== 'undefined') {
            if (isFeatured === 'true') whereClause.isFeatured = true;
            else if (isFeatured === 'false') whereClause.isFeatured = false;
        }
        console.log('findAllProduct whereClause:', whereClause);
        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc' // Show newest products first
            }
        });

        return products.map((p: any) => ({
            ...p,
            images: p.images ? p.images.split(',') : [],
            tags: p.tags ? p.tags.split(',') : []
        }));
    }

    findOneProduct = async (productId: string) => {
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
                isDeleted: false
            },
        });

        if (!product) return null;

        return {
            ...product,
            images: product.images ? (product.images as string).split(',') : [],
            tags: product.tags ? (product.tags as string).split(',') : []
        };
    }

    createOneProduct = async (payload: Payload) => {
        const data: any = { ...payload.data };
        if (data.images && Array.isArray(data.images)) {
            data.images = data.images.join(',');
        }
        if (data.tags && Array.isArray(data.tags)) {
            data.tags = data.tags.join(',');
        }

        const createdProduct = await prisma.product.create({ data });

        return {
            ...createdProduct,
            images: createdProduct.images ? (createdProduct.images as string).split(',') : [],
            tags: createdProduct.tags ? (createdProduct.tags as string).split(',') : []
        };
    }

    deleteOneProduct = async (productId: string, sellerId: string) => {

        const deletedProduct = await prisma.product.update({
            where: { id: productId, sellerId: sellerId },
            data: {
                deletedAt: new Date(),
                isDeleted: true,
            },
        });

        return {
            ...deletedProduct,
            images: deletedProduct.images ? (deletedProduct.images as string).split(',') : [],
            tags: deletedProduct.tags ? (deletedProduct.tags as string).split(',') : []
        };
    };



    updateOneProduct = async (productId: string, sellerId: string, payload: any | null) => {
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
                sellerId: sellerId,
            },
        });

        if (!product) {
            console.log("Product not found or doesn't belong to the user");
            return;
        }

        const dataToUpdate = { ...payload.data };
        if (dataToUpdate.images && Array.isArray(dataToUpdate.images)) {
            dataToUpdate.images = dataToUpdate.images.join(',');
        }
        if (dataToUpdate.tags && Array.isArray(dataToUpdate.tags)) {
            dataToUpdate.tags = dataToUpdate.tags.join(',');
        }

        const updateData = {
            name: dataToUpdate.name || product.name,
            description: dataToUpdate.description || product.description,
            price: dataToUpdate.price || product.price,
            quantity: dataToUpdate.quantity !== undefined ? dataToUpdate.quantity : product.quantity,
            category: dataToUpdate.category || product.category,
            images: dataToUpdate.images || product.images,
            isFeatured: dataToUpdate.isFeatured !== undefined ? dataToUpdate.isFeatured : product.isFeatured,
            discount: dataToUpdate.discount !== undefined ? dataToUpdate.discount : product.discount,
            tags: dataToUpdate.tags || product.tags,
            updatedAt: new Date(),
        };

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: updateData,
        });

        return {
            ...updatedProduct,
            images: updatedProduct.images ? (updatedProduct.images as string).split(',') : [],
            tags: updatedProduct.tags ? (updatedProduct.tags as string).split(',') : []
        };
    };
}
