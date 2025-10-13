const WeeklyPlanModel = require("../models/weeklyPlan.model");
const UserModel = require("../models/users.model");
const AdminModel = require("../models/admin.model");
const DBconnection = require("../config/index");
require('dotenv').config({ path: "./.env" });
const { MONGODB_URI } = process.env;

// Sample patients with different medical conditions
const patientData = [
    {
        nama: "Ahmad Diabetes",
        jeniskelamin: "laki-laki",
        tinggi: 170,
        berat: 80,
        umur: 45,
        no_hp: "081111111111",
        password: "$2b$10$laIC.6tgbru4Kmp3NaygZe2H6q05YRJXmG313LjDnUr0eY9BpWOcS", // user123
        kondisiMedis: "Diabetes Mellitus Type 2",
        kaloriYgDibutuhkan: 1800,
        aktivitasFisik: { keterangan: "aktivitas rendah", nilai: 1.2 },
        gizi: { karbohidrat: 900, protein: 270, lemak: 200 }
    },
    {
        nama: "Siti Hipertensi",
        jeniskelamin: "perempuan", 
        tinggi: 160,
        berat: 65,
        umur: 50,
        no_hp: "081222222222",
        password: "$2b$10$laIC.6tgbru4Kmp3NaygZe2H6q05YRJXmG313LjDnUr0eY9BpWOcS",
        kondisiMedis: "Hipertensi",
        kaloriYgDibutuhkan: 1600,
        aktivitasFisik: { keterangan: "aktivitas rendah", nilai: 1.2 },
        gizi: { karbohidrat: 800, protein: 240, lemak: 178 }
    },
    {
        nama: "Budi Post Surgery",
        jeniskelamin: "laki-laki",
        tinggi: 175,
        berat: 70,
        umur: 35,
        no_hp: "081333333333", 
        password: "$2b$10$laIC.6tgbru4Kmp3NaygZe2H6q05YRJXmG313LjDnUr0eY9BpWOcS",
        kondisiMedis: "Post Appendectomy",
        kaloriYgDibutuhkan: 2200,
        aktivitasFisik: { keterangan: "aktivitas sedang", nilai: 1.3 },
        gizi: { karbohidrat: 1100, protein: 330, lemak: 244 }
    },
    {
        nama: "Maya Jantung",
        jeniskelamin: "perempuan",
        tinggi: 155,
        berat: 55,
        umur: 60,
        no_hp: "081444444444",
        password: "$2b$10$laIC.6tgbru4Kmp3NaygZe2H6q05YRJXmG313LjDnUr0eY9BpWOcS",
        kondisiMedis: "Penyakit Jantung Koroner",
        kaloriYgDibutuhkan: 1500,
        aktivitasFisik: { keterangan: "aktivitas rendah", nilai: 1.2 },
        gizi: { karbohidrat: 750, protein: 225, lemak: 167 }
    },
    {
        nama: "Andi Ginjal",
        jeniskelamin: "laki-laki",
        tinggi: 168,
        berat: 75,
        umur: 40,
        no_hp: "081555555555",
        password: "$2b$10$laIC.6tgbru4Kmp3NaygZe2H6q05YRJXmG313LjDnUr0eY9BpWOcS",
        kondisiMedis: "Gagal Ginjal Kronik",
        kaloriYgDibutuhkan: 2000,
        aktivitasFisik: { keterangan: "aktivitas sedang", nilai: 1.3 },
        gizi: { karbohidrat: 1000, protein: 200, lemak: 222 } // Protein rendah untuk ginjal
    }
];

