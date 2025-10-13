# 🌱 Seed Database - NutriCare

## Cara Populate Database dengan Data

### 📋 Seeder yang Tersedia:

Backend punya **master seeder** yang akan populate semua data sekaligus:
- ✅ Admin (login credentials)
- ✅ User Sample
- ✅ Food Catalog (10 makanan Indonesia)
- ✅ Recipes (Resep makanan)
- ✅ Weekly Plans (sample diet plans)

---

## 🚀 Cara Run Seeder

### Option 1: Run All Seeders (Recommended)
```bash
cd back-end-nutricare
npm run seeder
```

Ini akan run:
1. Admin seeder
2. User seeder
3. Food seeder
4. Recipe seeder
5. Weekly plan seeder

### Option 2: Run Individual Seeder
```bash
# Admin only
npm run seeder:admin

# Food only
npm run seeder:food

# Recipe only
npm run seeder:resep

# Disease template
npm run seeder:disease

# Weekly plan
npm run seeder:weekly
```

---

## 📝 Default Login Credentials

Setelah seeder berhasil, gunakan credentials ini:

### Admin Login
```
URL: http://localhost:3000/admin
Email: admin@mail.com
Password: admin123
```

### Sample User Login
(Check seeders/user.seeder.js untuk detail user accounts)

---

## ✅ Verify Seeder Success

### 1. Check Console Output
Harus muncul:
```
🌱 Starting Master Seeder...
📦 Running Admin Seeder...
✅ Created admin
📦 Running Food Seeder...
✅ Created: Nasi Putih
✅ Created: Ayam Goreng
... (dan seterusnya)
🎉 All seeders completed!
```

### 2. Check di Frontend
1. Login sebagai admin
2. Go to "Kelola Makanan" 
3. Harus muncul 10 makanan

### 3. Check di MongoDB
```bash
# Connect ke MongoDB
mongosh

# Pilih database
use nutricare

# Check collections
show collections

# Count documents
db.foods.countDocuments()      # Should be 10
db.admins.countDocuments()     # Should be 1
db.reseps.countDocuments()     # Should be >= 3
```

---

## 🔧 Troubleshooting

### Error: "data is exist"
✅ **Normal!** Data sudah ada di database.
Seeder tidak akan duplicate data.

### Error: "Connection refused"
❌ MongoDB belum running!

**Fix:**
```bash
# Start MongoDB service
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Error: "Cannot find module"
❌ Dependencies belum terinstall

**Fix:**
```bash
cd back-end-nutricare
npm install
```

### Ingin Reset Database
```bash
# Option 1: Drop database via MongoDB
mongosh
use nutricare
db.dropDatabase()

# Option 2: Drop specific collections
mongosh
use nutricare
db.foods.drop()
db.admins.drop()
db.reseps.drop()

# Kemudian run seeder lagi
npm run seeder
```

---

## 📊 Sample Data yang Di-seed

### Foods (10 items):
1. Nasi Putih (130 kcal)
2. Ayam Goreng (250 kcal)
3. Sayur Bayam (23 kcal)
4. Tempe Goreng (190 kcal)
5. Tahu Goreng (150 kcal)
6. Ikan Lele Goreng (200 kcal)
7. Gado-gado (180 kcal)
8. Rendang Daging (300 kcal)
9. Soto Ayam (120 kcal)
10. Pisang (89 kcal)

### Admin:
- Email: admin@mail.com
- Password: admin123
- Role: admin

---

## 💡 Tips

### Untuk Development:
1. Run seeder sekali saat setup awal
2. Tidak perlu run lagi kecuali mau reset data
3. Kalau mau tambah data baru, pakai UI admin atau tambahin di seeder file

### Untuk Production:
1. Jangan run seeder di production!
2. Use proper migration system
3. Backup database sebelum update

---

## 🔄 Update Seeder Data

Kalau mau update data yang di-seed:

### 1. Edit Seeder File
```javascript
// Edit: seeders/food.seeder.js
const foodData = [
    {
        makanan: "Nama Makanan Baru",
        image: "https://url-image.com/image.jpg",
        kaloriMakanan: 200,
        karbohidrat: 25,
        protein: 10,
        lemak: 8,
        karbon: 2.5,
        porsi: "100g",
        penyetaraanPorsi: "1 porsi"
    },
    // ... existing data
];
```

### 2. Reset & Re-seed
```bash
# Drop collection
mongosh
use nutricare
db.foods.drop()
exit

# Re-run seeder
npm run seeder:food
```

---

## ✅ Checklist After Seeding

- [ ] MongoDB service running
- [ ] Seeder completed without errors
- [ ] Can login as admin (admin@mail.com / admin123)
- [ ] Food data appears in "Kelola Makanan"
- [ ] Can see recipes in "Resep" page
- [ ] No console errors in frontend

---

Selamat! Database anda sudah terisi dengan sample data! 🎉

