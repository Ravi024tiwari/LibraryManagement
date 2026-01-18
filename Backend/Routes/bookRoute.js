import express from "express";
import {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getSingleBook,
  updateBookStock,
  getPopularBooks,
  searchBooks
} from "../Controllers/bookController.js";

import { protect, adminOnly } from "../Middlewares/auth.middleware.js";
import upload from "../Middlewares/multer.middleware.js";//here we upload that file on that

const bookRouter = express.Router();

/* ADMIN ROUTES */
bookRouter.post("/create", protect, adminOnly,upload.single("coverImage"), createBook);

bookRouter.put("/update/:bookId", protect, adminOnly,upload.single("coverImage"), updateBook);

bookRouter.delete("/delete/:bookId", protect, adminOnly, deleteBook);

bookRouter.patch("/stock/:bookId", protect, adminOnly, updateBookStock);

/* COMMON ROUTES */

bookRouter.get("/get-all-books", protect, getAllBooks);
bookRouter.get("/popular", protect, getPopularBooks);
bookRouter.get("/search", protect, searchBooks);
bookRouter.get("/:bookId", protect, getSingleBook);

export { bookRouter};
