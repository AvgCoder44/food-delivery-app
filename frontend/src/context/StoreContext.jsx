import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "http://localhost:4000"  
    const [token,setToken] = useState("");
    const [food_list,setFoodList] = useState([]);
    const [cartItems,setCartItems] = useState({});
    const addToCart = async(itemId) => {
        if (!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}));
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if (token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}});
        }
    }
    const removeFromCart = async(itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))  
        if (token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
        }
    }
    const removeItemCompletely = async(itemId) => {
        setCartItems((prev)=>{
            const newCart = {...prev};
            delete newCart[itemId];
            return newCart;
        });
        if (token){
            // Call remove API multiple times to completely remove the item
            const currentQuantity = cartItems[itemId] || 0;
            for (let i = 0; i < currentQuantity; i++) {
                await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
            }
        }
        // Also update localStorage
        const newCartItems = {...cartItems};
        delete newCartItems[itemId];
        localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    }
    const cartTotal = () => {
        let totalamt = 0;
        for (const item in cartItems){
            if (cartItems[item]>0) {
                let iteminfo = food_list.find((product)=>product._id===item);
                totalamt += iteminfo.price*cartItems[item];
            }
        }
        return totalamt;
    }

    const fetchFoodList = async ()=>{
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }

    // ... existing code ...
    const localCartData = async (token) =>{
        try {
            const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
            console.log("Cart data response:", response.data); // Debug log
            if (response.data && response.data.cartData) {
                setCartItems(response.data.cartData);
            } else {
                console.log("No cart data found in response");
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }
    // ... existing code ...
    useEffect(()=>{
        async function loaddata(){ 
            await fetchFoodList();
            if (localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await localCartData(localStorage.getItem("token"))
            }
        }
        loaddata(); 
    },[])

    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        removeItemCompletely,
        cartTotal,
        url,
        token,
        setToken
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    ) 
}

export default StoreContextProvider