const FoodModel = require("../models/food.model");

const getAll = async (req, res) => {
    try {
        const food = await FoodModel.find();
        res.send(food);

    }catch (error) {
        res.status(500).send({message: error.message});
    }
};

const getByID = async (req, res) => {
    const {id} = req.params;
    try{
        const food = await FoodModel.findOne({_id:id});

        res.send(food);

    }catch(error) {
        res.status(500).send({message: error.message});
    }
};

//Khusus admin untuk menambahkan makanan

const addFood = async(req, res) => {
    try {
        console.log("Permintaan ke fungsi addfood");
        console.log("isi permintaan:",req.body);

        const newFood = req.body;
        console.log("Data makanan baru: ",newFood);

        const result = await FoodModel.create(newFood);

        // // atau dapat menggunakan save const createFood = new FoodModel(newFood);
        // await createFood.save();

        console.log("Makanan berhasil ditambahkan: ", result);

        res.send({message: "Sukses"});

    }catch(error) {
        res.status(500).send({message: "Kesalahan Server Internal: " +error.message});
    }
};

const editFood = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFood = req.body;

        if (Object.keys(updateFood).length=== 0) {
            res.send({message: "Nothing to update"});
        }else {
            const updated = await FoodModel.updateOne({_id: id}, updateFood);
            res.send({message: "Success", updated});
        }
    }catch(error) {
        res.status(500).send({message: error.message});
    }
};

const getMultipleFood = async (req,res) => {
    try {
        const id = req.body.idmakanan;
        const data = await FoodModel.find({_id: {$in: id}});
        res.status(200).send(data);
    }catch(error) {
        res.status(500).send(error);
    }
};

const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        
        const food = await FoodModel.findById(id);
        if (!food) {
            return res.status(404).send({ message: "Food not found" });
        }
        
        await FoodModel.findByIdAndDelete(id);
        res.status(200).send({ 
            message: "Food deleted successfully",
            deletedFood: food.makanan 
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No image file uploaded" });
        }
        
        // Generate image URL
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
        
        res.status(200).send({
            message: "Image uploaded successfully",
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    getAll,
    getByID,
    addFood,
    editFood,
    deleteFood,
    uploadImage,
    getMultipleFood,
};


