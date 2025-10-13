const express = require("express")

const adminController = require("../controllers/admin.controller")

const router = express.Router()

const {verifyToken, verifyTokenWithId, allowedAdmin} = require("../helpers")


router.post("/login", adminController.loginAdmin)
router.post("/register", adminController.registerAdmin);



module.exports = router;