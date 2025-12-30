import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';
import {
    fetchProducts,
    fetchProductById,
    fetchSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../services/productService';
import { api } from '../config/api';
    
jest.mock('../config/api', () => ({
    __esModule: true,
    default: {
        PRODUCTS: {
            GET_ALL: '/products',
            GET_ONE: '/products/:id',
        },
        SELLER: {
            MY_PRODUCTS: (sellerId) => `/products/seller/${sellerId}`,
            UPDATE_PRODUCT: (productId) => `/products/${productId}`,
            CREATE_PRODUCT: '/products',
            DELETE_PRODUCT: (productId) => `/products/${productId}`,
        }
    },
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }
}));

describe('Product Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('fetchProducts', () => {
        it('should fetch all products successfully', async () => {
            const mockProducts = [
                { _id: '1', title: 'Product 1', description: 'Description 1', price: 100, stock: 100 },
                { _id: '2', title: 'Product 2', description: 'Description 2', price: 200, stock: 200 },
            ];
            api.get.mockResolvedValue({
                data: { products: mockProducts },
            });

            const result = await fetchProducts();

            expect(api.get).toHaveBeenCalledWith('/products');
            expect(result).toEqual(mockProducts);
        });

        it('should return empty array when response has no products', async () => {
            api.get.mockResolvedValue({
                data: {},
            });

            const result = await fetchProducts();

            expect(result).toEqual([]);
        });

        it('should handle errors gracefully', async () => {
            const mockError = new Error('Network error');
            api.get.mockRejectedValue(mockError);

            await expect(fetchProducts()).rejects.toThrow('Network error');
            expect(console.error).toHaveBeenCalledWith('Error fetching products:', mockError);
        });
    });

    describe('fetchProductById', () => {
        it('should fetch a product by ID successfully', async () => {
            const productId = '123';
            const mockProduct = { _id: productId, title: 'Product 1', description: 'Description 1', price: 100, stock: 100 };
            api.get.mockResolvedValue({
                data: { product: mockProduct },
            });

            const result = await fetchProductById(productId);

            expect(api.get).toHaveBeenCalledWith('/products/123');
            expect(result).toEqual(mockProduct);
        });

        it('should return null when product is not found', async () => {
            const productId = '123';
            api.get.mockResolvedValue({
                data: {},
            });
            const result = await fetchProductById(productId);
            expect(result).toBeNull();
        });

        it('should handle errors gracefully', async () => {
            const productId = '123';
            const mockError = new Error('Product not found');
            api.get.mockRejectedValue(mockError);
            await expect(fetchProductById(productId)).rejects.toThrow('Product not found');
            expect(console.error).toHaveBeenCalledWith('Error fetching product by ID:', mockError);
        });
    });

    describe('fetchSellerProducts', () => {
        it('should fetch seller products successfully', async () => {
            const sellerId = '123';
            const mockProducts = [
                { _id: '1', title: 'Product 1', description: 'Description 1', price: 100, stock: 100 },
                { _id: '2', title: 'Product 2', description: 'Description 2', price: 200, stock: 200 },
            ];
            api.get.mockResolvedValue({
                data: { products: mockProducts },
            });
            const result = await fetchSellerProducts(sellerId);
            expect(api.get).toHaveBeenCalledWith('/products/seller/123');
            expect(result).toEqual(mockProducts);
        });

        it('should return empty array when response has no products', async () => {
            const sellerId = '123';
            api.get.mockResolvedValue({
                data: {},
            });
            const result = await fetchSellerProducts(sellerId);
            expect(result).toEqual([]);
        });

        it('should handle errors gracefully', async () => {
            const sellerId = '123';
            const mockError = new Error('Failed to fetch seller products');
            api.get.mockRejectedValue(mockError);
            await expect(fetchSellerProducts(sellerId)).rejects.toThrow('Failed to fetch seller products');
            expect(console.error).toHaveBeenCalledWith('Error fetching seller products:', mockError);
        });
    });

    describe('createProduct', () => {
        it('should create a product successfully', async () => {
            const productData = { title: 'Product 1', description: 'Description 1', price: 100, stock: 100 };
            const mockCreatedProduct = { _id: '1', ...productData };
            api.post.mockResolvedValue({
                data: { product: mockCreatedProduct },
            });
            const result = await createProduct(productData);
            expect(api.post).toHaveBeenCalledWith('/products', productData, { headers: { 'Content-Type': 'multipart/form-data' } });
            expect(result).toEqual(mockCreatedProduct);
        });

        it('should return null when response has no product', async () => {
            const productData = { title: 'Product 1', description: 'Description 1', price: 100, stock: 100 };
            api.post.mockResolvedValue({
                data: {},
            });
            const result = await createProduct(productData);
            expect(result).toBeNull();
        });
        it('should handle errors gracefully', async () => {
            const productData = { title: 'Product 1', description: 'Description 1', price: 100, stock: 100 };
            const mockError = new Error('Failed to create product');
            api.post.mockRejectedValue(mockError);
            await expect(createProduct(productData)).rejects.toThrow('Failed to create product');
            expect(console.error).toHaveBeenCalledWith('Error creating product:', mockError);
        });
    });
    describe('updateProduct', () => {
        it('should update a product successfully', async () => {
            const productId = '123';
            const productData = { title: 'Product 1', description: 'Description 1', price: 100, stock: 100 };
            const mockUpdatedProduct = { _id: productId, ...productData };
            api.put.mockResolvedValue({
                data: { product: mockUpdatedProduct },
            });
            const result = await updateProduct(productId, productData);
            expect(api.put).toHaveBeenCalledWith('/products/123', productData, { headers: { 'Content-Type': 'multipart/form-data' } });
            expect(result).toEqual(mockUpdatedProduct);
        });
        it('should return null when response has no product', async () => {
            const productId = '123';
            const productData = { title: 'Product 1', description: 'Description 1', price: 100, stock: 100 };
            api.put.mockResolvedValue({
                data: {},
            });
            const result = await updateProduct(productId, productData);
            expect(result).toBeNull();
        });
        it('should handle errors gracefully', async () => {
            const productId = '123';
            const productData = { title: 'Product 1', description: 'Description 1', price: 100, stock: 100 };
            const mockError = new Error('Failed to update product');
            api.put.mockRejectedValue(mockError);
            await expect(updateProduct(productId, productData)).rejects.toThrow('Failed to update product');
            expect(console.error).toHaveBeenCalledWith('Error updating product:', mockError);
        });
    });
    describe('deleteProduct', () => {
        it('should delete a product successfully', async () => {
            const productId = '123';
            const mockDeletedProduct = { _id: productId, title: 'Product 1', description: 'Description 1', price: 100, stock: 100 };
            api.delete.mockResolvedValue({
                data: { product: mockDeletedProduct },
            });
            const result = await deleteProduct(productId);
            expect(api.delete).toHaveBeenCalledWith('/products/123');
            expect(result).toEqual(mockDeletedProduct);
        });
        it('should return null when response has no product', async () => {
            const productId = '123';
            api.delete.mockResolvedValue({
                data: {},
            });
            const result = await deleteProduct(productId);
            expect(result).toBeNull();
        });
        it('should handle errors gracefully', async () => {
            const productId = '123';
            const mockError = new Error('Failed to delete product');
            api.delete.mockRejectedValue(mockError);
            await expect(deleteProduct(productId)).rejects.toThrow('Failed to delete product');
            expect(console.error).toHaveBeenCalledWith('Error deleting product:', mockError);
        });
    });
});
