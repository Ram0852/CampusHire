const User=require("../models/userModel");
const bcrypt=require("bcrypt");
const {z} =require("zod");
const jwt=require("jsonwebtoken");

const regSchema=z.object({
    name:z.string().min(1,"Name is required"),
    email:z.string().email("Please enter a valid email"),
    password:z.string().min(6,"Password must be atleast length 6")
});

const register= async(req,res) => {

    const result=regSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            error:result.error.issues[0].message
        });
    }

    try{
        const {name,email,password} =result.data;
        const existEmail=await User.findOne({email});
        if(existEmail){
            return res.status(409).json({
                error:"Email already registered"
            });
        }

        const hashedPass=await bcrypt.hash(password,10);
    
        await User.create({
            name,
            email,
            password:hashedPass
        })
    }
    catch(error){
        return res.status(500).json({
            message: "Internal server error"
        });
    }

    return res.status(201).json({
        message:"User created successfully"
    })
};

const loginSchema=z.object({
    email:z.string().email("please enter a valid email"),
    password:z.string().min(6,"password must be alteast length 6")
})

const login=async(req,res) =>{
    const result=loginSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            error:result.error.issues[0].message
        })
    }

    try{
        const {email,password}=result.data;
        const existUser=await User.findOne({email});
        if(!existUser){
            return res.status(401).json({
                error:"Invalid User details"
            })
        }
        const isMatch=await bcrypt.compare(password,existUser.password);
        if(!isMatch){
            return res.status(401).json({
                error:"Invalid User details"
            })
        }

        const token=jwt.sign({userId:existUser._id},process.env.JWT_SECRET,{ expiresIn: "7d" });
        return res.status(200).json({
            message:"Login Successfull",
            token,
            role:existUser.role
        })
    }
    catch(error){
        return res.status(500).json({
            error:"Internal Server Error",
            msg:error.message
        })
    }
}
module.exports={register,login};