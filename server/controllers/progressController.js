const Progress=require("../models/studentProgressModel");
const User=require("../models/userModel");
const Question=require("../models/questionModel");
const { z } =require("zod");

const progressSchema=z.object({
    isBookmarked:z.boolean().optional(),
    isSolved:z.boolean().optional(),
    notes:z.string().trim().optional(),
})

const progressController=async(req,res) => {
    try{
        const user=req.user;

        const question=req.params.id;
        const queFound=await Question.findById(question);
        if(!queFound){
            return res.status(404).json({
                error:"Question not found"
            })
        }

        const result=progressSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                error:"Invalid Inputs provided"
            })
        }
        if (Object.keys(result.data).length === 0) {
            return res.status(400).json({
                error: "Provide at least one field to update"
            });
        }
        const data=result.data;
        const updatedProgress=await Progress.findOneAndUpdate({student:user,question:question},{$set:data},{
            upsert:true,
            runValidators:true,
            new:true,
            setDefaultsOnInsert:true
        }) 
        return res.status(200).json({
            msg:"Updated the student progress",
            updatedProgress
        })
    }
    catch(error){
        if(error.name==="CastError"){
            return res.status(400).json({
                error:"Invalid Question Id !"
            })
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: "Invalid progress data"
            });
        }
        if(error.code===11000){
            return res.status(409).json({
                error:"Progress record conflict !"
            })
        }
        return res.status(500).json({
            error:"Something went wrong"
        })
    }
}

const getProgress=async(req,res)=>{
    try{
        const filter={
            student:req.user
        }
            
        for (const key of ["isSolved", "isBookmarked"]) {
            const value = req.query[key];

            if (value !== undefined) {
                if (value !== "true" && value !== "false") {
                    return res.status(400).json({
                        error: `${key} must be true or false`
                    });
                }

                filter[key] = value === "true";
            }
        }

        const progress = await Progress.find(filter)
            .populate("question", "title company description difficulty topic");
        return res.status(200).json({
            progress
        })
    }
    catch (error) {
        console.error("Error fetching progress:", error);
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}


const getQuestionProgress = async (req, res) => {
    try {
      const student = req.user;
      const questionId = req.params.id;
  
      const question = await Question.findById(questionId);
  
      if (!question) {
        return res.status(404).json({
          error: "Question not found",
        });
      }
  
      const progress = await Progress.findOne({
        student,
        question: questionId,
      });
  
      return res.status(200).json({
        progress,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          error: "Invalid Question ID",
        });
      }
  
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  };
  

module.exports={progressController,getProgress,getQuestionProgress};