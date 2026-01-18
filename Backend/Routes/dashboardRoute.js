import express from "express";
import {
  getDashboardSummary,
  getDashboardGrowth
} from "../Controllers/adminDashboard.js";
import { protect, adminOnly } from "../Middlewares/auth.middleware.js";

const adminDashboardRouter = express.Router();

adminDashboardRouter.get(
  "/dashboard/summary",
  protect,
  adminOnly,
  getDashboardSummary
);

adminDashboardRouter.get(
  "/dashboard/growth",
  protect,
  adminOnly,
  getDashboardGrowth
);

export default adminDashboardRouter;
