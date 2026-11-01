const User=require("../models/userModel");

const adminMiddleware=async (req,res,next) => {

    try{
        const user=await User.findById(req.user);
        if(!user){
            return res.status(404).json({
                error:"User not found"
            })
        }
        if(user.role!=="admin"){
            return res.status(403).json({
                error:"This user cannot be accessed"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            error:"Something went wrong !"
        })
    }
}

module.exports={adminMiddleware};