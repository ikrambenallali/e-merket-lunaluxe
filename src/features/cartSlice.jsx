import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
  discount: 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      const items = Array.isArray(action.payload.items) ? action.payload.items : [];
      state.items = items;
      state.total = items.reduce((sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 0), 0);

    },
    addItem(state, action) {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      state.total += item.productId.price * item.quantity;
    },
    removeItem(state, action) {
      const id = action.payload;
      const index = state.items.findIndex(i => i.id === id);
      if (index !== -1) {
        state.total -= state.items[index].productId.price * state.items[index].quantity;
        state.items.splice(index, 1);
      }
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        state.total -= item.productId.price * item.quantity;
        item.quantity = quantity;
        console.log("quantité", item.quantity);
        state.total += item.productId.price * quantity;
      }
    },
    applyDiscount(state, action) {
      state.discount = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
      state.discount = 0;
    }
  }
});

export const { setCart, addItem, removeItem, updateQuantity, applyDiscount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
