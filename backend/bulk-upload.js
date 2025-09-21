import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import foodModel from './models/foodModel.js';
import { newFoodData } from './new-food-data.js';
import 'dotenv/config';

// Use the new food data from the separate file
const foodData = newFoodData;

const bulkUpload = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Check for existing food items (don't clear them)
        const existingCount = await foodModel.countDocuments({});
        console.log(`📊 Found ${existingCount} existing food items in database`);

        // Insert food items directly into database
        let addedCount = 0;
        let skippedCount = 0;
        
        for (let i = 0; i < foodData.length; i++) {
            const food = foodData[i];
            
            // Check if food item already exists (by name and category)
            const existingFood = await foodModel.findOne({ 
                name: food.name, 
                category: food.category 
            });
            
            if (existingFood) {
                console.log(`⏭️ Skipped: ${food.name} (already exists in ${food.category})`);
                skippedCount++;
                continue;
            }
            
            const imagePath = path.join('./uploads', food.image);
            
            // Check if image file exists
            if (!fs.existsSync(imagePath)) {
                console.log(`❌ Image not found: ${food.image}`);
                continue;
            }

            // Add timestamp to filename (same as multer does)
            const timestamp = Date.now();
            const timestampedFilename = `${timestamp}${food.image}`;
            
            // Rename the file to add timestamp
            const newImagePath = path.join('./uploads', timestampedFilename);
            fs.renameSync(imagePath, newImagePath);
            
            // Create food item with timestamped filename
            const newFood = new foodModel({
                name: food.name,
                description: food.description,
                price: food.price,
                image: timestampedFilename,
                category: food.category
            });
            
            await newFood.save();
            addedCount++;
            console.log(`✅ Added: ${food.name} (${i + 1}/${foodData.length})`);
        }

        console.log('🎉 Bulk upload completed!');
        console.log(`📈 Summary: ${addedCount} items added, ${skippedCount} items skipped`);
        mongoose.connection.close();
        
    } catch (error) {
        console.error('❌ Error during bulk upload:', error.message);
        mongoose.connection.close();
    }
};

bulkUpload();
