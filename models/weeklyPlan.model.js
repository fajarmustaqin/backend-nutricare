const mongoose = require("mongoose");

const DailyPlanSchema = new mongoose.Schema({
  hari: {
    type: String,
    enum: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    required: true
  },
  targetKalori: {
    type: Number,
    required: true
  },
  targetKarbohidrat: {
    type: Number,
    required: true
  },
  targetProtein: {
    type: Number,
    required: true
  },
  targetLemak: {
    type: Number,
    required: true
  },
  catatan: {
    type: String,
    maxlength: 500
  }
}, { _id: false });

const WeeklyPlanSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  },
  namaPasien: {
    type: String,
    required: true
  },
  mingguKe: {
    type: Number,
    required: true
  },
  tahun: {
    type: Number,
    required: true
  },
  tanggalMulai: {
    type: Date,
    required: true
  },
  tanggalSelesai: {
    type: Date,
    required: true
  },
  planHarian: [DailyPlanSchema],
  status: {
    type: String,
    enum: ["aktif", "selesai", "ditunda"],
    default: "aktif"
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  catatan: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index untuk pencarian yang efisien
WeeklyPlanSchema.index({ userID: 1, mingguKe: 1, tahun: 1 });
WeeklyPlanSchema.index({ tanggalMulai: 1, tanggalSelesai: 1 });

const WeeklyPlanModel = mongoose.model("WeeklyPlan", WeeklyPlanSchema);
module.exports = WeeklyPlanModel;
