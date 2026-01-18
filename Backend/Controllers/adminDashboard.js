import User from "../Models/UserModel.js";
import Book from "../Models/BooksModels.js";
import Issue from "../Models/IssueModel.js";

//dashboard summary for the count of {studnets}
export const getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();

    const [
      totalStudents,
      totalBooks,
      currentIssues,
      lateStudents
    ] = await Promise.all([
      User.countDocuments({ role: "STUDENT" }),
      Book.countDocuments(),
      Issue.countDocuments({ status: "ISSUED" }),
      Issue.countDocuments({
        status: "ISSUED",
        dueDate: { $lt: today }
      })
    ]);

    res.status(200).json({
      totalStudents,
      totalBooks,
      currentIssues,
      lateStudents
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message
    });
  }
};


//analytics code
export const getDashboardGrowth = async (req, res) => {
  try {
    const booksGrowth = await Book.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const issuesGrowth = await Issue.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      booksGrowth,
      issuesGrowth
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch growth data",
      error: error.message
    });
  }
};
