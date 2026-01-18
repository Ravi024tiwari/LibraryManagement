import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BookCard from "@/components/BookCard.jsx";

import {
  fetchBooksStart,
  fetchBooksSuccess,
  fetchBooksFailure
} from "../store/bookSlice.js";

const BooksPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { books, loading, error } = useSelector(
    (state) => state.books
  );

  useEffect(() => {//here we can make it as a hooks
    const fetchBooks = async () => {
      dispatch(fetchBooksStart());

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/book/get-all-books`,{withCredentials:true});//here we call them to get the response from the backend 
        console.log('The response from the backend book:',res);
        dispatch(fetchBooksSuccess(res.data.books));
      } catch (err) {
        dispatch(
          fetchBooksFailure(
            err.response?.data?.message ||
              "Failed to load books"
          )
        );
      }
    };

    fetchBooks();
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Books Store
        </h1>

        {/* Admin-only Add Book */}
        {user?.role === "ADMIN" && (
          <button
            onClick={() => navigate("/admin/books/create")}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            Add Book
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-zinc-500">Loading books...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-rose-500">{error}</p>
      )}

      {/* Books Grid */}
      {!loading && !error && books.length === 0 && (
        <p className="text-zinc-500">
          No books available.
        </p>
      )}

      {!loading && !error && books.length > 0 && (//here we pass the each book data and show on the ui
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
