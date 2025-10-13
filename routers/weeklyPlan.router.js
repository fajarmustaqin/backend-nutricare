const express = require("express");
const WeeklyPlanController = require("../controllers/weeklyPlan.controller");
const { verifyToken, allowedAdmin, allowedUser } = require("../helpers");

const WeeklyPlanRouter = express.Router();

// Admin routes
WeeklyPlanRouter.get("/", [verifyToken, allowedAdmin], WeeklyPlanController.getAllWeeklyPlans);
WeeklyPlanRouter.get("/user/:userId", [verifyToken, allowedAdmin], WeeklyPlanController.getWeeklyPlanByUser);
WeeklyPlanRouter.post("/", [verifyToken, allowedAdmin], WeeklyPlanController.createWeeklyPlan);
WeeklyPlanRouter.patch("/:id", [verifyToken, allowedAdmin], WeeklyPlanController.updateWeeklyPlan);
WeeklyPlanRouter.delete("/:id", [verifyToken, allowedAdmin], WeeklyPlanController.deleteWeeklyPlan);
WeeklyPlanRouter.get("/generate/:userId", [verifyToken, allowedAdmin], WeeklyPlanController.generateDefaultPlan);

// User routes
WeeklyPlanRouter.get("/my-plan", [verifyToken, allowedUser], WeeklyPlanController.getCurrentWeekPlan);

module.exports = WeeklyPlanRouter;
