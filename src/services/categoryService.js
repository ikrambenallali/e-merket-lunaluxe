import axios from "axios";
import API_ENDPOINTS, { api } from "../config/api";

export const fetchCategories = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.CATEGORIES.GET_ALL);
        return response?.data?.categories || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

export const fetchCategoryById = async (categoryId) => {
    try {
        const response = await api.get(API_ENDPOINTS.CATEGORIES.GET_ONE.replace(':id', categoryId));
        return response?.data?.category || null;
    } catch (error) {
        console.error("Error fetching category by ID:", error);
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await api.post(API_ENDPOINTS.CATEGORIES.CREATE_CATEGORY, categoryData);
        return response?.data?.category || null;
    } catch (error) {
        console.error('Error creating category:', error);
    }
}
export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await api.patch(API_ENDPOINTS.CATEGORIES.UPDATE_CATEGORY.replace(':id', categoryId), categoryData);
        return response?.data?.category || null;
    } catch (error) {
        console.error('Error updating category:', error);
    }
}
export const deleteCategory = async (categoryId) => {
    try {
        const response = await api.delete(API_ENDPOINTS.CATEGORIES.DELETE_CATEGORY.replace(':id', categoryId));
        return response?.data?.category || null;
    } catch (error) {
        console.error('Error deleting category:', error);
    }
}
