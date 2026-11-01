const express=require("express");
const router=express.Router();
const {authMiddleware}=require("../middleware/authMiddleware");
const {adminMiddleware}=require("../middleware/adminMiddleware");
const {getQuestionStats,dashboardController}=require("../controllers/dashboardController");

router.get("/",authMiddleware,dashboardController);
router.get("/admin",authMiddleware,adminMiddleware,getQuestionStats);

module.exports=router;