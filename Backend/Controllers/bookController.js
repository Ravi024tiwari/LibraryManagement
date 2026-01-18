import Book from "../Models/BooksModels.js";
import uploadToCloudinary from "../Utils/uploadToCloudinary.js";


export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      description,
      totalCopies
    } = req.body;

    // ✅ 1️⃣ Multer file validation error check
    if (req.fileValidationError) {
      return res.status(400).json({
        message: req.fileValidationError
      });
    }

    // ✅ 2️⃣ Required fields check
    if (!title || !author || !category || !totalCopies) {
      return res.status(400).json({
        message: "Required fields are missing"
      });
    }

    // ✅ 3️⃣ totalCopies must be valid number
    if (Number(totalCopies) <= 0) {
      return res.status(400).json({
        message: "Total copies must be greater than 0"
      });
    }

    let coverImageUrl = "";

    // 🔐 Book cover rule: ONLY IMAGE
    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          message: "Book cover must be an image file (PDF not allowed)"
        });
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        "library/book-covers"
      );

      coverImageUrl = result.secure_url;
    }

    const book = await Book.create({
      title,
      author,
      category,
      description,
      coverImage: coverImageUrl,
      totalCopies: Number(totalCopies),
      availableCopies: Number(totalCopies)
    });

    res.status(201).json({
      message: "Book created successfully",
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    // 🔐 Cover image update: ONLY IMAGE
    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          message: "Book cover must be an image file (PDF not allowed)"
        });
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        "library/book-covers"
      );

      book.coverImage = result.secure_url;
    }

    // 🔄 Other fields
    const {
      title,
      author,
      category,
      description,
      totalCopies
    } = req.body;

    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (description) book.description = description;

    // ⚠️ Safe stock update
    if (totalCopies !== undefined) {
      const diff = totalCopies - book.totalCopies;
      book.totalCopies = totalCopies;
      book.availableCopies += diff;

      if (book.availableCopies < 0) {
        book.availableCopies = 0;
      }
    }

    await book.save();

    res.status(200).json({
      message: "Book updated successfully",
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.deleteOne();

    res.status(200).json({
      message: "Book deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const filter = category ? { category } : {};

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      total,
      page: Number(page),
      books
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    let alreadyIssued = false;

    // 🔹 Extra logic ONLY for student
    if (req.user.role === "STUDENT") {
      const issue = await Issue.findOne({
        student: req.user._id,
        book: book._id,
        status: "ISSUED"
      });

      alreadyIssued = !!issue;
    }

    res.status(200).json({
      book,
      availability:
        book.availableCopies > 0 ? "AVAILABLE" : "OUT_OF_STOCK",
      alreadyIssued
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateBookStock = async (req, res) => {
  try {
    const { totalCopies, availableCopies } = req.body;

    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (availableCopies > totalCopies) {
      return res.status(400).json({
        message: "Available copies cannot exceed total copies"
      });
    }

    book.totalCopies = totalCopies;
    book.availableCopies = availableCopies;

    await book.save();

    res.status(200).json({
      message: "Book stock updated",
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getPopularBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ borrowCount: -1 })
      .limit(6);

    res.status(200).json({
      message:"Popular books get successfully",
      books
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    const books = await Book.find({
      $text: { $search: q }
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
