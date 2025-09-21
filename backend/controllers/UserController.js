import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import 'dotenv/config'

//login user
const loginUser = async (req,res) => {
     const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false,message:"User doesnt exist...!"});
        }
        const ismatch = await bcrypt.compare(password,user.password);

        if (!ismatch){
            return res.json({success:false,message:"Invalid Credentials..!!"});
        }
        const token = createToken(user._id);
        res.json({success:true,token});
    }
    catch(error) {
        console.log(error)
        return res.json({success:false,message:"Error"})
    }
}
const createToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY)
}

//register user
const registerUser  = async(req,res) =>{
    // console.log("Request body:", req.body);
    const {name,password,email} = req.body;
    try {
        //check if user already exists
        const exists= await userModel.findOne({email});
        if (exists) {
            return res.json({success:false, message:"User already exists..!!"})
        }
        if (password.length<8){
            return res.json({success:false, message:"Please enter a strong password"})
        }

        if (!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter valid email"})
        }

        //hasing user password
        const salt = await bcrypt.genSalt(10); //generating a salt before hashing
        const hashedPassword = await bcrypt.hash(password,salt);//adding the salt to the orginal password and hashing

        const newUser = new userModel({
            name:name,
            email: email,
            password: hashedPassword
        })
        const user = await newUser.save();
        const token = createToken(user._id)

        res.json({success:true,token});
    } catch(error) {
        console.log(error)
        return res.json({success:false,message:"Error"})
    }
}


export {loginUser,registerUser}