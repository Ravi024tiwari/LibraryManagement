import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getMyActiveIssues,
  getMyIssueHistory,
  getMyFines,
  getMySummary
} from "../Controllers/student.controller.js";

import { protect } from "../Middlewares/auth.middleware.js";
import upload from "../Middlewares/multer.middleware.js";

const studentRouter = express.Router();


studentRouter.get(
  "/getProfile",
  protect,
  getMyProfile
);


studentRouter.put(
  "/update-profile",
  protect,
  upload.single("file"),
  updateMyProfile
);


studentRouter.get(
  "/issues",
  protect,
  getMyActiveIssues
);

studentRouter.get(
  "/history",
  protect,
  getMyIssueHistory
);

studentRouter.get(
  "/fines",
  protect,
  getMyFines
);

studentRouter.get(
  "/summary",
  protect,
  getMySummary
);

export {studentRouter};
