const AdminModel = require("../models/admin.model")
const bcrypt = require("bcrypt")
const DBconnection = require("../config/index")
require('dotenv').config({ path: "./.env" })
const {MONGODB_URI} = process.env

const saltRounds = 10

const AdminData = [   
  new AdminModel({
    email : "admin@mail.com",
    password: bcrypt.hashSync("admin123", saltRounds)
}),]

async function createSeeder(){
    try {
        await DBconnection(MONGODB_URI)
        const existData = await AdminModel.find()
        if(existData.length === 0){
            await AdminData.map(async (data, index) => {
                    await data.save((err, result) => {
                        console.log(result)
                    });
            });
        } else {
            console.log('Admin data already exists')
        }
    } catch (error) {
        console.log('Admin seeder error:', error)
        throw error
    }
}

module.exports = createSeeder