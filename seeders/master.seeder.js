const { exec } = require('child_process');
const path = require('path');

console.log('🌱 Starting Master Seeder...\n');

const seeders = [
    { name: 'Admin', file: 'admin.seeder.js' },
    { name: 'User', file: 'user.seeder.js' },
    { name: 'Food', file: 'food.seeder.js' },
    { name: 'Disease Template', file: 'diseaseTemplate.seeder.js' },
    { name: 'Weekly Plan', file: 'weeklyPlan.seeder.js' }
];

async function runSeeder(seederFile) {
    return new Promise((resolve, reject) => {
        const command = `node ${path.join(__dirname, seederFile)}`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            
            if (stderr) {
                console.log('⚠️  Warning:', stderr);
            }
            
            console.log(stdout);
            resolve(stdout);
        });
    });
}

async function runAllSeeders() {
    for (let seeder of seeders) {
        try {
            console.log(`\n📦 Running ${seeder.name} Seeder...`);
            await runSeeder(seeder.file);
        } catch (error) {
            console.error(`❌ ${seeder.name} Seeder failed:`, error.message);
        }
    }
    
    console.log('\n🎉 All seeders completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Admin data (login: admin@mail.com / admin123)');
    console.log('   ✅ Food catalog (50+ Indonesian foods)');
    console.log('   ✅ Disease templates (5+ medical conditions)');
    console.log('   ✅ Weekly meal plans (sample plans)');
    console.log('\n🚀 Your NutriCare database is ready to use!');
}

runAllSeeders();
