import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// const API_BASE_URL = 'http://16.16.253.155:8000/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        SIGNUP: "/auth/register",
    },
    PRODUCTS: {
        GET_ALL: "/products",
        GET_ONE: "/products/:id",
    },
    PROFILE: {
        MYPROFILE: "/auth/profile",
        UPDATE_PROFILE: "/auth/profile",
    },
    SELLER: {
        MY_PRODUCTS: (sellerId) => `/products/seller/${sellerId}`,
        UPDATE_PRODUCT: (productId) => `/products/${productId}`,
        CREATE_PRODUCT: "/products",
        DELETE_PRODUCT: (productId) => `/products/${productId}`,
    },
    CATEGORIES: {
        GET_ALL: "/categories",
        GET_ONE: "/categories/:id",
        CREATE_CATEGORY: "/categories",
        UPDATE_CATEGORY: "/categories/:id",
        DELETE_CATEGORY: "/categories/:id",
    },
    USERS: {
        GET_ALL: "/users",
        GET_ONE: "/users/:id",
        CREATE_USER: "/users",
        UPDATE_USER: "/users/:id",
        DELETE_USER: "/users/:id",
    },
    ORDERS: {
        GET_ONE: "/orders/:userId",
        GET_ALL:"/orders",
    },
    CART: {
        GET_ALL: "/cart",
    }
    ,
    COUPONS: {
        GET_ALL: "/coupons",
        GET_ONE: (id) => `/coupons/${id}`,
        CREATE: "/coupons",
        UPDATE: (id) => `/coupons/${id}`,
        DELETE: (id) => `/coupons/${id}`,
        VALIDATE: "/coupons/validate",
    }
};

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ensure the Authorization header uses the latest token from localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API_ENDPOINTS; 