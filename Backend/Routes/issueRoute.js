import express from "express";
import Issue from "../Models/IssueModel.js";
import {
  issueBook,
  returnBook,
  payFine,
  getActiveIssues,
  getIssueHistory,
  getLateStudents
} from "../Controllers/issue.controller.js";

import { protect, adminOnly } from "../Middlewares/auth.middleware.js";

const issueRouter = express.Router();


issueRouter.post(
  "/issue-book",
  protect,
  adminOnly,
  issueBook
);


issueRouter.put(
  "/return/:issueId",
  protect,
  adminOnly,
  returnBook
);


issueRouter.put(
  "/:issueId/pay-fine",
  protect,
  adminOnly,
  payFine
);


issueRouter.get(
  "/active/issues",
  protect,
  adminOnly,
  getActiveIssues
);


issueRouter.get(
  "/history",
  protect,
  adminOnly,
  getIssueHistory
);

issueRouter.get("/late/students",protect,adminOnly,getLateStudents)

export  {issueRouter};
