const Question = require("../models/questionModel");
const Progress=require("../models/studentProgressModel");
const mongoose=require("mongoose");

const dashboardController=async(req,res)=> {
    try{
        const totalSolved=await Progress.countDocuments({
            student:req.user,
            isSolved:true
        })
        const totalBookmarked=await Progress.countDocuments({
            student:req.user,
            isBookmarked:true
        })
        const stats=await Progress.aggregate([
            {
                $match:{
                    student:new mongoose.Types.ObjectId(req.user),
                    isSolved:true
                }
            },
            {
                $lookup:{
                    from:"questions",
                    localField:"question",
                    foreignField:"_id",
                    as:"questionDetails"
                }
            },
            {
                $unwind:"$questionDetails"
            },
            {
                $facet: {
                    difficultWiseQuestions: [
                        {
                            $group: {
                                _id: "$questionDetails.difficulty",
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    topicwiseQuestions: [
                        {
                            $group: {
                                _id: "$questionDetails.topic",
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ])
        const totalQuestions=await Question.countDocuments();
        const difficultWiseQuestions = stats[0]?.difficultWiseQuestions ?? [];
        const topicwiseQuestions = stats[0]?.topicwiseQuestions ?? [];
        const totalByDifficulty = await Question.aggregate([
            {
                $group: {
                    _id: "$difficulty",
                    total: { $sum: 1 }
                }
            }
        ]);
        const difficultyStats = totalByDifficulty.map(item => {
            const solvedItem = difficultWiseQuestions.find(
                solved => solved._id === item._id
            );
        
            return {
                difficulty: item._id,
                total: item.total,
                solved: solvedItem ? solvedItem.count : 0
            };
        });
        return res.status(200).json({
            msg:"Fetched solved questions !",
            totalQuestions,
            totalSolved,
            totalBookmarked,
            topicwiseQuestions,
            difficultyStats
        })
    }
    catch (error) {
        console.error("Dashboard error:", error);
    
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

 const getQuestionStats = async (req, res) => {
    try {
        const [
            totalQuestions,
            easyQuestions,
            mediumQuestions,
            hardQuestions,
            topics,
            companies
        ] = await Promise.all([
            Question.countDocuments(),
            Question.countDocuments({ difficulty: "Easy" }),
            Question.countDocuments({ difficulty: "Medium" }),
            Question.countDocuments({ difficulty: "Hard" }),
            Question.distinct("topic", {
                topic: { $nin: ["", null] }
            }),
            Question.distinct("company", {
                company: { $nin: ["", null] }
            })
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                totalQuestions,
                easyQuestions,
                mediumQuestions,
                hardQuestions,
                totalTopics: topics.length,
                totalCompanies: companies.length
            }
        });
    } catch (error) {
        console.error("Error fetching question statistics:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch question statistics"
        });
    }
};

module.exports={dashboardController,getQuestionStats};