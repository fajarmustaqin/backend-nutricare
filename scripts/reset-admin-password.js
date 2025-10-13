const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = 10;

async function resetAdminPassword() {
    const uri = 'mongodb://localhost:27017/nutricare';
    const client = new MongoClient(uri);
    
    try {
        console.log('🔐 Starting admin password reset...\n');
        
        await client.connect();
        const db = client.db('nutricare');
        const adminsCollection = db.collection('admins');
        
        // Find admin
        const admin = await adminsCollection.findOne({ email: 'admin@mail.com' });
        
        if (!admin) {
            console.log('❌ Admin not found!');
            console.log('📝 Creating new admin account...');
            
            // Create new admin
            const newPassword = bcrypt.hashSync('admin123', saltRounds);
            await adminsCollection.insertOne({
                email: 'admin@mail.com',
                password: newPassword,
                createdAt: new Date()
            });
            
            console.log('✅ New admin created successfully!');
        } else {
            console.log('✅ Admin found:', admin.email);
            
            // Hash new password
            const newPassword = bcrypt.hashSync('admin123', saltRounds);
            
            // Update password
            await adminsCollection.updateOne(
                { email: 'admin@mail.com' },
                { $set: { password: newPassword } }
            );
            
            console.log('✅ Password updated successfully!');
        }
        
        console.log('\n📋 Admin Login Credentials:');
        console.log('   Email: admin@mail.com');
        console.log('   Password: admin123');
        console.log('\n🚀 You can now login at: http://localhost:3000/admin');
        
        await client.close();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Reset failed:', error);
        process.exit(1);
    }
}

resetAdminPassword();

