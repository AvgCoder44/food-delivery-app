import { error } from "console";
import foodModel from "../models/foodModel.js";
import fs from 'fs';
import { response } from "express";

// add food item

const addFood = async(req,res)=>{
    try {
        const { name, description, price, category } = req.body;
        
        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        
        const image = req.file.filename;
        
        const newFood = new foodModel({
            name,
            description,
            price,
            image,
            category
        });
        
        await newFood.save();
        res.status(201).json({ success: true, message: "Food added successfully", data: newFood });
    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ success: false, message: "Error adding food", error: error.message });
    }
}
//all food list
const listFood= async(req,res)=>{
    try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch{
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}
//remove food item
const removeFood = async (req,res)=>{
    try{
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({success:false,message:"Food item not found"});
        }
        fs.unlink(`uploads/${food.image}`,()=>{})
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Food removed"})
    } catch (error){
        console.log(error);
        return res.json({success:false,message:"Error"});
    }

}
export {addFood,listFood,removeFood};

