const mongoose=require("mongoose");
const User=require("./userModel");
const Question=require("./questionModel");

const progressSchema=mongoose.Schema(
    {
        student:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        question:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Question",
            required:true
        },
        isSolved:{
            type:Boolean,
            required:true,
            default:false
        },
        isBookmarked:{
            type:Boolean,
            required:true,
            default:false
        },
        notes:{
            type:String,
        }
    },
    {
        timestamps:true,
    }
)

progressSchema.index(
    {
        student:1,question:1
    },
    {unique:true}
)

const Progress=mongoose.model("Progress",progressSchema);

module.exports=Progress;