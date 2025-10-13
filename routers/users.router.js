const express = require("express");

const usersController = require("../controllers/users.controller");

const router = express.Router();

const { verifyToken, verifyTokenWithId, allowedAdmin } = require("../helpers");

// Admin routes
router.get("/", [verifyToken, allowedAdmin], usersController.getAllUsers);

// Public routes
router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);
router.post("/auth/google", usersController.loginByGoogle);
router.patch("/register/google", usersController.registerByGoogle)

module.exports = router;
