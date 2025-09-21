import jwt from "jsonwebtoken";


const authMiddleware = async(req,res,next)=>{
    const {token} = req.headers;
    // console.log(req)
    if (!token){
        return res.json({success:false,message:"Unauthorized user Login First..!!"})
    } 
    try{
        const token_decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.body.userId = token_decode.id;
        next();
    }
    catch(error){
        console.log("JWT Error:", error.message);
        return res.json({success:false,message:"Invalid Token"});
    }
}


export default authMiddleware;