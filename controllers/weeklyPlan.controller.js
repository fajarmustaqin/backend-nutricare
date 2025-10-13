const WeeklyPlanModel = require("../models/weeklyPlan.model");
const UserModel = require("../models/users.model");
const { dataToken } = require("../helpers");

// Get all weekly plans (Admin only)
const getAllWeeklyPlans = async (req, res) => {
  try {
    const plans = await WeeklyPlanModel.find()
      .populate('userID', 'nama no_hp email')
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });
    
    res.status(200).send(plans);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get weekly plan by user ID
const getWeeklyPlanByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await WeeklyPlanModel.find({ userID: userId })
      .populate('userID', 'nama no_hp email kaloriYgDibutuhkan')
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });
    
    res.status(200).send(plans);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create new weekly plan (Admin only)
const createWeeklyPlan = async (req, res) => {
  try {
    const { data } = dataToken(req, res);
    const adminId = data._id;
    
    const {
      userID,
      mingguKe,
      tahun,
      tanggalMulai,
      tanggalSelesai,
      planHarian,
      catatan
    } = req.body;

    // Validate user exists
    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(404).send({ message: "User tidak ditemukan" });
    }

    // Check if plan already exists for this week
    const existingPlan = await WeeklyPlanModel.findOne({
      userID,
      mingguKe,
      tahun
    });

    if (existingPlan) {
      return res.status(400).send({ 
        message: "Plan untuk minggu ini sudah ada. Gunakan update untuk mengubah." 
      });
    }

    const weeklyPlan = new WeeklyPlanModel({
      userID,
      namaPasien: user.nama,
      mingguKe,
      tahun,
      tanggalMulai,
      tanggalSelesai,
      planHarian,
      catatan,
      createdBy: adminId
    });

    const saved = await weeklyPlan.save();
    const populated = await WeeklyPlanModel.findById(saved._id)
      .populate('userID', 'nama no_hp email')
      .populate('createdBy', 'email');

    res.status(201).send({
      message: "Weekly plan berhasil dibuat",
      data: populated
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update weekly plan (Admin only)
const updateWeeklyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await WeeklyPlanModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('userID', 'nama no_hp email')
     .populate('createdBy', 'email');

    if (!updated) {
      return res.status(404).send({ message: "Weekly plan tidak ditemukan" });
    }

    res.status(200).send({
      message: "Weekly plan berhasil diupdate",
      data: updated
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete weekly plan (Admin only)
const deleteWeeklyPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await WeeklyPlanModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).send({ message: "Weekly plan tidak ditemukan" });
    }

    res.status(200).send({
      message: "Weekly plan berhasil dihapus",
      deletedPlan: deleted.namaPasien
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get current week plan for user
const getCurrentWeekPlan = async (req, res) => {
  try {
    const { data } = dataToken(req, res);
    const userId = data._id;

    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();

    const plan = await WeeklyPlanModel.findOne({
      userID: userId,
      mingguKe: currentWeek,
      tahun: currentYear,
      status: "aktif"
    }).populate('createdBy', 'email');

    res.status(200).send(plan);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Helper function to get week number
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Generate default weekly plan based on user's calorie needs
const generateDefaultPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User tidak ditemukan" });
    }

    const dailyCalories = user.kaloriYgDibutuhkan || 2000;
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    
    const defaultPlan = days.map(hari => ({
      hari,
      targetKalori: dailyCalories,
      targetKarbohidrat: dailyCalories * 0.6 / 4, // 60% dari kalori = karbohidrat
      targetProtein: dailyCalories * 0.15 / 4,    // 15% dari kalori = protein  
      targetLemak: dailyCalories * 0.25 / 9,      // 25% dari kalori = lemak
      catatan: `Target kalori harian untuk ${hari}`
    }));

    res.status(200).send({
      message: "Default plan generated",
      user: {
        nama: user.nama,
        kaloriYgDibutuhkan: dailyCalories
      },
      planHarian: defaultPlan
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllWeeklyPlans,
  getWeeklyPlanByUser,
  createWeeklyPlan,
  updateWeeklyPlan,
  deleteWeeklyPlan,
  getCurrentWeekPlan,
  generateDefaultPlan
};
