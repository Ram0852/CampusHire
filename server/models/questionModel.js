const mongoose=require("mongoose");

const questionSchema=mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        topic:{
            type:String,
            required:true,
        },
        company:{
            type:String,
        },
        difficulty:{
            type:String,
            enum:["Easy","Medium","Hard"],
            required:true,
        },
        externalLink:{
            type:String,
            required:true,
            unique:true,
        },
        description:{
            type:String,
            required:true,
        },
        tags:[String],
    },
    {
        timestamps:true,
    }
)

const Question=mongoose.model("Question",questionSchema);
module.exports=Question;