// Disease-specific weekly diet plans
const getDietPlanByDisease = (kondisiMedis, baseCalories) => {
    const plans = {
        "Diabetes Mellitus Type 2": {
            description: "Diet rendah gula, tinggi serat, kontrol karbohidrat",
            weeklyPlan: [
                { hari: "Senin", kalori: baseCalories, karbo: baseCalories * 0.45 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.35 / 9, catatan: "Hindari gula sederhana, fokus karbohidrat kompleks" },
                { hari: "Selasa", kalori: baseCalories, karbo: baseCalories * 0.45 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.35 / 9, catatan: "Tambah sayuran hijau, protein tanpa lemak" },
                { hari: "Rabu", kalori: baseCalories, karbo: baseCalories * 0.40 / 4, protein: baseCalories * 0.25 / 4, lemak: baseCalories * 0.35 / 9, catatan: "Kurangi karbo, tingkatkan protein" },
                { hari: "Kamis", kalori: baseCalories, karbo: baseCalories * 0.45 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.35 / 9, catatan: "Monitor gula darah, makan teratur" },
                { hari: "Jumat", kalori: baseCalories, karbo: baseCalories * 0.45 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.35 / 9, catatan: "Olahraga ringan setelah makan" },
                { hari: "Sabtu", kalori: baseCalories * 0.9, karbo: baseCalories * 0.40 / 4, protein: baseCalories * 0.25 / 4, lemak: baseCalories * 0.35 / 9, catatan: "Hari istirahat, kalori sedikit dikurangi" },
                { hari: "Minggu", kalori: baseCalories, karbo: baseCalories * 0.45 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.35 / 9, catatan: "Persiapan minggu depan, cek gula darah" }
            ]
        },
        "Hipertensi": {
            description: "Diet rendah garam, DASH diet, tinggi kalium",
            weeklyPlan: [
                { hari: "Senin", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.18 / 4, lemak: baseCalories * 0.27 / 9, catatan: "Rendah garam (<2g/hari), tinggi kalium" },
                { hari: "Selasa", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.18 / 4, lemak: baseCalories * 0.27 / 9, catatan: "Banyak buah dan sayur, hindari makanan olahan" },
                { hari: "Rabu", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.18 / 4, lemak: baseCalories * 0.27 / 9, catatan: "Ikan tinggi omega-3, kacang-kacangan" },
                { hari: "Kamis", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.18 / 4, lemak: baseCalories * 0.27 / 9, catatan: "Monitor tekanan darah, minum air cukup" },
                { hari: "Jumat", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.18 / 4, lemak: baseCalories * 0.27 / 9, catatan: "Olahraga ringan 30 menit" },
                { hari: "Sabtu", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.18 / 4, lemak: baseCalories * 0.27 / 9, catatan: "Relaksasi, hindari stress" },
                { hari: "Minggu", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.18 / 4, lemak: baseCalories * 0.27 / 9, catatan: "Evaluasi mingguan, cek tensi" }
            ]
        },
        "Post Appendectomy": {
            description: "Diet bertahap pasca operasi, protein tinggi untuk penyembuhan",
            weeklyPlan: [
                { hari: "Senin", kalori: baseCalories * 0.7, karbo: baseCalories * 0.50 / 4, protein: baseCalories * 0.25 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Liquid diet, sedikit demi sedikit" },
                { hari: "Selasa", kalori: baseCalories * 0.8, karbo: baseCalories * 0.50 / 4, protein: baseCalories * 0.25 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Soft food, protein tinggi untuk healing" },
                { hari: "Rabu", kalori: baseCalories * 0.9, karbo: baseCalories * 0.50 / 4, protein: baseCalories * 0.25 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Diet lunak, hindari makanan keras" },
                { hari: "Kamis", kalori: baseCalories, karbo: baseCalories * 0.50 / 4, protein: baseCalories * 0.25 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Diet normal bertahap, monitor luka" },
                { hari: "Jumat", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Aktivitas ringan, jalan-jalan" },
                { hari: "Sabtu", kalori: baseCalories * 1.1, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Recovery optimal, tingkatkan kalori" },
                { hari: "Minggu", kalori: baseCalories * 1.1, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Persiapan pulang, diet normal" }
            ]
        },
        "Penyakit Jantung Koroner": {
            description: "Diet jantung sehat, rendah lemak jenuh, tinggi omega-3",
            weeklyPlan: [
                { hari: "Senin", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Rendah lemak jenuh, omega-3 tinggi" },
                { hari: "Selasa", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Ikan salmon, alpukat, kacang-kacangan" },
                { hari: "Rabu", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Oatmeal, buah berry, sayuran hijau" },
                { hari: "Kamis", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Hindari gorengan, monitor kolesterol" },
                { hari: "Jumat", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Cardio ringan, jalan kaki" },
                { hari: "Sabtu", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Relaksasi, hindari stress" },
                { hari: "Minggu", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Evaluasi mingguan, cek jantung" }
            ]
        },
        "Gagal Ginjal Kronik": {
            description: "Diet rendah protein, kontrol fosfor dan kalium",
            weeklyPlan: [
                { hari: "Senin", kalori: baseCalories, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.10 / 4, lemak: baseCalories * 0.30 / 9, catatan: "Protein rendah (0.6g/kg BB), batasi kalium" },
                { hari: "Selasa", kalori: baseCalories, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.10 / 4, lemak: baseCalories * 0.30 / 9, catatan: "Hindari buah tinggi kalium, monitor cairan" },
                { hari: "Rabu", kalori: baseCalories, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.10 / 4, lemak: baseCalories * 0.30 / 9, catatan: "Protein berkualitas tinggi, batasi fosfor" },
                { hari: "Kamis", kalori: baseCalories, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.10 / 4, lemak: baseCalories * 0.30 / 9, catatan: "Cek fungsi ginjal, balance elektrolit" },
                { hari: "Jumat", kalori: baseCalories, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.10 / 4, lemak: baseCalories * 0.30 / 9, catatan: "Aktivitas ringan, jaga hidrasi" },
                { hari: "Sabtu", kalori: baseCalories, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.10 / 4, lemak: baseCalories * 0.30 / 9, catatan: "Monitor urine output" },
                { hari: "Minggu", kalori: baseCalories, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.10 / 4, lemak: baseCalories * 0.30 / 9, catatan: "Evaluasi lab ginjal mingguan" }
            ]
        },
        "Gastritis": {
            description: "Diet lunak, hindari makanan pedas dan asam",
            weeklyPlan: [
                { hari: "Senin", kalori: baseCalories * 0.9, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.15 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Makanan lunak, hindari pedas dan asam" },
                { hari: "Selasa", kalori: baseCalories * 0.9, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.15 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Makan sedikit tapi sering (6x sehari)" },
                { hari: "Rabu", kalori: baseCalories, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.15 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Bubur, sup, makanan berkuah" },
                { hari: "Kamis", kalori: baseCalories, karbo: baseCalories * 0.60 / 4, protein: baseCalories * 0.15 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Hindari kopi, alkohol, rokok" },
                { hari: "Jumat", kalori: baseCalories, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Mulai makanan semi-padat" },
                { hari: "Sabtu", kalori: baseCalories * 1.1, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Tingkatkan porsi jika tidak nyeri" },
                { hari: "Minggu", kalori: baseCalories * 1.1, karbo: baseCalories * 0.55 / 4, protein: baseCalories * 0.20 / 4, lemak: baseCalories * 0.25 / 9, catatan: "Evaluasi toleransi makanan" }
            ]
        }
    };
    
    return plans[kondisiMedis] || plans["Diabetes Mellitus Type 2"]; // Default fallback
};

async function createWeeklyPlanSeeder() {
    try {
        await DBconnection(MONGODB_URI);
        console.log('🔌 Connected to MongoDB');
        
        // Get admin for createdBy
        const admin = await AdminModel.findOne();
        if (!admin) {
            console.log('❌ No admin found. Please run admin seeder first.');
            return;
        }

        console.log('👥 Creating hospital patients with medical conditions...');
        
        // Create patients if they don't exist
        for (let patientInfo of patientData) {
            const existingPatient = await UserModel.findOne({ no_hp: patientInfo.no_hp });
            
            if (!existingPatient) {
                const patient = new UserModel(patientInfo);
                const savedPatient = await patient.save();
                console.log(`✅ Created patient: ${savedPatient.nama} (${savedPatient.kondisiMedis})`);
                
                // Create weekly plan for this patient
                await createWeeklyPlanForPatient(savedPatient, admin._id);
            } else {
                console.log(`📋 Patient exists: ${existingPatient.nama}`);
                // Still create weekly plan if doesn't exist
                await createWeeklyPlanForPatient(existingPatient, admin._id);
            }
        }
        
        console.log('\n🏥 Hospital Weekly Diet Plans Summary:');
        const allPlans = await WeeklyPlanModel.find().populate('userID', 'nama kondisiMedis');
        allPlans.forEach(plan => {
            console.log(`   👤 ${plan.namaPasien} - ${plan.userID?.kondisiMedis || 'Unknown condition'}`);
        });
        
    } catch (error) {
        console.error('❌ Weekly plan seeder failed:', error);
    } finally {
        process.exit(0);
    }
}

async function createWeeklyPlanForPatient(patient, adminId) {
    try {
        const currentDate = new Date();
        const currentWeek = getWeekNumber(currentDate);
        const currentYear = currentDate.getFullYear();
        
        // Check if plan already exists
        const existingPlan = await WeeklyPlanModel.findOne({
            userID: patient._id,
            mingguKe: currentWeek,
            tahun: currentYear
        });
        
        if (existingPlan) {
            console.log(`   📅 Weekly plan already exists for ${patient.nama}`);
            return;
        }
        
        const dietPlan = getDietPlanByDisease(patient.kondisiMedis, patient.kaloriYgDibutuhkan);
        
        // Calculate week start and end dates
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
        
        const weeklyPlan = new WeeklyPlanModel({
            userID: patient._id,
            namaPasien: patient.nama,
            mingguKe: currentWeek,
            tahun: currentYear,
            tanggalMulai: startOfWeek,
            tanggalSelesai: endOfWeek,
            planHarian: dietPlan.weeklyPlan.map(day => ({
                hari: day.hari,
                targetKalori: Math.round(day.kalori),
                targetKarbohidrat: Math.round(day.karbo),
                targetProtein: Math.round(day.protein),
                targetLemak: Math.round(day.lemak),
                catatan: day.catatan
            })),
            status: "aktif",
            createdBy: adminId,
            catatan: `Diet plan untuk pasien ${patient.kondisiMedis}. ${dietPlan.description}`
        });
        
        await weeklyPlan.save();
        console.log(`   ✅ Created weekly plan: ${patient.nama} - ${patient.kondisiMedis}`);
        
    } catch (error) {
        console.error(`❌ Error creating plan for ${patient.nama}:`, error.message);
    }
}

// Helper function to get week number
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

createWeeklyPlanSeeder();
