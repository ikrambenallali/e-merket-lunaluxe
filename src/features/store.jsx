import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import ordersReducer from "./orderSlice";
import categoryReducer from "./categorySlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    categories: categoryReducer,
    cart: cartReducer,
    products: productReducer,
  },
});

export default store;
