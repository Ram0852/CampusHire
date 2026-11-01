const express=require("express");
const router=express.Router();

const {progressController,getQuestionProgress, getProgress} =require("../controllers/progressController");
const {authMiddleware}=require("../middleware/authMiddleware");

router.patch("/:id",authMiddleware,progressController);
router.get("/",authMiddleware,getProgress);
router.get("/:id",authMiddleware,getQuestionProgress);

module.exports=router;