import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  summary: {
    totalStudents: 0,
    totalBooks: 0,
    currentIssues: 0,
    lateStudents: 0
  },

  growth: {
    booksGrowth: [],
    issuesGrowth: []
  },

  loading: false,
  error: null
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    /* ===============================
       DASHBOARD SUMMARY
    ================================ */
    fetchAdminSummaryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAdminSummarySuccess: (state, action) => {
      state.loading = false;
      state.summary = action.payload;
    },
    fetchAdminSummaryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ===============================
       DASHBOARD GROWTH STATS
    ================================ */
    fetchAdminGrowthStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAdminGrowthSuccess: (state, action) => {
      state.loading = false;
      state.growth = action.payload;
    },
    fetchAdminGrowthFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ===============================
       RESET (OPTIONAL)
    ================================ */
    clearAdminState: (state) => {
      state.summary = initialState.summary;
      state.growth = initialState.growth;
      state.loading = false;
      state.error = null;
    }
  }
});

export const {
  fetchAdminSummaryStart,
  fetchAdminSummarySuccess,
  fetchAdminSummaryFailure,
  fetchAdminGrowthStart,
  fetchAdminGrowthSuccess,
  fetchAdminGrowthFailure,
  clearAdminState
} = adminSlice.actions;

export default adminSlice.reducer;
