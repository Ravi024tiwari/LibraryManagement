import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔄 when API call starts
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    authSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // 🚪 logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    // 🔄 optional: update user profile later
    updateUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const {//here we export the slices + reducers
  authStart,
  authSuccess,
  authFailure,
  logout,
  updateUser
} = authSlice.actions;

export default authSlice.reducer;
