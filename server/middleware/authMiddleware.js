const jwt = require("jsonwebtoken");
const User=require("../models/userModel");
const authMiddleware=async(req,res,next) => {

    const [scheme, token] =
        (req.headers.authorization || "").split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            error: "Authentication required"
        });
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if (!decoded.userId) {
            return res.status(401).json({
                error: "Invalid token payload"
            });
        }
        req.user=decoded.userId;
        const foundUser=await User.findById(req.user);
        if(!foundUser){
            return res.status(401).json({
                error:"User not found"
            })
        }
        next();
    }
    catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "CastError"
        ) {
            return res.status(401).json({
                error: "Invalid or expired token"
            });
        }

        return next(error);
    }
}


module.exports={authMiddleware};