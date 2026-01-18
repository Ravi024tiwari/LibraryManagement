import User from "../Models/UserModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

//agar role bhejga to thik nhi to vo to student hi hai
const register =async(req,res)=>{
    try {
        const {name,email,password,role} =req.body;
        if(!name || !email || !password ){
            return res.status(400).json({
                message:"please filled all the credentials",
                success:false
            })
        }
        //after getting all credetinal
        const userExists  =await User.findOne(({email}));

        if(userExists){
            return res.status(400).json({
                message:"Account is already exit ..pls enter different email",
                success:false
            })
        }
        //agar user phle se exit nhi krta hai to hash the passwrod
        const hashpassword =await bcrypt.hash(password, 10) //here its hash those password into it

        const user =await User.create({
             name,
             email,
             role,
             password:hashpassword
        })

        return res.status(201).json({
            message:"User registerd successfully",
            success:true,
            user
        })
        
    } catch (error) {
        console.log('Registration failed:',error);
        return res.status(500).json({
            message:"User registation failed",
            success:false
        })
    }
}

const login =async(req,res)=>{
    try {
        const {email,password} =req.body;//hre we get the login credentials

        if(!email || !password){
            return res.status(400).json({
                message:"Please filled all credentials",
                success:false
            })
        }
        //here we firlty find the user
        const user =await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"User account not exit..please enter the correct credentials",
                success:false
            })
        }
        //now mtlb user exit kr rha hai now we cpre password
        const isPasswordCorrect =await bcrypt.compare(password, user.password);//here we compare the password
        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"please enter the valid credentials",
                success:false
            })
        }

        //agar passwrod bhi correct hai now we create token 
        const token =jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'1d'})

        res.cookie("token",token,{
            httpOnly:true,
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message:"User login successfully",
            success:true,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                totalFineDue: user.totalFineDue
            }
        })
    } catch (error) {
        console.log('login failed:',error);
        return res.status(500).json({
            message:"User login failed",
            success:false
        })
    }
}

const logout =async(req,res)=>{
    try {
        res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
  });

  res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log('logout failed:',error)
        return res.status(500).json({
            success:false,
            message:"logout failed"
        })
    }
}


export {register,login,logout}