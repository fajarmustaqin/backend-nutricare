const mongoose = require('mongoose');
require('dotenv').config();

async function inspectDatabase() {
    try {
        // Koneksi ke MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutziverse';
        console.log('Connecting to:', mongoUri);
        
        await mongoose.connect(mongoUri);
        console.log('✓ Connected to MongoDB');

        // Dapatkan informasi database
        const db = mongoose.connection.db;
        
        // List semua collections
        console.log('\n📊 DATABASE INFORMATION:');
        console.log('Database name:', db.databaseName);
        
        const collections = await db.listCollections().toArray();
        console.log('\n📁 COLLECTIONS:');
        
        for (let collection of collections) {
            console.log(`\n🗂️  Collection: ${collection.name}`);
            
            // Hitung jumlah dokumen
            const count = await db.collection(collection.name).countDocuments();
            console.log(`   📄 Documents: ${count}`);
            
            // Tampilkan contoh dokumen pertama
            if (count > 0) {
                const sample = await db.collection(collection.name).findOne();
                console.log('   📝 Sample document:');
                console.log('   ', JSON.stringify(sample, null, 6).substring(0, 200) + '...');
            }
            
            // Tampilkan indexes
            const indexes = await db.collection(collection.name).indexes();
            console.log(`   🔍 Indexes: ${indexes.length}`);
            indexes.forEach((index, i) => {
                console.log(`      ${i + 1}. ${JSON.stringify(index.key)}`);
            });
        }
        
        // Database stats
        const stats = await db.stats();
        console.log('\n💾 DATABASE STATS:');
        console.log(`   Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Storage: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Collections: ${stats.collections}`);
        console.log(`   Indexes: ${stats.indexes}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Connection closed');
    }
}

// Jalankan inspeksi
inspectDatabase();
