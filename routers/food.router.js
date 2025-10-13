const express = require("express");
const FoodController = require("../controllers/food.controller");
const { verifyToken, allowedAdmin} = require("../helpers");
const { uploadSingle, handleUploadError } = require("../helpers/upload");

const FoodRouter = express.Router();

FoodRouter.get("/", FoodController.getAll);
FoodRouter.get("/:id", FoodController.getByID);

FoodRouter.post("/", [verifyToken, allowedAdmin], FoodController.addFood);
FoodRouter.patch("/:id", [verifyToken, allowedAdmin], FoodController.editFood);
FoodRouter.delete("/:id", [verifyToken, allowedAdmin], FoodController.deleteFood);
FoodRouter.post("/all", FoodController.getMultipleFood);

// Image upload endpoint
FoodRouter.post("/upload-image", [verifyToken, allowedAdmin, uploadSingle, handleUploadError], FoodController.uploadImage);

module.exports = FoodRouter;
