const AdminModel = require("../models/admin.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers");

const registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existAdmin = await AdminModel.findOne({ email });

        if (existAdmin) {
            return res.status(400).json('Admin already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await AdminModel.create({ email, password: hashedPassword });

        res.status(200).json('Admin registered successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existAdmin = await AdminModel.findOne({ email });

        if (!existAdmin) {
            return res.status(404).json('Admin not found');
        }

        const validPassword = await bcrypt.compare(password, existAdmin.password);

        if (!validPassword) {
            return res.status(401).json('Invalid credentials');
        }

        const token = generateToken({ _id: existAdmin._id, role: "admin" });

        res.status(200).json({ message: "Welcome, Admin!", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
};