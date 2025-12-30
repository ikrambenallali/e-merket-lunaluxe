import API_ENDPOINTS, { api } from "../config/api";

export const fetchProducts = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
        return response?.data?.data || response?.data?.products || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const fetchProductById = async (productId) => {
    try {
        const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ONE.replace(':id', productId));
        return response?.data?.data || response?.data?.product || null;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
};

export const fetchSellerProducts = async (sellerId) => {
    try {
        const response = await api.get(API_ENDPOINTS.SELLER.MY_PRODUCTS(sellerId));
        return response?.data?.products || [];
    } catch (error) {
        console.error("Error fetching seller products:", error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await api.post(
            API_ENDPOINTS.SELLER.CREATE_PRODUCT,
            productData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response?.data?.data || response?.data?.product || null;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const response = await api.put(
            API_ENDPOINTS.SELLER.UPDATE_PRODUCT(productId),
            productData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response?.data?.data || response?.data?.product || null;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(API_ENDPOINTS.SELLER.DELETE_PRODUCT(productId));
        return response?.data?.data || response?.data?.product || null;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

