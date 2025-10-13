const FoodModel = require("../models/food.model");
const DBconnection = require("../config/index");
require('dotenv').config({ path: "./.env" });
const { MONGODB_URI } = process.env;

// Sample food data
const foodData = [
    {
        makanan: "Nasi Putih",
        image: "https://example.com/nasi-putih.jpg",
        kaloriMakanan: 130,
        karbohidrat: 28,
        protein: 2.7,
        lemak: 0.3,
        karbon: 2.5,
        porsi: "100g",
        penyetaraanPorsi: "1 centong"
    },
    {
        makanan: "Ayam Goreng",
        image: "https://example.com/ayam-goreng.jpg",
        kaloriMakanan: 250,
        karbohidrat: 0,
        protein: 25,
        lemak: 15,
        karbon: 4.2,
        porsi: "100g",
        penyetaraanPorsi: "1 potong"
    },
    {
        makanan: "Sayur Bayam",
        image: "https://example.com/bayam.jpg",
        kaloriMakanan: 23,
        karbohidrat: 3.6,
        protein: 2.9,
        lemak: 0.4,
        karbon: 0.8,
        porsi: "100g",
        penyetaraanPorsi: "1 mangkuk"
    },
    {
        makanan: "Tempe Goreng",
        image: "https://example.com/tempe-goreng.jpg",
        kaloriMakanan: 190,
        karbohidrat: 9,
        protein: 19,
        lemak: 11,
        karbon: 1.5,
        porsi: "100g",
        penyetaraanPorsi: "2 potong"
    },
    {
        makanan: "Tahu Goreng",
        image: "https://example.com/tahu-goreng.jpg",
        kaloriMakanan: 150,
        karbohidrat: 4,
        protein: 12,
        lemak: 9,
        karbon: 1.2,
        porsi: "100g",
        penyetaraanPorsi: "3 potong"
    },
    {
        makanan: "Ikan Lele Goreng",
        image: "https://example.com/lele-goreng.jpg",
        kaloriMakanan: 200,
        karbohidrat: 0,
        protein: 18,
        lemak: 14,
        karbon: 3.8,
        porsi: "100g",
        penyetaraanPorsi: "1 ekor"
    },
    {
        makanan: "Gado-gado",
        image: "https://example.com/gado-gado.jpg",
        kaloriMakanan: 180,
        karbohidrat: 15,
        protein: 8,
        lemak: 10,
        karbon: 2.1,
        porsi: "100g",
        penyetaraanPorsi: "1 porsi"
    },
    {
        makanan: "Rendang Daging",
        image: "https://example.com/rendang.jpg",
        kaloriMakanan: 300,
        karbohidrat: 8,
        protein: 22,
        lemak: 20,
        karbon: 5.5,
        porsi: "100g",
        penyetaraanPorsi: "3 potong"
    },
    {
        makanan: "Soto Ayam",
        image: "https://example.com/soto-ayam.jpg",
        kaloriMakanan: 120,
        karbohidrat: 8,
        protein: 12,
        lemak: 4,
        karbon: 2.8,
        porsi: "100g",
        penyetaraanPorsi: "1 mangkuk"
    },
    {
        makanan: "Pisang",
        image: "https://example.com/pisang.jpg",
        kaloriMakanan: 89,
        karbohidrat: 23,
        protein: 1.1,
        lemak: 0.3,
        karbon: 0.5,
        porsi: "100g",
        penyetaraanPorsi: "1 buah"
    }
];

async function createFoodSeeder() {
    try {
        await DBconnection(MONGODB_URI);
        console.log('🔌 Connected to MongoDB');
        
        const existData = await FoodModel.find();
        
        if (existData.length === 0) {
            console.log('🌱 Creating food data...');
            
            for (let i = 0; i < foodData.length; i++) {
                const food = new FoodModel(foodData[i]);
                const result = await food.save();
                console.log(`✅ Created: ${result.makanan}`);
            }
            
            console.log('🎉 Food seeder completed successfully!');
        } else {
            console.log('📦 Food data already exists');
            console.log(`   Found ${existData.length} food items`);
        }
        
    } catch (error) {
        console.error('❌ Seeder failed:', error);
    } finally {
        process.exit(0);
    }
}

createFoodSeeder();
