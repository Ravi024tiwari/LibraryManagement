import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: [],
  selectedBook: null,
  loading: false,
  error: null
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  selectedBook:null,
  reducers: {
    /* ===============================
       Fetch All Books
    ================================ */
    fetchBooksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBooksSuccess: (state, action) => {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ===============================
       Fetch Single Book
    ================================ */
    fetchBookStart: (state) => {
      state.loading = true;
      state.selectedBook = null;
      state.error = null;
    },
    fetchBookSuccess: (state, action) => {
      state.loading = false;
      state.selectedBook = action.payload;//here we set that selected book from that data
    },
    fetchBookFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /* ===============================
       Admin Actions
    ================================ */
    addBook: (state, action) => {
      state.books.unshift(action.payload);
    },

    updateBook: (state, action) => {
      state.books = state.books.map((book) =>
        book._id === action.payload._id
          ? action.payload
          : book
      );

      if (
        state.selectedBook &&
        state.selectedBook._id === action.payload._id
      ) {
        state.selectedBook = action.payload;
      }
    },

    deleteBook: (state, action) => {
      state.books = state.books.filter(
        (book) => book._id !== action.payload
      );
    },

    clearSelectedBook: (state) => {
      state.selectedBook = null;
    }
  }
});

export const {
  fetchBooksStart,
  fetchBooksSuccess,
  fetchBooksFailure,
  fetchBookStart,
  fetchBookSuccess,
  fetchBookFailure,
  addBook,
  updateBook,
  deleteBook,
  clearSelectedBook
} = bookSlice.actions;

export default bookSlice.reducer;
