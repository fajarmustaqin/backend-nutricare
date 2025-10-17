const UserModel = require("../models/users.model");
const bcrypt = require("bcrypt");
const DBconnection = require("../config/index");
require('dotenv').config({ path: "./.env" });
const { MONGODB_URI } = process.env;

const saltRounds = 10;

// Sample user data
const userData = [
    {
        nama: "John Doe",
        email: null,
        jeniskelamin: "laki-laki",
        aktivitasFisik: {
            keterangan: "aktivitas sedang",
            nilai: 1.3
        },
        tinggi: 170,
        berat: 70,
        no_hp: "081234567890",
        umur: 25,
        password: bcrypt.hashSync("user123", saltRounds),
        kaloriYgDibutuhkan: 2200,
        gizi: {
            karbohidrat: 1650,
            lemak: 550,
            protein: 330
        }
    },
    {
        nama: "Jane Smith",
        email: null,
        jeniskelamin: "perempuan",
        aktivitasFisik: {
            keterangan: "aktivitas rendah",
            nilai: 1.2
        },
        tinggi: 160,
        berat: 55,
        no_hp: "081234567891",
        umur: 23,
        password: bcrypt.hashSync("user123", saltRounds),
        kaloriYgDibutuhkan: 1800,
        gizi: {
            karbohidrat: 1350,
            lemak: 450,
            protein: 270
        }
    },
    {
        nama: "Budi Santoso",
        email: null,
        jeniskelamin: "laki-laki",
        aktivitasFisik: {
            keterangan: "aktivitas tinggi",
            nilai: 1.4
        },
        tinggi: 175,
        berat: 80,
        no_hp: "081234567892",
        umur: 30,
        password: bcrypt.hashSync("user123", saltRounds),
        kaloriYgDibutuhkan: 2500,
        gizi: {
            karbohidrat: 1875,
            lemak: 625,
            protein: 375
        }
    }
];

async function createUserSeeder() {
    try {
        await DBconnection(MONGODB_URI);
        console.log('🔌 Connected to MongoDB');
        
        const existData = await UserModel.find();
        
        // Check if our test users exist
        const testUser = await UserModel.findOne({ no_hp: "081234567890" });
        
        if (!testUser) {
            console.log('👥 Creating user sample data...');
            
            for (let i = 0; i < userData.length; i++) {
                const user = new UserModel(userData[i]);
                const result = await user.save();
                console.log(`✅ Created user: ${result.nama} (${result.no_hp})`);
            }
            
            console.log('\n🎉 User seeder completed successfully!');
            console.log('\n📋 Sample Login Credentials:');
            console.log('   📱 Phone: 081234567890 | 🔐 Password: user123');
            console.log('   📱 Phone: 081234567891 | 🔐 Password: user123');
            console.log('   📱 Phone: 081234567892 | 🔐 Password: user123');
            
        } else {
            console.log('👥 User data already exists');
            console.log(`   Found ${existData.length} users`);
            
            // Show existing users for testing
            console.log('\n📋 Existing Users for Login:');
            const users = await UserModel.find({}, { nama: 1, no_hp: 1, _id: 0 });
            users.forEach(user => {
                if (user.no_hp) {
                    console.log(`   📱 ${user.nama}: ${user.no_hp}`);
                }
            });
        }
        
    } catch (error) {
        console.error('❌ User seeder failed:', error);
        throw error;
    }
}

module.exports = createUserSeeder;
