import Book from "../Models/BooksModels.js";
import User from "../Models/UserModel.js";
import Issue from "../Models/IssueModel.js";
/* =====================================================
   1️⃣ ISSUE BOOK TO STUDENT (ADMIN)
===================================================== */
export const issueBook = async (req, res) => {
  try {
    const { email, bookId } = req.body;

    if (!email || !bookId) {
      return res.status(400).json({
        message: "Student email and Book are required"
      });
    }

    const student = await User.findOne({ email });
    if (!student || student.role !== "STUDENT") {
      return res.status(404).json({
        message: "Student not found with this email"
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        message: "Book is out of stock"
      });
    }

    // 🔴 Max 3 active books
    const activeIssuesCount = await Issue.countDocuments({
      student: student._id,
      status: "ISSUED"
    });

    if (activeIssuesCount >= 3) {
      return res.status(400).json({
        message: "Student already has 3 active issued books"
      });
    }

    // ✅ FIXED DUPLICATE CHECK (MOST IMPORTANT)
    const duplicateIssue = await Issue.findOne({
      student: student._id,
      book: book._id,
      status: "ISSUED"
    });

    if (duplicateIssue) {
      return res.status(400).json({
        message: "Student already has this book issued"
      });
    }

    // 📅 Issue duration = 14 days
    const issueDate = new Date();
    const expectedReturnDate = new Date(issueDate);
    expectedReturnDate.setDate(issueDate.getDate() + 14);

    const issue = await Issue.create({
      student: student._id,
      book: book._id,
      issueDate,
      expectedReturnDate
    });

    // 🔄 Update book
    book.availableCopies -= 1;
    book.borrowCount += 1;
    await book.save();

    // 🔄 Update student
    student.issuedBooks.push(issue._id);
    await student.save();

    res.status(201).json({
      message: "Book issued successfully",
      issue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   2️⃣ RETURN BOOK (ADMIN)
===================================================== */
export const returnBook = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId)// here its find the issued Book document from DB
      .populate("book")
      .populate("student");

    if (!issue || issue.status === "RETURNED") {
      return res.status(404).json({
        message: "Issue record not found or already returned"
      });
    }

    const returnDate = new Date();
    issue.actualReturnDate = returnDate;//here its set the return date of that book
    issue.status = "RETURNED";

    // Fine calculation
    const diffTime =
      returnDate.getTime() -
      issue.expectedReturnDate.getTime();

    const lateDays =
      diffTime > 0
        ? Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        : 0;

    issue.lateDays = lateDays;
    issue.fineAmount = lateDays * 10;
    issue.fineStatus = lateDays > 0 ? "UNPAID" : "PAID";

    await issue.save();

    // 🔄 Update book stock
    issue.book.availableCopies += 1;//here we update the available copy of that book in the library
    await issue.book.save();

    // 🔄 Remove issue from student active list
    issue.student.issuedBooks =
      issue.student.issuedBooks.filter(
        (id) => id.toString() !== issue._id.toString()
      );

    // 🔄 Update student fine
    issue.student.totalFineDue += issue.fineAmount;
    await issue.student.save();

    res.status(200).json({
      message: "Book returned successfully",
      issue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   3️⃣ MARK FINE AS PAID (ADMIN)
===================================================== */
export const payFine = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId)//here we pay fine for that issue Id when the admin issue book to student
      .populate("student");

    if (!issue || issue.fineAmount === 0) {
      return res.status(404).json({
        message: "No fine found for this issue"
      });
    }

    if (issue.fineStatus === "PAID") {
      return res.status(400).json({
        message: "Fine already paid"
      });
    }

    issue.fineStatus = "PAID";
    await issue.save();

    // 🔄 Update student fine balance
    issue.student.totalFineDue -= issue.fineAmount;
    await issue.student.save();

    res.status(200).json({
      message: "Fine marked as paid"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   4️⃣ ADMIN: GET ACTIVE ISSUES
===================================================== */
export const getActiveIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      status: "ISSUED"
    })
      .populate("student", "name email")
      .populate("book", "title author");

    res.status(200).json({
      message:"Admin Issue fetch successfully",
      issues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   5️⃣ ADMIN: GET ALL ISSUE HISTORY
===================================================== */
export const getIssueHistory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const issues = await Issue.find()
      .populate("student", "name email")
      .populate("book", "title author")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Issue.countDocuments();

    res.status(200).json({
      total,
      page,
      issues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LATE STUDENTS LIST JO JINKI DATE HO CHUKI HAI
export const getLateStudents = async (req, res) => {
  try {
    const today = new Date();

    const lateIssues = await Issue.find({
      status: "ISSUED",
      expectedReturnDate: { $lt: today },
      fineStatus: "UNPAID"
    })
      .populate("student", "name email")
      .populate("book", "title author")
      .sort({ expectedReturnDate: 1 }); // oldest overdue first

    res.status(200).json(lateIssues);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

