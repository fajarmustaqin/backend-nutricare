const mongoose = require("mongoose");

const DailyTemplateSchema = new mongoose.Schema({
  hari: {
    type: String,
    enum: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    required: true
  },
  kaloriPerKg: {
    type: Number,
    required: true,
    default: 25 // Default 25 kcal per kg body weight
  },
  persentaseKarbohidrat: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 55
  },
  persentaseProtein: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 15
  },
  persentaseLemak: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 30
  },
  catatanMedis: {
    type: String,
    maxlength: 500
  },
  pantanganMakanan: [{
    type: String,
    maxlength: 100
  }],
  rekomendasiMakanan: [{
    type: String,
    maxlength: 100
  }]
}, { _id: false });

const DiseaseTemplateSchema = new mongoose.Schema({
  namaPenyakit: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200
  },
  kodeICD: {
    type: String,
    maxlength: 10
  },
  deskripsi: {
    type: String,
    required: true,
    maxlength: 1000
  },
  kategoriPenyakit: {
    type: String,
    enum: ["Metabolik", "Kardiovaskular", "Ginjal", "Pencernaan", "Post-Operasi", "Lainnya"],
    required: true
  },
  tingkatKeparahan: {
    type: String,
    enum: ["Ringan", "Sedang", "Berat", "Kritis"],
    default: "Sedang"
  },
  templateMingguan: [DailyTemplateSchema],
  panduanUmum: {
    type: String,
    maxlength: 2000
  },
  kontraindikasiMakanan: [{
    type: String,
    maxlength: 100
  }],
  suplemen: [{
    nama: String,
    dosis: String,
    waktu: String
  }],
  monitoringParameter: [{
    parameter: String,
    targetValue: String,
    frequency: String
  }],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Validation: Pastikan persentase makronutrien = 100%
DiseaseTemplateSchema.pre('save', function(next) {
  this.templateMingguan.forEach(day => {
    const total = day.persentaseKarbohidrat + day.persentaseProtein + day.persentaseLemak;
    if (Math.abs(total - 100) > 1) { // Allow 1% tolerance
      return next(new Error(`Total persentase makronutrien untuk ${day.hari} harus 100% (current: ${total}%)`));
    }
  });
  next();
});

const DiseaseTemplateModel = mongoose.model("DiseaseTemplate", DiseaseTemplateSchema);
module.exports = DiseaseTemplateModel;
