const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migrateDatabase() {
    const sourceUri = 'mongodb://localhost:27017/nutziverse';
    const targetUri = 'mongodb://localhost:27017/nutricare';
    
    const sourceClient = new MongoClient(sourceUri);
    const targetClient = new MongoClient(targetUri);
    
    try {
        console.log('🚀 Starting database migration from nutziverse to nutricare...\n');
        
        // Connect to source database
        await sourceClient.connect();
        const sourceDb = sourceClient.db('nutziverse');
        console.log('✅ Connected to source database: nutziverse');
        
        // Connect to target database
        await targetClient.connect();
        const targetDb = targetClient.db('nutricare');
        console.log('✅ Connected to target database: nutricare');
        
        // Get all collections from source
        const collections = await sourceDb.listCollections().toArray();
        console.log(`\n📦 Found ${collections.length} collections to migrate:\n`);
        
        let totalDocuments = 0;
        
        for (const collection of collections) {
            const collectionName = collection.name;
            console.log(`📋 Migrating collection: ${collectionName}`);
            
            // Get all documents from source collection
            const documents = await sourceDb.collection(collectionName).find({}).toArray();
            
            if (documents.length > 0) {
                // Drop target collection if exists
                try {
                    await targetDb.collection(collectionName).drop();
                    console.log(`   🗑️  Dropped existing collection: ${collectionName}`);
                } catch (err) {
                    // Collection doesn't exist, that's fine
                }
                
                // Insert all documents to target
                await targetDb.collection(collectionName).insertMany(documents);
                console.log(`   ✅ Migrated ${documents.length} documents`);
                totalDocuments += documents.length;
            } else {
                console.log(`   ⚠️  Collection is empty, skipping`);
            }
        }
        
        console.log(`\n🎉 Migration completed successfully!`);
        console.log(`📊 Total collections migrated: ${collections.length}`);
        console.log(`📄 Total documents migrated: ${totalDocuments}`);
        console.log(`\n✅ Database 'nutricare' is now ready to use!`);
        
        // Close connections
        await sourceClient.close();
        await targetClient.close();
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateDatabase();

