const express=require("express");
const router=express.Router();
const {createQuestion,getQuestions,getQuestionById,updateQuestionById,deleteQuestion} =require("../controllers/questionController");
const {authMiddleware}=require("../middleware/authMiddleware");
const {adminMiddleware}=require("../middleware/adminMiddleware");

router.post("/",authMiddleware,adminMiddleware, createQuestion);
router.get("/",authMiddleware,getQuestions);
router.get("/:id",authMiddleware,getQuestionById);
router.patch("/:id",authMiddleware,adminMiddleware,updateQuestionById);
router.delete("/:id",authMiddleware,adminMiddleware,deleteQuestion);

module.exports=router;