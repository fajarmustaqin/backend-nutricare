const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutziverse';
const backupDir = path.join(__dirname, '../backups');

// Extract database name from URI
const dbName = mongoUri.split('/').pop().split('?')[0];

console.log('🗄️  MongoDB Backup Script');
console.log('Database:', dbName);
console.log('Backup directory:', backupDir);

// Backup database menggunakan mongodump
function backupDatabase() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(backupDir, `backup-${timestamp}`);
    
    // Buat command mongodump
    const mongodumpPath = '"C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongodump.exe"';
    const command = `${mongodumpPath} --uri="${mongoUri}" --out="${outputDir}"`;
    
    console.log('\n📦 Starting backup...');
    console.log('Command:', command);
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Backup failed:', error.message);
            return;
        }
        
        if (stderr) {
            console.error('⚠️  Warning:', stderr);
        }
        
        console.log('✅ Backup completed!');
        console.log('📁 Backup location:', outputDir);
        console.log('📄 Output:', stdout);
    });
}

// Restore database menggunakan mongorestore
function restoreDatabase(backupPath) {
    const mongorestorePath = '"C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongorestore.exe"';
    const command = `${mongorestorePath} --uri="${mongoUri}" --drop "${backupPath}"`;
    
    console.log('\n📥 Starting restore...');
    console.log('Command:', command);
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Restore failed:', error.message);
            return;
        }
        
        if (stderr) {
            console.error('⚠️  Warning:', stderr);
        }
        
        console.log('✅ Restore completed!');
        console.log('📄 Output:', stdout);
    });
}

// Export ke JSON (readable format)
function exportToJson() {
    const mongoexportPath = '"C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongoexport.exe"';
    const collections = ['users', 'foods', 'admins', 'reseps', 'trackingnutrisis', 'rekomendasis'];
    
    console.log('\n📄 Exporting to JSON...');
    
    collections.forEach(collection => {
        const outputFile = path.join(backupDir, `${collection}.json`);
        const command = `${mongoexportPath} --uri="${mongoUri}" --collection="${collection}" --out="${outputFile}" --pretty`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Export ${collection} failed:`, error.message);
                return;
            }
            
            console.log(`✅ Exported ${collection} to ${outputFile}`);
        });
    });
}

// Jalankan berdasarkan argument
const action = process.argv[2];

switch (action) {
    case 'backup':
        backupDatabase();
        break;
    case 'restore':
        const backupPath = process.argv[3];
        if (!backupPath) {
            console.error('❌ Please provide backup path: node backup-database.js restore <path>');
            process.exit(1);
        }
        restoreDatabase(backupPath);
        break;
    case 'export':
        exportToJson();
        break;
    default:
        console.log(`
🔧 Usage:
  node backup-database.js backup          # Backup database
  node backup-database.js restore <path>  # Restore from backup
  node backup-database.js export          # Export to JSON files
        `);
}
