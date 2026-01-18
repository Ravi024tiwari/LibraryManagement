import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: {
    currentIssues: [],
    issueHistory: [],
    lateStudents: []
  },

  student: {
    myCurrentIssues: [],
    myIssueHistory: [],
    myFineSummary: {
      totalFine: 0,
      lateBooks: 0
    }
  },

  loading: false,
  error: null
};

const issueSlice = createSlice({
  name: "issue",
  initialState,
  reducers: {
    /* =====================
       COMMON
    ===================== */
    setIssueLoading: (state, action) => {
      state.loading = action.payload;
    },

    setIssueError: (state, action) => {
      state.error = action.payload;
    },

    clearIssueError: (state) => {
      state.error = null;
    },

    resetIssueState: () => initialState,

    /* =====================
       ADMIN
    ===================== */
    setAdminCurrentIssues: (state, action) => {
      state.admin.currentIssues = action.payload;
    },

    addAdminCurrentIssue: (state, action) => {
      state.admin.currentIssues.unshift(action.payload);
    },

    removeAdminCurrentIssue: (state, action) => {
      state.admin.currentIssues = state.admin.currentIssues.filter(
        (issue) => issue._id !== action.payload
      );
    },

    setAdminIssueHistory: (state, action) => {
      state.admin.issueHistory = action.payload;
    },

    setLateStudents: (state, action) => {
      state.admin.lateStudents = action.payload;
    },

    /* =====================
       STUDENT
    ===================== */
    setMyCurrentIssues: (state, action) => {
      state.student.myCurrentIssues = action.payload;
    },

    setMyIssueHistory: (state, action) => {
      state.student.myIssueHistory = action.payload;
    },

    setMyFine: (state, action) => {
      state.student.myFineSummary = action.payload;
    }
  }
});

export const {
  /* common */
  setIssueLoading,
  setIssueError,
  clearIssueError,
  resetIssueState,

  /* admin */
  setAdminCurrentIssues,
  addAdminCurrentIssue,
  removeAdminCurrentIssue,
  setAdminIssueHistory,
  setLateStudents,

  /* student */
  setMyCurrentIssues,
  setMyIssueHistory,
  setMyFine
} = issueSlice.actions;

export default issueSlice.reducer;
