const express = require("express");
const DiseaseTemplateController = require("../controllers/diseaseTemplate.controller");
const { verifyToken, allowedAdmin } = require("../helpers");

const DiseaseTemplateRouter = express.Router();

// All routes require admin authentication
DiseaseTemplateRouter.get("/", [verifyToken, allowedAdmin], DiseaseTemplateController.getAllDiseaseTemplates);
DiseaseTemplateRouter.get("/:id", [verifyToken, allowedAdmin], DiseaseTemplateController.getDiseaseTemplateById);
DiseaseTemplateRouter.post("/", [verifyToken, allowedAdmin], DiseaseTemplateController.createDiseaseTemplate);
DiseaseTemplateRouter.patch("/:id", [verifyToken, allowedAdmin], DiseaseTemplateController.updateDiseaseTemplate);
DiseaseTemplateRouter.delete("/:id", [verifyToken, allowedAdmin], DiseaseTemplateController.deleteDiseaseTemplate);

// Utility routes
DiseaseTemplateRouter.get("/category/:category", [verifyToken, allowedAdmin], DiseaseTemplateController.getTemplatesByCategory);
DiseaseTemplateRouter.post("/calculate", [verifyToken, allowedAdmin], DiseaseTemplateController.calculateCaloriesForPatient);

module.exports = DiseaseTemplateRouter;
