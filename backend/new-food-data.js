// New food items to be added to the database
// Add your new food items here and run bulk-upload.js

export const newFoodData = [
    // Example new food items - replace with your actual data
    { name: "Veg Pizza", image: "pizza_1.png", price: 18, description: "Classic tomato and mozzarella pizza", category: "Pizza" },
    { name: "Paneer Pepperoni Pizza", image: "pizza_2.png", price: 22, description: "Spicy paneer pepperoni with cheese", category: "Pizza" },
    { name: "BBQ Chicken Pizza", image: "pizza_3.png", price: 24, description: "BBQ sauce with grilled chicken", category: "Pizza" },
    { name:  "Chicken Burger Combo", image: "chicken_burgir_combo.png", price: 20, description: "Double the taste, double the value! Enjoy two tender chicken burgers with crisp lettuce, tomatoes, and our signature sauce – perfect for friends or a hungry you.", category: "Burgers" }
    // Add more food items here...
    // { name: "Food Name", image: "image_file.png", price: 15, description: "Food description", category: "Category" },
];

// Instructions:
// 1. Add your new food items to the newFoodData array above
// 2. Make sure the image files are placed in the 'uploads' folder
// 3. Run: node bulk-upload.js
// 4. The script will only add new items and skip duplicates
