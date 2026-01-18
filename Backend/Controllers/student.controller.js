import uploadToCloudinary from "../Utils/uploadToCloudinary.js";
import User from "../Models/UserModel.js";
import Issue from "../Models/IssueModel.js"
import bcrypt from "bcryptjs"

export const getMyProfile = async (req, res) => {
  try {
    // req.user protect middleware se aata hai
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized"
      });
    }

    res.status(200).json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profileImage: req.user.profileImage,
        phone: req.user.phone,
        about: req.user.about,
        totalFineDue: req.user.totalFineDue,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      name,
      phone,
      about,
      currentPassword,
      newPassword
    } = req.body;

    /* =====================
       BASIC INFO UPDATE
    ===================== */
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (about) user.about = about;

    /* =====================
       PASSWORD UPDATE
    ===================== */
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Both current and new password are required"
        });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect"
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters"
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    /* =====================
       PROFILE IMAGE
    ===================== */
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "library/profiles"
      );
      user.profileImage = result.secure_url;
    }

    await user.save();

    // password never return
    user.password = undefined;

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//HERE STUDENT FIND ALL ITS ISSUED BOOKS
export const getMyActiveIssues = async (req, res) => {
  try {
    const issues = await Issue.find({//here its find all the issue from the issue documeht with userId and status ='Issue
      student: req.user._id,
      status: "ISSUED"
    }).populate("book");

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//ISSUE HISTORY WITH PAGINATION

export const getMyIssueHistory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const issues = await Issue.find({
      student: req.user._id
    })
      .populate("book")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Issue.countDocuments({
      student: req.user._id
    });

    res.status(200).json({
      total,
      page,
      issues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//here the user find the current  issue book fines
export const getMyFines = async (req, res) => {
  try {
    const issues = await Issue.find({
      student: req.user._id,
      fineAmount: { $gt: 0 },
      fineStatus: "UNPAID"
    }).populate("book", "title author");

    res.status(200).json({
      totalFineDue: req.user.totalFineDue,
      fines: issues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//we can also make the seperate page of all the fines 



//student dashboard

export const getMySummary = async (req, res) => {
  try {
    const issuedCount = await Issue.countDocuments({//it get all the issue Count books number
      student: req.user._id,
      status: "ISSUED"
    });

    const returnedCount = await Issue.countDocuments({//its count all the return book number after that
      student: req.user._id,
      status: "RETURNED"
    });

    res.status(200).json({
      issuedCount,
      returnedCount,
      totalFineDue: req.user.totalFineDue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
