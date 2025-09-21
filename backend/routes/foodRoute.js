import express from "express";
import { addFood, listFood,removeFood } from "../controllers/foodController.js";
import multer from "multer";//using this we create an image storage system

const foodRouter = express.Router();//foodRouter using this get method post menthods...

// image storage engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single('image'), addFood)
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood)

export default foodRouter;