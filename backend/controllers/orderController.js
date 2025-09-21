import orderModel from "../models/orderModel.js";
import userModel from "../models/UserModel.js";
import Razorpay from "razorpay";

const frontend_url = "http://localhost:5174";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

//creating payment order (not saving to database yet)
const placeOrder = async(req,res)=>{
    try{
        const options = {
            amount: req.body.amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `temp_${Date.now()}`, // Temporary receipt ID
            payment_capture: 1
        }
        const order = await razorpay.orders.create(options)
        res.json({success:true,order_id:order.id,amount:req.body.amount,currency:"INR"})

    } catch(error) {
        console.log(error);
        res.json({success:false,message:"Error"});

    }
}

// Create order after successful payment
const createOrder = async(req,res)=>{
    try{
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address,
            paymentId:req.body.paymentId,
            orderId:req.body.orderId
        })
        await newOrder.save();
        res.json({success:true,message:"Order created successfully",orderId:newOrder._id})
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error creating order"});
    }
}

// Verify payment and update order status
const verifyOrder = async(req,res)=>{
    try{
        const {orderId,success} = req.body;
        
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
            res.json({success:true,message:"Payment successful"})
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Payment failed"})
        }
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

// Clear cart after successful payment
const clearCart = async(req,res)=>{
    try{
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
        res.json({success:true,message:"Cart cleared successfully"})
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error clearing cart"});
    }
}
//users orders for frontend
const userOrders = async(req,res)=>{
    try{
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch(error) {
        console.log("Error")
        res.json({success:false,message:"Error"})
    }
}
//listing orders for admin panel
const listOrders = async(req,res) => {
    try{
        const orders = await orderModel.find({});
        res.json({success:true,data:orders});
    } catch(error){
        console.log(error)
        res.json({success:false,message:"Error"});
    }
}

//api for food order status update
const updateStatus=  async(req,res)=>{
    try{
       await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated Successfully"})
    } catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}


export {placeOrder,razorpay,createOrder,verifyOrder,clearCart,userOrders,listOrders,updateStatus}