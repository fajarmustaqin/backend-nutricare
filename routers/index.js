const express = require("express");
const router = express.Router();

try {
    const userRoutes = require("./users.router");
    router.use("/users", userRoutes);
    console.log("Loaded users.router succeesfully");

    const adminRoutes = require("./admin.router");
    router.use("/admin", adminRoutes);
    console.log("Loaded admin.router succeesfully");

    const AkunRoute = require("./akun.router");
    router.use("/akun", AkunRoute);
    console.log("Loaded akun.router succeesfully");

    const ProfileRoute = require("./profile.router");
    router.use("/profile", ProfileRoute);
    console.log("Loaded profile.router succeesfully");


    const FoodRouter = require("./food.router");
    router.use("/food", FoodRouter);
    console.log("Loaded food.router succeesfully");

    const TrackingRouter = require("./tracking.router");
    router.use("/tracking", TrackingRouter);
    console.log("Loaded tracking.router succeesfully");

    const PilihMakananRouter = require("./pilihmakanan.router");
    router.use("/pilihmakanan", PilihMakananRouter);
    console.log("Loaded pilihmakanan.router succeesfully");

    const RekomendasiRouter = require("./rekomendasi.router");
    router.use("/rekomendasi", RekomendasiRouter);
    console.log("Loaded rekomendasi.router succeesfully");

    const EditProfileRouter = require("../routers/editprofil.router");
    router.use("/editprofile", EditProfileRouter);
    console.log("Loaded editprofile.router succeesfully");

    const WeeklyPlanRouter = require("../routers/weeklyPlan.router");
    router.use("/weekly-plan", WeeklyPlanRouter);
    console.log("Loaded weeklyplan.router succeesfully");

    const DiseaseTemplateRouter = require("../routers/diseaseTemplate.router");
    router.use("/disease-template", DiseaseTemplateRouter);
    console.log("Loaded diseasetemplate.router succeesfully");

    
} catch(error) {

    console.error("Error requiring one of the routes: ", error);
}

module.exports = router;