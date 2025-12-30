import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    fetchProducts,
    fetchProductById,
    fetchSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService";

export const fetchProductsAsync = createAsyncThunk("products/fetchProducts", fetchProducts);
export const fetchProductAsync = createAsyncThunk("products/fetchProduct", fetchProductById);
export const fetchSellerProductsAsync = createAsyncThunk("products/fetchSellerProducts", fetchSellerProducts);
export const createProductAsync = createAsyncThunk("products/createProduct", createProduct);

export const updateProductAsync = createAsyncThunk(
    "products/updateProduct",
    async ({ id, productData }) => {
        return await updateProduct(id, productData);
    }
);

export const deleteProductAsync = createAsyncThunk(
    "products/deleteProduct",
    async (id) => {
        return await deleteProduct(id);
    }
);

const slice = createSlice({
    name: "products",
    initialState: {
        items: [],
        currentProduct: null,
        sellerProducts: [],
        status: "idle",
        error: null,
    },
    reducers: {
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
        clearSellerProducts: (state) => {
            state.sellerProducts = [];
        },
    },

    extraReducers: (builder) => {
        builder
            // Fetch all products
            .addCase(fetchProductsAsync.pending, (state) => {
                console.log("fetchProductsAsync.pending");
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchProductsAsync.fulfilled, (state, action) => {
                console.log("fetchProductsAsync.fulfilled", action.payload);
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchProductsAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Fetch product by ID
            .addCase(fetchProductAsync.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchProductAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Fetch seller products
            .addCase(fetchSellerProductsAsync.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchSellerProductsAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.sellerProducts = action.payload;
            })
            .addCase(fetchSellerProductsAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Create product
            .addCase(createProductAsync.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createProductAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                if (action.payload) {
                    state.items.push(action.payload);
                    state.sellerProducts.push(action.payload);
                }
            })
            .addCase(createProductAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Update product
            .addCase(updateProductAsync.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateProductAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updatedId = action.payload?._id || action.meta.arg?.id;
                console.log("updatedId", updatedId);
                if (updatedId && action.payload) {
                    // Update in items array
                    const index = state.items.findIndex(p => p._id === updatedId);
                    if (index !== -1) {
                        state.items[index] = action.payload;
                    }
                    // Update in sellerProducts array
                    const sellerIndex = state.sellerProducts.findIndex(p => p._id === updatedId);
                    if (sellerIndex !== -1) {
                        state.sellerProducts[sellerIndex] = action.payload;
                    }
                    // Update currentProduct if it's the one being updated
                    if (state.currentProduct?._id === updatedId) {
                        state.currentProduct = action.payload;
                    }
                }
            })
            .addCase(updateProductAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Delete product
            .addCase(deleteProductAsync.pending, (state) => {
                console.log("deleteProductAsync.pending");
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteProductAsync.fulfilled, (state, action) => {
                console.log("deleteProductAsync.fulfilled", action.payload);
                state.status = "succeeded";
                const deletedId = action.payload?._id || action.meta.arg;
                if (deletedId) {
                    state.items = state.items.filter((product) => product._id !== deletedId);
                    state.sellerProducts = state.sellerProducts.filter((product) => product._id !== deletedId);
                    if (state.currentProduct?._id === deletedId) {
                        state.currentProduct = null;
                    }
                }
            })
            .addCase(deleteProductAsync.rejected, (state, action) => {
                console.log("deleteProductAsync.rejected", action.error);
                state.status = "failed";
                state.error = action.error.message;
            });
    },

});

export const { clearCurrentProduct, clearSellerProducts } = slice.actions;
export default slice.reducer;

