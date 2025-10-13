const DiseaseTemplateModel = require("../models/diseaseTemplate.model");
const AdminModel = require("../models/admin.model");
const DBconnection = require("../config/index");
require('dotenv').config({ path: "./.env" });
const { MONGODB_URI } = process.env;

// Medical-based disease templates with evidence-based nutrition
const diseaseTemplatesData = [
    {
        namaPenyakit: "Diabetes Mellitus Type 2",
        kodeICD: "E11.9",
        deskripsi: "Diet untuk kontrol gula darah dengan pembatasan karbohidrat sederhana dan peningkatan serat",
        kategoriPenyakit: "Metabolik",
        tingkatKeparahan: "Sedang",
        panduanUmum: "Diet rendah indeks glikemik, tinggi serat, kontrol porsi karbohidrat. Makan teratur 3x sehari + 2x snack. Monitor gula darah sebelum dan sesudah makan.",
        kontraindikasiMakanan: ["Gula pasir", "Permen", "Minuman manis", "Kue manis", "Nasi putih berlebihan", "Roti putih"],
        suplemen: [
            { nama: "Chromium", dosis: "200 mcg", waktu: "Sebelum makan" },
            { nama: "Alpha Lipoic Acid", dosis: "300 mg", waktu: "2x sehari" }
        ],
        monitoringParameter: [
            { parameter: "Gula Darah Puasa", targetValue: "80-130 mg/dL", frequency: "Harian" },
            { parameter: "HbA1c", targetValue: "<7%", frequency: "3 bulan" },
            { parameter: "Berat Badan", targetValue: "BMI 18.5-24.9", frequency: "Mingguan" }
        ],
        templateMingguan: [
            { hari: "Senin", kaloriPerKg: 25, persentaseKarbohidrat: 45, persentaseProtein: 20, persentaseLemak: 35, catatanMedis: "Mulai minggu dengan karbohidrat kompleks, hindari gula sederhana", pantanganMakanan: ["Gula pasir", "Minuman manis"], rekomendasiMakanan: ["Oatmeal", "Sayuran hijau", "Ikan"] },
            { hari: "Selasa", kaloriPerKg: 25, persentaseKarbohidrat: 45, persentaseProtein: 20, persentaseLemak: 35, catatanMedis: "Tingkatkan sayuran berserat tinggi, protein tanpa lemak", pantanganMakanan: ["Nasi putih berlebihan"], rekomendasiMakanan: ["Brokoli", "Ayam tanpa kulit", "Kacang almond"] },
            { hari: "Rabu", kaloriPerKg: 24, persentaseKarbohidrat: 40, persentaseProtein: 25, persentaseLemak: 35, catatanMedis: "Mid-week: kurangi karbo, tingkatkan protein untuk stabilitas gula", pantanganMakanan: ["Kue manis", "Biskuit"], rekomendasiMakanan: ["Tempe", "Tahu", "Sayur bayam"] },
            { hari: "Kamis", kaloriPerKg: 25, persentaseKarbohidrat: 45, persentaseProtein: 20, persentaseLemak: 35, catatanMedis: "Monitor gula darah, makan teratur setiap 3 jam", pantanganMakanan: ["Permen"], rekomendasiMakanan: ["Quinoa", "Salmon", "Alpukat"] },
            { hari: "Jumat", kaloriPerKg: 25, persentaseKarbohidrat: 45, persentaseProtein: 20, persentaseLemak: 35, catatanMedis: "Persiapan weekend: tetap disiplin diet, olahraga ringan", pantanganMakanan: ["Fast food"], rekomendasiMakanan: ["Ubi jalar", "Dada ayam", "Kacang hijau"] },
            { hari: "Sabtu", kaloriPerKg: 23, persentaseKarbohidrat: 40, persentaseProtein: 25, persentaseLemak: 35, catatanMedis: "Weekend: kalori sedikit dikurangi, aktivitas fisik ringan", pantanganMakanan: ["Gorengan"], rekomendasiMakanan: ["Salad", "Ikan bakar", "Buah rendah gula"] },
            { hari: "Minggu", kaloriPerKg: 25, persentaseKarbohidrat: 45, persentaseProtein: 20, persentaseLemak: 35, catatanMedis: "Evaluasi mingguan: cek gula darah, persiapan minggu depan", pantanganMakanan: ["Dessert manis"], rekomendasiMakanan: ["Brown rice", "Lentil", "Sayur kukus"] }
        ]
    },
    {
        namaPenyakit: "Hipertensi",
        kodeICD: "I10",
        deskripsi: "Diet DASH (Dietary Approaches to Stop Hypertension) dengan pembatasan natrium dan peningkatan kalium",
        kategoriPenyakit: "Kardiovaskular",
        tingkatKeparahan: "Sedang",
        panduanUmum: "Diet rendah garam (<2g/hari), tinggi kalium, magnesium, dan kalsium. Batasi makanan olahan, tingkatkan buah dan sayuran segar.",
        kontraindikasiMakanan: ["Garam berlebihan", "Makanan kaleng", "Fast food", "Keripik asin", "Acar", "Ikan asin"],
        suplemen: [
            { nama: "Magnesium", dosis: "400 mg", waktu: "Malam hari" },
            { nama: "Kalium", dosis: "99 mg", waktu: "Dengan makanan" }
        ],
        monitoringParameter: [
            { parameter: "Tekanan Darah", targetValue: "<140/90 mmHg", frequency: "Harian" },
            { parameter: "Natrium Urine", targetValue: "<100 mEq/24h", frequency: "Bulanan" },
            { parameter: "Berat Badan", targetValue: "BMI <25", frequency: "Mingguan" }
        ],
        templateMingguan: [
            { hari: "Senin", kaloriPerKg: 25, persentaseKarbohidrat: 55, persentaseProtein: 18, persentaseLemak: 27, catatanMedis: "Mulai DASH diet: rendah garam, tinggi kalium dari buah", pantanganMakanan: ["Garam meja", "Keripik"], rekomendasiMakanan: ["Pisang", "Bayam", "Yogurt rendah lemak"] },
            { hari: "Selasa", kaloriPerKg: 25, persentaseKarbohidrat: 55, persentaseProtein: 18, persentaseLemak: 27, catatanMedis: "Fokus sayuran hijau dan buah-buahan segar", pantanganMakanan: ["Makanan kaleng"], rekomendasiMakanan: ["Brokoli", "Jeruk", "Kacang merah"] },
            { hari: "Rabu", kaloriPerKg: 25, persentaseKarbohidrat: 55, persentaseProtein: 18, persentaseLemak: 27, catatanMedis: "Ikan tinggi omega-3 untuk kesehatan jantung", pantanganMakanan: ["Ikan asin"], rekomendasiMakanan: ["Salmon", "Tuna", "Kacang almond"] },
            { hari: "Kamis", kaloriPerKg: 25, persentaseKarbohidrat: 55, persentaseProtein: 18, persentaseLemak: 27, catatanMedis: "Monitor tekanan darah, minum air putih 8 gelas", pantanganMakanan: ["Minuman bersoda"], rekomendasiMakanan: ["Air kelapa", "Semangka", "Mentimun"] },
            { hari: "Jumat", kaloriPerKg: 25, persentaseKarbohidrat: 55, persentaseProtein: 18, persentaseLemak: 27, catatanMedis: "Olahraga ringan 30 menit, jalan kaki", pantanganMakanan: ["Fast food"], rekomendasiMakanan: ["Oatmeal", "Blueberry", "Walnut"] },
            { hari: "Sabtu", kaloriPerKg: 24, persentaseKarbohidrat: 55, persentaseProtein: 18, persentaseLemak: 27, catatanMedis: "Weekend relaksasi: hindari stress, meditasi", pantanganMakanan: ["Alkohol"], rekomendasiMakanan: ["Teh herbal", "Dark chocolate 70%", "Avocado"] },
            { hari: "Minggu", kaloriPerKg: 25, persentaseKarbohidrat: 55, persentaseProtein: 18, persentaseLemak: 27, catatanMedis: "Evaluasi mingguan: cek tekanan darah, planning menu", pantanganMakanan: ["Acar"], rekomendasiMakanan: ["Buah segar", "Sayur kukus", "Lean meat"] }
        ]
    },
    {
        namaPenyakit: "Post Appendectomy",
        kodeICD: "K37",
        deskripsi: "Diet progresif pasca operasi appendektomi dengan peningkatan bertahap dari liquid ke solid food",
        kategoriPenyakit: "Post-Operasi",
        tingkatKeparahan: "Sedang",
        panduanUmum: "Diet bertahap: liquid → soft → regular. Protein tinggi untuk penyembuhan luka, hindari makanan yang menyebabkan gas. Monitor toleransi makanan.",
        kontraindikasiMakanan: ["Makanan pedas", "Makanan bergas", "Makanan keras", "Serat kasar", "Kacang-kacangan awal"],
        suplemen: [
            { nama: "Vitamin C", dosis: "1000 mg", waktu: "2x sehari" },
            { nama: "Zinc", dosis: "15 mg", waktu: "Dengan makanan" },
            { nama: "Protein powder", dosis: "20g", waktu: "Post meal" }
        ],
        monitoringParameter: [
            { parameter: "Luka operasi", targetValue: "Tidak ada infeksi", frequency: "Harian" },
            { parameter: "Toleransi makanan", targetValue: "Tidak mual/muntah", frequency: "Setiap makan" },
            { parameter: "Berat Badan", targetValue: "Tidak turun >5%", frequency: "Harian" }
        ],
        templateMingguan: [
            { hari: "Senin", kaloriPerKg: 20, persentaseKarbohidrat: 50, persentaseProtein: 30, persentaseLemak: 20, catatanMedis: "Hari 1-2: Clear liquid diet, sedikit demi sedikit", pantanganMakanan: ["Makanan padat"], rekomendasiMakanan: ["Air putih", "Kaldu jernih", "Teh tanpa gula"] },
            { hari: "Selasa", kaloriPerKg: 22, persentaseKarbohidrat: 50, persentaseProtein: 30, persentaseLemak: 20, catatanMedis: "Hari 2-3: Full liquid diet, protein shake", pantanganMakanan: ["Serat kasar"], rekomendasiMakanan: ["Susu", "Protein shake", "Jus tanpa pulp"] },
            { hari: "Rabu", kaloriPerKg: 24, persentaseKarbohidrat: 50, persentaseProtein: 25, persentaseLemak: 25, catatanMedis: "Hari 3-4: Soft diet, makanan lunak mudah dicerna", pantanganMakanan: ["Makanan keras"], rekomendasiMakanan: ["Bubur", "Telur rebus", "Pisang"] },
            { hari: "Kamis", kaloriPerKg: 26, persentaseKarbohidrat: 50, persentaseProtein: 25, persentaseLemak: 25, catatanMedis: "Hari 4-5: Semi-solid diet, monitor toleransi", pantanganMakanan: ["Gorengan"], rekomendasiMakanan: ["Nasi tim", "Ikan kukus", "Sayur rebus"] },
            { hari: "Jumat", kaloriPerKg: 28, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Hari 5-6: Regular diet bertahap, aktivitas ringan", pantanganMakanan: ["Makanan pedas"], rekomendasiMakanan: ["Nasi putih", "Ayam rebus", "Wortel"] },
            { hari: "Sabtu", kaloriPerKg: 30, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Hari 6-7: Diet normal, tingkatkan kalori untuk recovery", pantanganMakanan: ["Alkohol"], rekomendasiMakanan: ["Diet seimbang", "Buah segar", "Protein lean"] },
            { hari: "Minggu", kaloriPerKg: 30, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Minggu 1: Persiapan pulang, diet normal maintenance", pantanganMakanan: ["Junk food"], rekomendasiMakanan: ["Menu rumah sehat", "Multivitamin", "Air putih 2L"] }
        ]
    },
    {
        namaPenyakit: "Penyakit Jantung Koroner",
        kodeICD: "I25.9",
        deskripsi: "Diet jantung sehat dengan pembatasan lemak jenuh, kolesterol, dan natrium",
        kategoriPenyakit: "Kardiovaskular",
        tingkatKeparahan: "Berat",
        panduanUmum: "Diet rendah lemak jenuh (<7% total kalori), kolesterol <200mg/hari, natrium <2g/hari. Tinggi omega-3, antioksidan, dan serat larut.",
        kontraindikasiMakanan: ["Daging berlemak", "Kuning telur berlebihan", "Santan", "Mentega", "Gorengan", "Jeroan"],
        suplemen: [
            { nama: "Omega-3", dosis: "1000 mg", waktu: "Dengan makan malam" },
            { nama: "CoQ10", dosis: "100 mg", waktu: "Pagi hari" },
            { nama: "Magnesium", dosis: "400 mg", waktu: "Malam hari" }
        ],
        monitoringParameter: [
            { parameter: "Kolesterol Total", targetValue: "<200 mg/dL", frequency: "Bulanan" },
            { parameter: "LDL", targetValue: "<100 mg/dL", frequency: "Bulanan" },
            { parameter: "Tekanan Darah", targetValue: "<130/80 mmHg", frequency: "Harian" }
        ],
        templateMingguan: [
            { hari: "Senin", kaloriPerKg: 22, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Fokus omega-3: ikan berlemak, hindari lemak jenuh", pantanganMakanan: ["Daging sapi berlemak"], rekomendasiMakanan: ["Salmon", "Oatmeal", "Blueberry"] },
            { hari: "Selasa", kaloriPerKg: 22, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Antioksidan tinggi: berry, sayuran warna-warni", pantanganMakanan: ["Jeroan"], rekomendasiMakanan: ["Strawberry", "Brokoli", "Kacang walnut"] },
            { hari: "Rabu", kaloriPerKg: 22, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Serat larut untuk turunkan kolesterol", pantanganMakanan: ["Santan"], rekomendasiMakanan: ["Apel", "Barley", "Kacang hitam"] },
            { hari: "Kamis", kaloriPerKg: 22, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Monitor jantung: hindari stress, relaksasi", pantanganMakanan: ["Kafein berlebihan"], rekomendasiMakanan: ["Teh hijau", "Dark chocolate 70%", "Almond"] },
            { hari: "Jumat", kaloriPerKg: 22, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Cardio ringan 20 menit, diet konsisten", pantanganMakanan: ["Mentega"], rekomendasiMakanan: ["Olive oil", "Avocado", "Tuna"] },
            { hari: "Sabtu", kaloriPerKg: 21, persentaseKarbohidrat: 60, persentaseProtein: 18, persentaseLemak: 22, catatanMedis: "Weekend: relaksasi, hindari makanan comfort food", pantanganMakanan: ["Pizza", "Burger"], rekomendasiMakanan: ["Salad Mediterranean", "Grilled fish", "Quinoa"] },
            { hari: "Minggu", kaloriPerKg: 22, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Evaluasi: cek kolesterol, planning menu sehat", pantanganMakanan: ["Kuning telur >2/minggu"], rekomendasiMakanan: ["Putih telur", "Ikan sardine", "Sayur hijau"] }
        ]
    },
    {
        namaPenyakit: "Gagal Ginjal Kronik",
        kodeICD: "N18.9",
        deskripsi: "Diet rendah protein, fosfor, dan kalium dengan kontrol cairan untuk mencegah progresivitas penyakit",
        kategoriPenyakit: "Ginjal",
        tingkatKeparahan: "Berat",
        panduanUmum: "Protein 0.6-0.8g/kg BB, fosfor <800mg/hari, kalium <2g/hari. Batasi cairan sesuai output urine. Kalori adequate untuk mencegah malnutrisi.",
        kontraindikasiMakanan: ["Daging merah berlebihan", "Kacang-kacangan", "Coklat", "Pisang", "Jeruk", "Tomat"],
        suplemen: [
            { nama: "Kalsium karbonat", dosis: "500 mg", waktu: "Dengan makanan" },
            { nama: "Vitamin D", dosis: "0.25 mcg", waktu: "Pagi hari" },
            { nama: "Asam folat", dosis: "5 mg", waktu: "Pagi hari" }
        ],
        monitoringParameter: [
            { parameter: "Kreatinin", targetValue: "Stabil", frequency: "Mingguan" },
            { parameter: "Kalium", targetValue: "3.5-5.0 mEq/L", frequency: "Mingguan" },
            { parameter: "Fosfor", targetValue: "2.5-4.5 mg/dL", frequency: "Mingguan" }
        ],
        templateMingguan: [
            { hari: "Senin", kaloriPerKg: 30, persentaseKarbohidrat: 60, persentaseProtein: 10, persentaseLemak: 30, catatanMedis: "Protein rendah berkualitas tinggi, batasi kalium", pantanganMakanan: ["Pisang", "Jeruk"], rekomendasiMakanan: ["Nasi putih", "Putih telur", "Minyak zaitun"] },
            { hari: "Selasa", kaloriPerKg: 30, persentaseKarbohidrat: 60, persentaseProtein: 10, persentaseLemak: 30, catatanMedis: "Hindari buah tinggi kalium, monitor cairan", pantanganMakanan: ["Tomat", "Kentang"], rekomendasiMakanan: ["Apel", "Pear", "Ikan putih sedikit"] },
            { hari: "Rabu", kaloriPerKg: 30, persentaseKarbohidrat: 60, persentaseProtein: 10, persentaseLemak: 30, catatanMedis: "Protein berkualitas tinggi dalam jumlah terbatas", pantanganMakanan: ["Kacang merah"], rekomendasiMakanan: ["Dada ayam 50g", "Nasi", "Timun"] },
            { hari: "Kamis", kaloriPerKg: 30, persentaseKarbohidrat: 60, persentaseProtein: 10, persentaseLemak: 30, catatanMedis: "Cek fungsi ginjal, balance elektrolit", pantanganMakanan: ["Coklat"], rekomendasiMakanan: ["Gula aren", "Agar-agar", "Biskuit tawar"] },
            { hari: "Jumat", kaloriPerKg: 30, persentaseKarbohidrat: 60, persentaseProtein: 10, persentaseLemak: 30, catatanMedis: "Aktivitas ringan sesuai toleransi", pantanganMakanan: ["Susu berlebihan"], rekomendasiMakanan: ["Santan sedikit", "Tepung beras", "Madu"] },
            { hari: "Sabtu", kaloriPerKg: 30, persentaseKarbohidrat: 60, persentaseProtein: 10, persentaseLemak: 30, catatanMedis: "Monitor output urine, seimbangkan cairan", pantanganMakanan: ["Garam berlebihan"], rekomendasiMakanan: ["Air putih terbatas", "Permen keras", "Mie beras"] },
            { hari: "Minggu", kaloriPerKg: 30, persentaseKarbohidrat: 60, persentaseProtein: 10, persentaseLemak: 30, catatanMedis: "Evaluasi lab ginjal mingguan, konsultasi dokter", pantanganMakanan: ["Suplemen protein"], rekomendasiMakanan: ["Diet sesuai lab", "Kontrol ketat", "Follow up"] }
        ]
    },
    {
        namaPenyakit: "Gastritis Akut",
        kodeICD: "K29.0",
        deskripsi: "Diet lunak untuk meredakan inflamasi lambung dengan menghindari makanan iritatif",
        kategoriPenyakit: "Pencernaan",
        tingkatKeparahan: "Ringan",
        panduanUmum: "Diet lunak, hindari makanan pedas, asam, dan iritatif. Makan sedikit tapi sering (6x sehari). Suhu makanan tidak terlalu panas atau dingin.",
        kontraindikasiMakanan: ["Makanan pedas", "Makanan asam", "Kopi", "Alkohol", "Coklat", "Tomat"],
        suplemen: [
            { nama: "Probiotik", dosis: "1 kapsul", waktu: "Setelah makan" },
            { nama: "Vitamin B12", dosis: "100 mcg", waktu: "Pagi hari" }
        ],
        monitoringParameter: [
            { parameter: "Nyeri lambung", targetValue: "Skala <3/10", frequency: "Harian" },
            { parameter: "Toleransi makanan", targetValue: "Tidak mual", frequency: "Setiap makan" }
        ],
        templateMingguan: [
            { hari: "Senin", kaloriPerKg: 20, persentaseKarbohidrat: 65, persentaseProtein: 15, persentaseLemak: 20, catatanMedis: "Mulai diet lunak, hindari iritatif lambung", pantanganMakanan: ["Cabai", "Jeruk"], rekomendasiMakanan: ["Bubur", "Biskuit", "Teh chamomile"] },
            { hari: "Selasa", kaloriPerKg: 22, persentaseKarbohidrat: 65, persentaseProtein: 15, persentaseLemak: 20, catatanMedis: "Makan sedikit tapi sering, 6x sehari", pantanganMakanan: ["Kopi", "Soda"], rekomendasiMakanan: ["Roti tawar", "Sup ayam", "Pisang"] },
            { hari: "Rabu", kaloriPerKg: 24, persentaseKarbohidrat: 60, persentaseProtein: 20, persentaseLemak: 20, catatanMedis: "Tingkatkan protein secara bertahap", pantanganMakanan: ["Makanan berlemak"], rekomendasiMakanan: ["Telur rebus", "Ikan kukus", "Kentang rebus"] },
            { hari: "Kamis", kaloriPerKg: 25, persentaseKarbohidrat: 60, persentaseProtein: 20, persentaseLemak: 20, catatanMedis: "Monitor gejala, lanjutkan diet lunak", pantanganMakanan: ["Alkohol"], rekomendasiMakanan: ["Nasi tim", "Ayam rebus", "Wortel kukus"] },
            { hari: "Jumat", kaloriPerKg: 26, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Mulai makanan semi-padat jika toleransi baik", pantanganMakanan: ["Makanan pedas"], rekomendasiMakanan: ["Pasta polos", "Tahu kukus", "Apel kukus"] },
            { hari: "Sabtu", kaloriPerKg: 27, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Weekend: tetap konsisten, hindari makanan trigger", pantanganMakanan: ["Fast food"], rekomendasiMakanan: ["Oatmeal", "Yogurt plain", "Pear"] },
            { hari: "Minggu", kaloriPerKg: 28, persentaseKarbohidrat: 55, persentaseProtein: 20, persentaseLemak: 25, catatanMedis: "Evaluasi toleransi, persiapan diet normal", pantanganMakanan: ["Coklat"], rekomendasiMakanan: ["Diet balanced", "Herbal tea", "Crackers"] }
        ]
    },
    {
        namaPenyakit: "Hepatitis B Kronik",
        kodeICD: "B18.1",
        deskripsi: "Diet untuk mendukung fungsi hati dengan protein adequate dan pembatasan lemak",
        kategoriPenyakit: "Pencernaan",
        tingkatKeparahan: "Sedang",
        panduanUmum: "Protein 1.2-1.5g/kg BB untuk regenerasi hepatosit, lemak sedang, hindari alkohol. Vitamin B kompleks dan antioksidan tinggi.",
        kontraindikasiMakanan: ["Alkohol", "Makanan berlemak tinggi", "Makanan olahan", "Pengawet", "Pewarna buatan"],
        suplemen: [
            { nama: "Vitamin B Complex", dosis: "1 tablet", waktu: "Pagi hari" },
            { nama: "Vitamin E", dosis: "400 IU", waktu: "Dengan makan" },
            { nama: "Silymarin", dosis: "150 mg", waktu: "3x sehari" }
        ],
        monitoringParameter: [
            { parameter: "SGOT/SGPT", targetValue: "Normal range", frequency: "Mingguan" },
            { parameter: "Bilirubin", targetValue: "<1.2 mg/dL", frequency: "Mingguan" },
            { parameter: "Albumin", targetValue: ">3.5 g/dL", frequency: "Mingguan" }
        ],
        templateMingguan: [
            { hari: "Senin", kaloriPerKg: 28, persentaseKarbohidrat: 55, persentaseProtein: 25, persentaseLemak: 20, catatanMedis: "Protein tinggi untuk regenerasi hati", pantanganMakanan: ["Alkohol"], rekomendasiMakanan: ["Ikan", "Tahu", "Sayur hijau"] },
            { hari: "Selasa", kaloriPerKg: 28, persentaseKarbohidrat: 55, persentaseProtein: 25, persentaseLemak: 20, catatanMedis: "Antioksidan dari buah dan sayur warna", pantanganMakanan: ["Makanan olahan"], rekomendasiMakanan: ["Wortel", "Bayam", "Pepaya"] },
            { hari: "Rabu", kaloriPerKg: 28, persentaseKarbohidrat: 55, persentaseProtein: 25, persentaseLemak: 20, catatanMedis: "Vitamin B kompleks dari makanan natural", pantanganMakanan: ["Pengawet"], rekomendasiMakanan: ["Tempe", "Kacang hijau", "Beras merah"] },
            { hari: "Kamis", kaloriPerKg: 28, persentaseKarbohidrat: 55, persentaseProtein: 25, persentaseLemak: 20, catatanMedis: "Monitor fungsi hati, istirahat cukup", pantanganMakanan: ["Junk food"], rekomendasiMakanan: ["Sup ayam", "Bubur kacang hijau", "Jus wortel"] },
            { hari: "Jumat", kaloriPerKg: 28, persentaseKarbohidrat: 55, persentaseProtein: 25, persentaseLemak: 20, catatanMedis: "Detox ringan: banyak air putih, sayur hijau", pantanganMakanan: ["Pewarna buatan"], rekomendasiMakanan: ["Air lemon", "Brokoli", "Protein shake"] },
            { hari: "Sabtu", kaloriPerKg: 27, persentaseKarbohidrat: 60, persentaseProtein: 22, persentaseLemak: 18, catatanMedis: "Weekend: tetap disiplin, hindari alcohol social", pantanganMakanan: ["Beer", "Wine"], rekomendasiMakanan: ["Virgin mojito", "Grilled chicken", "Steam vegetables"] },
            { hari: "Minggu", kaloriPerKg: 28, persentaseKarbohidrat: 55, persentaseProtein: 25, persentaseLemak: 20, catatanMedis: "Evaluasi lab hati, konsultasi hepatologi", pantanganMakanan: ["Suplemen berlebihan"], rekomendasiMakanan: ["Natural foods", "Herbal tea", "Fresh fruits"] }
        ]
    },
    {
        namaPenyakit: "Obesitas",
        kodeICD: "E66.9",
        deskripsi: "Diet kalori terkontrol dengan defisit 500-750 kcal/hari untuk penurunan berat badan bertahap",
        kategoriPenyakit: "Metabolik",
        tingkatKeparahan: "Sedang",
        panduanUmum: "Defisit kalori 500-750 kcal/hari, protein tinggi untuk mempertahankan massa otot, serat tinggi untuk rasa kenyang. Target penurunan 0.5-1 kg/minggu.",
        kontraindikasiMakanan: ["Makanan tinggi kalori", "Gorengan", "Fast food", "Minuman manis", "Snack kemasan"],
        suplemen: [
            { nama: "Multivitamin", dosis: "1 tablet", waktu: "Pagi hari" },
            { nama: "Chromium", dosis: "200 mcg", waktu: "Sebelum makan" },
            { nama: "Green tea extract", dosis: "500 mg", waktu: "Sebelum olahraga" }
        ],
        monitoringParameter: [
            { parameter: "Berat Badan", targetValue: "-0.5 to -1 kg/minggu", frequency: "Harian" },
            { parameter: "BMI", targetValue: "Menurun bertahap", frequency: "Mingguan" },
            { parameter: "Lingkar pinggang", targetValue: "Menurun", frequency: "Mingguan" }
        ],
        templateMingguan: [
            { hari: "Senin", kaloriPerKg: 20, persentaseKarbohidrat: 40, persentaseProtein: 30, persentaseLemak: 30, catatanMedis: "Mulai deficit kalori, protein tinggi untuk muscle preservation", pantanganMakanan: ["Nasi berlebihan"], rekomendasiMakanan: ["Dada ayam", "Sayur hijau", "Quinoa"] },
            { hari: "Selasa", kaloriPerKg: 20, persentaseKarbohidrat: 40, persentaseProtein: 30, persentaseLemak: 30, catatanMedis: "Cardio 45 menit, intermittent fasting 16:8", pantanganMakanan: ["Gorengan"], rekomendasiMakanan: ["Ikan", "Salad", "Greek yogurt"] },
            { hari: "Rabu", kaloriPerKg: 19, persentaseKarbohidrat: 35, persentaseProtein: 35, persentaseLemak: 30, catatanMedis: "Mid-week boost: kurangi karbo, tingkatkan protein", pantanganMakanan: ["Pasta"], rekomendasiMakanan: ["Telur", "Tuna", "Brokoli"] },
            { hari: "Kamis", kaloriPerKg: 20, persentaseKarbohidrat: 40, persentaseProtein: 30, persentaseLemak: 30, catatanMedis: "Weight training ringan, monitor progress", pantanganMakanan: ["Minuman manis"], rekomendasiMakanan: ["Protein shake", "Almond", "Spinach"] },
            { hari: "Jumat", kaloriPerKg: 20, persentaseKarbohidrat: 40, persentaseProtein: 30, persentaseLemak: 30, catatanMedis: "HIIT workout 30 menit, recovery nutrition", pantanganMakanan: ["Pizza"], rekomendasiMakanan: ["Lean beef", "Sweet potato", "Asparagus"] },
            { hari: "Sabtu", kaloriPerKg: 18, persentaseKarbohidrat: 35, persentaseProtein: 35, persentaseLemak: 30, catatanMedis: "Weekend challenge: kalori paling rendah", pantanganMakanan: ["Dessert"], rekomendasiMakanan: ["Salad besar", "Grilled fish", "Berries"] },
            { hari: "Minggu", kaloriPerKg: 21, persentaseKarbohidrat: 45, persentaseProtein: 25, persentaseLemak: 30, catatanMedis: "Recovery day: sedikit lebih tinggi untuk metabolism", pantanganMakanan: ["Cheat meal"], rekomendasiMakanan: ["Oatmeal", "Chicken breast", "Vegetables"] }
        ]
    }
];

async function createDiseaseTemplateSeeder() {
    try {
        await DBconnection(MONGODB_URI);
        console.log('🔌 Connected to MongoDB');
        
        // Get admin for createdBy
        const admin = await AdminModel.findOne();
        if (!admin) {
            console.log('❌ No admin found. Please run admin seeder first.');
            return;
        }

        console.log('🦠 Creating disease template library...\n');
        
        for (let templateData of diseaseTemplatesData) {
            const existingTemplate = await DiseaseTemplateModel.findOne({ 
                namaPenyakit: templateData.namaPenyakit 
            });
            
            if (!existingTemplate) {
                const template = new DiseaseTemplateModel({
                    ...templateData,
                    createdBy: admin._id
                });
                
                const saved = await template.save();
                console.log(`✅ Created template: ${saved.namaPenyakit} (${saved.kategoriPenyakit})`);
                console.log(`   📋 ICD Code: ${saved.kodeICD}`);
                console.log(`   ⚕️  Severity: ${saved.tingkatKeparahan}`);
                console.log(`   📊 Avg calories/kg: ${Math.round(saved.templateMingguan.reduce((sum, day) => sum + day.kaloriPerKg, 0) / 7)}`);
                console.log(`   💊 Supplements: ${saved.suplemen.length} items`);
                console.log(`   🚫 Contraindications: ${saved.kontraindikasiMakanan.length} items\n`);
            } else {
                console.log(`📋 Template exists: ${existingTemplate.namaPenyakit}`);
            }
        }
        
        console.log('🏥 Disease Template Library Summary:');
        const allTemplates = await DiseaseTemplateModel.find({ isActive: true });
        
        const categories = {};
        allTemplates.forEach(template => {
            if (!categories[template.kategoriPenyakit]) {
                categories[template.kategoriPenyakit] = [];
            }
            categories[template.kategoriPenyakit].push(template.namaPenyakit);
        });
        
        Object.entries(categories).forEach(([category, diseases]) => {
            console.log(`\n📋 ${category}:`);
            diseases.forEach(disease => {
                console.log(`   • ${disease}`);
            });
        });
        
        console.log('\n🎯 Template Features:');
        console.log('   ✅ Evidence-based nutrition guidelines');
        console.log('   ✅ Medical contraindications');
        console.log('   ✅ Supplement recommendations');
        console.log('   ✅ Monitoring parameters');
        console.log('   ✅ Progressive weekly plans');
        console.log('   ✅ ICD-10 coding');
        
        console.log('\n🏥 Ready for hospital use!');
        
    } catch (error) {
        console.error('❌ Disease template seeder failed:', error);
    } finally {
        process.exit(0);
    }
}

createDiseaseTemplateSeeder();
