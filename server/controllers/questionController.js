const Question=require("../models/questionModel");
const Progress = require("../models/studentProgressModel");
const {queSchema,updateSchema}=require("../validators/questionValidator");
const mongoose=require("mongoose");

const createQuestion=async(req,res)=> {
    try{
        const result=queSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                error:"Input data does not meet the required constraints !"
            })
        }
        const data=result.data;
        const foundLink=await Question.findOne({externalLink:data.externalLink});
        if(foundLink){
            return res.status(409).json({
                error:"External link is already found"
            })
        }
        const {title,description,topic,difficulty,tags,company,externalLink}=data;
        const question=await Question.create({
            title,description,topic,difficulty,tags,company,externalLink
        })
        return res.status(201).json({
            message:"Question added successfully",
            question:question
        })
    }
    catch(error){
        if (error.code === 11000) {
            return res.status(409).json({
                error: "External link already exists"
            });
        }
        return res.status(500).json({
            error:"Something went wrong !"
        })
    }
    
}

const getQuestions=async (req,res) => {
    try{

        const filter ={};
        const stringFilters = ["topic", "company"];

        stringFilters.forEach((key) => {
            if (req.query[key]) {
                filter[key] ={
                    $regex: req.query[key],
                    $options: "i"
                }
            }
        });

        if(req.query.difficulty){
            const value = req.query.difficulty;
            if (!["Easy", "Medium", "Hard"].includes(value)) {
                return res.status(400).json({
                    error: "difficulty must be Easy, Medium, or Hard"
                });
            }
            filter.difficulty=value;
        }

        if (req.query.search) {
            const search = req.query.search.trim();

            if (search.length > 100) {
                return res.status(400).json({
                    error: "Search cannot exceed 100 characters"
                });
            }

            const escapedSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );
            filter.$or = [
                { title: { $regex: escapedSearch, $options: "i" } },
                { description: { $regex: escapedSearch, $options: "i" } }
            ];
        }
        const sortAllowedFields=["title","company","createdAt","topic","difficulty"];

        const sortOptions={};
        if(req.query.sort){
            const value=req.query.sort;
            if(!sortAllowedFields.includes(value)){
                return res.status(400).json({
                    error:"Provide a valid sort value !"
                })
            }
            const order=req.query.order || "asc";
            if(!["asc", "desc"].includes(order)){
                return res.status(400).json({
                    error:"Order parameter should be either asc or desc !"
                })
            }

            sortOptions[value]=order==="asc"? 1:-1;
        }

        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        if(!Number.isInteger(page) ||page<1 || !Number.isInteger(limit) || limit<1 || limit>100){
            return res.status(400).json({
                error:"page must be a positive integer,limit must be between 1 and 100"
            });
        }
        const skip = (page - 1) * limit;

        const totalQuestions=await Question.countDocuments(filter);
        
        const totalPages = Math.ceil(totalQuestions / limit);
        if (totalPages>0 && page > totalPages) {
            return res.status(400).json({
                error: "Requested page exceeds the total number of pages",
                totalPages
            });
        }
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        
        const questions=await Question.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
        
        res.status(200).json({
            questions,
            pagination: {
                totalQuestions,
                currentPage: page,
                limit,
                totalPages,
                hasNextPage,
                hasPreviousPage
            }
        })
    }
    catch(error){
        return res.status(500).json({
            msg:"Internal server error !"
        })
    }
}

const getQuestionById=async (req,res) =>{
    try{
        const id=req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                error: "Invalid question ID"
            });
        }
        const question=await Question.findById(id);
        if(!question){
            return res.status(404).json({
                error:"question not found !"
            })
        }
        const progress = await Progress.findOne({
            student: req.user,
            question: req.params.id,
        });
    
        return res.status(200).json({
            question,
            progress: {
                isSolved: progress?.isSolved ?? false,
                isBookmarked: progress?.isBookmarked ?? false,
                notes: progress?.notes ?? "",
            },
        });
    }
    catch (error) {
        console.error("Error fetching question:", error);
    
        return res.status(500).json({
            error: "Something went wrong!"
        });
    }
}

const updateQuestionById=async(req,res) => {
    try{
        const id=req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                error: "Invalid question ID"
            });
        }

        const result=updateSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                error:"please provide the valid inputs"
            })
        }

        if (Object.keys(result.data).length === 0) {
            return res.status(400).json({
                error: "Provide at least one field to update"
            });
        }

        const data=result.data;
        const updatedQuestion= await Question.findByIdAndUpdate(id,data,{
            returnDocument: "after",
            runValidators: true
        });

        if(!updatedQuestion){
            return res.status(404).json({
                error:"Question not found"
            })
        }

        res.status(200).json({question:updatedQuestion});
    }
    catch(error){
        if (error.code === 11000) {
            return res.status(409).json({
                error: "External link already exists"
            });
        }
        if(error.name==="CastError"){
            return res.status(400).json({
                error:"Bad Request !"
            })
        }
        return res.status(500).json({
            msg:"something went wrong"
        })
    }
}

const deleteQuestion=async(req,res) => {
    const id=req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            error: "Invalid question ID"
        });
    }
    let session;
    try{
        session=await mongoose.startSession();
        await session.withTransaction(async() => {
            const question = await Question.findById(id)
                .session(session);

            if (!question) {
                const error = new Error("Question not found");
                error.statusCode = 404;
                throw error;
            }
            
            await Progress.deleteMany({
                question: id
            }).session(session);

            await Question.deleteOne({
                _id: id
            }).session(session);

        })
        return res.status(200).json({
            msg: "Question deleted successfully"
        });
    }
    catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                error: error.message
            });
        }

        return res.status(500).json({
            msg: "Something went wrong!"
        });

    } finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports={createQuestion,getQuestions,getQuestionById,updateQuestionById,deleteQuestion};