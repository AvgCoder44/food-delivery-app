
import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const {cartTotal,token,food_list,cartItems,url} = useContext(StoreContext)

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })
  const onChangeHandler = (event) =>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))
  }
  const PlaceOrder = async (event)=>{
    event.preventDefault();
    let orderItems=[];
    food_list.map((item)=>{
      if(cartItems[item._id]>0){  
        let itemInfo= item;
        itemInfo["quantity"]=cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    let orderData={
      address:data,
      items:orderItems,
        amount:cartTotal()+20
    }
    let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
    if (response.data.success){
      const {order_id, amount, currency} = response.data;
      
      // First create order in database
      try {
        const orderData = {
          address: data,
          items: orderItems,
          amount: cartTotal() + 20
        };
        const orderResponse = await axios.post(url+"/api/order/create", orderData, {headers:{token}});
        const dbOrderId = orderResponse.data.orderId;
        
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Environment variable
            amount: amount * 100,
            currency: currency,
            name: 'Food Delivery App',
            order_id: order_id,
            handler: async function (response) {
              // Redirect to verify page with payment details
              window.location.href = `/verify?success=true&orderId=${dbOrderId}`;
            },
            modal: {
              ondismiss: function() {
                // Redirect to verify page on cancellation
                window.location.href = `/verify?success=false&orderId=${dbOrderId}`;
              }
            },
          prefill: {
            name: data.firstName + ' ' + data.lastName,
            email: data.email,
            contact: data.phone
          },
          notes: {
            address: data.address
          },
          theme: {
            color: "#ff6b35"
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Error creating order. Please try again.');
      }
    } else{
      alert("error",response.data.message);
    }
  }
  const navigate = useNavigate();
  useEffect(()=>{
    if (!token){
      navigate("/cart");
    } else if (cartTotal()==0){
      navigate("/cart");
    }
  },[token])
  return (
    <form onSubmit={PlaceOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title"> Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name"/>
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName}type="text" placeholder="Last Name"/>
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Email Address"/>
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder="Street"/>
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder="City"/>
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder="State"/>
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip Code"/>
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder="Country"/>
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type ="text" placeholder="Phone"/>
      </div>
      <div className="place-order-right">
        <div className='cart-bottom'>
        <div className='cart-total-amount'>
          <h2>Total Cart Amount</h2>
          <div className='cart-total-details'>
            <p>Subtotal</p>
            <p>₹{cartTotal()}</p>
          </div>
          <hr/>
          <div className='cart-total-details'>
            <p>Delivery Fee</p>
            <p>₹{cartTotal()===0?0:20}</p>
          </div>
          <hr/>          
          <div className='cart-total-details'>
            <p>Total</p>
            <p>₹{cartTotal()===0?0:cartTotal() +20}</p>
          </div>
          <hr/>
        </div>
        </div>
        <button type="submit" className='place-order-btn'>Proceed to Payment</button> 
      </div>
    </form>      
  )
}

export default PlaceOrder