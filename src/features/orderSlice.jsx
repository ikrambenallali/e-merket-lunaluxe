// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { api } from "../config/api";

// export const fetchOrders = createAsyncThunk(
//   "orders/fetchOrders",
//   async (userId, { rejectWithValue }) => {
    
//     try {
//       const user = JSON.parse(localStorage.getItem('user'));
//       // console.log("Fetching orders for userId =", userId ? userId : user.id);
      
//       const res = await api.get(`/orders/${userId ? userId : user.id}`);
//       console.log(userId);
      
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );
// export const deletOrder =createAsyncThunk(
//   "orders/deleteOrder",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await api.delete(`/orders/${id}/soft`);
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );
// export const fetchOrdersAdmin = createAsyncThunk(
//   "orders/fetchOrdersAdmin",
//   async (_, { rejectWithValue }) => {
    
//     try {
//       const res = await api.get("/orders");
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );
// export const fetchOrdersDeleted = createAsyncThunk(
//   "orders/fetchOrdersDeleted",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/orders/deleted");
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );
// export const updateStatusOrder = createAsyncThunk(
//   "orders/updateStatusOrder",
//   async ({ id, newStatus }, { rejectWithValue }) => {
//     try {
//       const res = await api.patch(`/orders/${id}/status`, { newStatus });
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );
// export const createOrder = createAsyncThunk(
//   "orders/createOrder",
//   async (orderData, { rejectWithValue }) => {
//     try {
//       console.log("ORDER DATA =", orderData);
//       const res = await api.post("/orders", orderData);

//       return res.data.data.order;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const getSellerOrders = createAsyncThunk(
//   "orders/getSellerOrders",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/orders/seller"); 
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );




// export const restoreOrder = createAsyncThunk(
//   "orders/restoreOrder",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await api.patch(`/orders/${id}/restore`);
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// const ordersSlice = createSlice({
//   name: "orders",
//   initialState: {
//     orders: [],
//     sellerOrders: [], 
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // FETCH ORDERS
//       .addCase(fetchOrders.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(fetchOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // update status order
//       .addCase(updateStatusOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateStatusOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.orders.findIndex(order => order._id === action.payload._id);
//         if (index !== -1) {
//           state.orders[index] = action.payload;
//         }
//       })
//       .addCase(updateStatusOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })


//       // FETCH ORDERS ADMIN
//       .addCase(fetchOrdersAdmin.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchOrdersAdmin.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(fetchOrdersAdmin.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // CREATE ORDER
//       .addCase(createOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders.push(action.payload); // push la nouvelle commande
//       })
//       .addCase(createOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
// // delet order 
//       .addCase(deletOrder.pending, (state) => {
//         state.loading = true;
//       })
//         .addCase(deletOrder.fulfilled, (state, action) => {
//               state.loading = false;
//               const deletedId = action.payload?._id ?? action.payload?.id ?? action.payload;
//               if (!deletedId) return; // nothing to remove or unexpected payload
//               if (!Array.isArray(state.orders)) return;
//               state.orders = state.orders.filter(order => order && order._id !== deletedId);
//             })
//       .addCase(deletOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

// // restore order
//       .addCase(restoreOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(restoreOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders.push(action.payload);
//       })
//       .addCase(restoreOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // orders deleted
//       .addCase(fetchOrdersDeleted.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchOrdersDeleted.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(fetchOrdersDeleted.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//       // get seller orders
//       builder
//       .addCase(getSellerOrders.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getSellerOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(getSellerOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default ordersSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    sellerOrders: [],
    deletedOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
    setDeletedOrders(state, action) {
      state.deletedOrders  = action.payload;
    },
    setSellerOrders(state, action) {
      state.sellerOrders = action.payload;
    },
    addOrder(state, action) {
      state.orders.push(action.payload);
    },
    removeOrder(state, action) {
      state.orders = state.orders.filter((o) => o._id !== action.payload);
    },
    updateOrder(state, action) {
      const updated = action.payload;
      const index = state.orders.findIndex((o) => o._id === updated._id);
      if (index !== -1) state.orders[index] = updated;
    },
  restoreOrderRedux(state, action) {
  const restored = action.payload;

  // Ajouter dans orders (normal)
  state.orders.push(restored);

  // Retirer des deletedOrders
  state.deletedOrders = state.deletedOrders.filter(
    (o) => o._id !== restored._id
  );
}

  },
});

export const {
  setOrders,
  addOrder,
  removeOrder,
  updateOrder,
  restoreOrderRedux,
  setDeletedOrders,
  setSellerOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;

