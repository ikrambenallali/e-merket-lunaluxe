import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, user: null },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

// Export des actions
export const { setCredentials, logout } = authSlice.actions;

// Export par défaut du reducer pour le store
export default authSlice.reducer;
