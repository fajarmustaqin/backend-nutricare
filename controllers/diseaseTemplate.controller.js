const DiseaseTemplateModel = require("../models/diseaseTemplate.model");
const { dataToken } = require("../helpers");

// Get all disease templates
const getAllDiseaseTemplates = async (req, res) => {
  try {
    const templates = await DiseaseTemplateModel.find({ isActive: true })
      .populate('createdBy', 'email')
      .sort({ kategoriPenyakit: 1, namaPenyakit: 1 });
    
    res.status(200).send(templates);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get disease template by ID
const getDiseaseTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await DiseaseTemplateModel.findById(id)
      .populate('createdBy', 'email');
    
    if (!template) {
      return res.status(404).send({ message: "Disease template not found" });
    }
    
    res.status(200).send(template);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create new disease template
const createDiseaseTemplate = async (req, res) => {
  try {
    const { data } = dataToken(req, res);
    const adminId = data._id;
    
    const templateData = {
      ...req.body,
      createdBy: adminId
    };
    
    const template = new DiseaseTemplateModel(templateData);
    const saved = await template.save();
    
    const populated = await DiseaseTemplateModel.findById(saved._id)
      .populate('createdBy', 'email');
    
    res.status(201).send({
      message: "Disease template berhasil dibuat",
      data: populated
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update disease template
const updateDiseaseTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updated = await DiseaseTemplateModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('createdBy', 'email');
    
    if (!updated) {
      return res.status(404).send({ message: "Disease template not found" });
    }
    
    res.status(200).send({
      message: "Disease template berhasil diupdate",
      data: updated
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete disease template
const deleteDiseaseTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete - set isActive to false
    const updated = await DiseaseTemplateModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).send({ message: "Disease template not found" });
    }
    
    res.status(200).send({
      message: "Disease template berhasil dihapus",
      deletedTemplate: updated.namaPenyakit
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get templates by category
const getTemplatesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const templates = await DiseaseTemplateModel.find({ 
      kategoriPenyakit: category,
      isActive: true 
    }).populate('createdBy', 'email');
    
    res.status(200).send(templates);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Calculate calories for specific patient using template
const calculateCaloriesForPatient = async (req, res) => {
  try {
    const { templateId, patientWeight } = req.body;
    
    const template = await DiseaseTemplateModel.findById(templateId);
    if (!template) {
      return res.status(404).send({ message: "Template not found" });
    }
    
    const calculatedPlan = template.templateMingguan.map(day => {
      const totalCalories = day.kaloriPerKg * patientWeight;
      
      return {
        hari: day.hari,
        targetKalori: Math.round(totalCalories),
        targetKarbohidrat: Math.round((totalCalories * day.persentaseKarbohidrat / 100) / 4),
        targetProtein: Math.round((totalCalories * day.persentaseProtein / 100) / 4),
        targetLemak: Math.round((totalCalories * day.persentaseLemak / 100) / 9),
        catatan: day.catatanMedis,
        pantangan: day.pantanganMakanan,
        rekomendasi: day.rekomendasiMakanan
      };
    });
    
    res.status(200).send({
      template: template.namaPenyakit,
      patientWeight: patientWeight,
      calculatedPlan: calculatedPlan
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllDiseaseTemplates,
  getDiseaseTemplateById,
  createDiseaseTemplate,
  updateDiseaseTemplate,
  deleteDiseaseTemplate,
  getTemplatesByCategory,
  calculateCaloriesForPatient
};
