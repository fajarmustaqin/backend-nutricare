const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = 10;

async function resetAdminPassword() {
    const uri = 'mongodb://localhost:27017/nutricare';
    const client = new MongoClient(uri);
    
    try {
        console.log('🔐 Starting admin account update...\n');
        
        await client.connect();
        const db = client.db('nutricare');
        const adminsCollection = db.collection('admins');
        
        // Find any admin (old or new email)
        const oldAdmin = await adminsCollection.findOne({ 
            $or: [
                { email: 'admin@mail.com' },
                { email: 'admin@admin.com' }
            ]
        });
        
        // Hash new password
        const newPassword = bcrypt.hashSync('admin123', saltRounds);
        
        if (!oldAdmin) {
            console.log('❌ Admin not found!');
            console.log('📝 Creating new admin account...');
            
            // Create new admin
            await adminsCollection.insertOne({
                email: 'admin@admin.com',
                password: newPassword,
                createdAt: new Date()
            });
            
            console.log('✅ New admin created successfully!');
        } else {
            console.log('✅ Admin found:', oldAdmin.email);
            
            // Update both email and password
            await adminsCollection.updateOne(
                { _id: oldAdmin._id },
                { 
                    $set: { 
                        email: 'admin@admin.com',
                        password: newPassword 
                    } 
                }
            );
            
            console.log('✅ Email updated to: admin@admin.com');
            console.log('✅ Password updated to: admin123');
        }
        
        console.log('\n📋 Admin Login Credentials:');
        console.log('   Email: admin@admin.com');
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

