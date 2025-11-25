const express = require("express")
const TrackingController = require("../controllers/tracking.controller")
const { verifyToken, allowedUser, allowedAdmin } = require("../helpers")

const TrackingRouter = express.Router()

// Middleware to log all requests to tracking router
TrackingRouter.use((req, res, next) => {
  console.log(`📥 Tracking router - ${req.method} ${req.path}`);
  next();
});

// Test route to verify router is working
TrackingRouter.get("/test", (req, res) => {
  res.json({message: "Tracking router is working!", path: req.path});
});

// Admin routes for tracking management - MUST BE FIRST to avoid conflict with /:date
TrackingRouter.get("/admin/all", (req, res, next) => {
  console.log('🔍 Route /admin/all hit');
  next();
}, verifyToken, allowedAdmin, TrackingController.getAllUsersTracking)

TrackingRouter.get("/admin/user/:userId", (req, res, next) => {
  console.log('🔍 Route /admin/user/:userId hit, userId:', req.params.userId);
  console.log('📥 Full request path:', req.originalUrl);
  console.log('📥 Request path:', req.path);
  console.log('📥 Request params:', req.params);
  next();
}, verifyToken, allowedAdmin, TrackingController.getUserTracking)

// User routes
TrackingRouter.get("/", [verifyToken, allowedUser], TrackingController.getTracking)
TrackingRouter.post("/", [verifyToken, allowedUser], TrackingController.addTracking)
TrackingRouter.get("/today", [verifyToken, allowedUser], TrackingController.todayTracking)
TrackingRouter.patch("/serap-emisi", [verifyToken, allowedUser], TrackingController.resetKarbon)

// Date route - MUST BE LAST to avoid conflict
// Only match if path is a valid date format (YYYY-MM-DD) and NOT admin routes
TrackingRouter.get("/:date", [verifyToken, allowedUser], (req, res, next) => {
  // IMPORTANT: Skip if path contains "admin" to avoid conflict
  if (req.path.includes('/admin') || req.originalUrl.includes('/admin')) {
    console.log('⚠️ Route /:date skipping - path contains admin:', req.path);
    // Don't send response, let Express continue to next route handler
    // If no route matches, Express will return 404
    return next('route'); // Skip this route handler
  }
  
  // Check if date is valid format (YYYY-MM-DD)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(req.params.date)) {
    console.log('⚠️ Route /:date skipping - invalid date format:', req.params.date);
    return next('route'); // Skip this route handler
  }
  
  console.log('✅ Route /:date matched for date:', req.params.date);
  next();
}, TrackingController.perDateTracking)

module.exports = TrackingRouter