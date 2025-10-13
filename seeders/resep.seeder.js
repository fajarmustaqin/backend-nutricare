const ResepModel = require("../models/resep.model");
const FoodModel = require("../models/food.model");
const DBconnection = require("../config/index");
require('dotenv').config({ path: "./.env" });
const { MONGODB_URI } = process.env;

async function createResepSeeder() {
    try {
        await DBconnection(MONGODB_URI);
        console.log('🔌 Connected to MongoDB');
        
        // Get some food IDs first
        const foods = await FoodModel.find().limit(5);
        
        if (foods.length === 0) {
            console.log('⚠️  No food data found. Please run food seeder first.');
            return;
        }
        
        const existData = await ResepModel.find();
        
        if (existData.length === 0) {
            console.log('🍳 Creating recipe data...');
            
            const resepData = [
                {
                    porsi: 4,
                    image: "https://example.com/nasi-goreng.jpg",
                    deskripsi: "Nasi goreng spesial dengan ayam dan sayuran segar",
                    bahan: [
                        "2 piring nasi putih",
                        "200g ayam potong dadu",
                        "2 butir telur",
                        "3 siung bawang putih",
                        "2 sdm kecap manis",
                        "1 sdt garam",
                        "Minyak goreng secukupnya"
                    ],
                    waktupenyajian: "20 menit",
                    idMakanan: foods[0]._id
                },
                {
                    porsi: 6,
                    image: "https://example.com/gado-gado.jpg",
                    deskripsi: "Gado-gado segar dengan bumbu kacang yang lezat",
                    bahan: [
                        "100g tahu",
                        "100g tempe",
                        "2 butir telur rebus",
                        "100g tauge",
                        "Selada secukupnya",
                        "Bumbu kacang",
                        "Kerupuk"
                    ],
                    waktupenyajian: "30 menit",
                    idMakanan: foods[1]._id
                },
                {
                    porsi: 4,
                    image: "https://example.com/soto-ayam.jpg",
                    deskripsi: "Soto ayam hangat dengan kuah yang gurih",
                    bahan: [
                        "500g ayam kampung",
                        "2 liter air",
                        "3 lembar daun jeruk",
                        "2 batang serai",
                        "Bumbu halus (bawang merah, putih, jahe)",
                        "Garam dan penyedap secukupnya"
                    ],
                    waktupenyajian: "45 menit",
                    idMakanan: foods[2]._id
                }
            ];
            
            for (let i = 0; i < resepData.length; i++) {
                const resep = new ResepModel(resepData[i]);
                const result = await resep.save();
                console.log(`✅ Created recipe: ${result.deskripsi}`);
            }
            
            console.log('🎉 Recipe seeder completed successfully!');
        } else {
            console.log('📖 Recipe data already exists');
            console.log(`   Found ${existData.length} recipes`);
        }
        
    } catch (error) {
        console.error('❌ Recipe seeder failed:', error);
    } finally {
        process.exit(0);
    }
}

createResepSeeder();
