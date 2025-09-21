import React from 'react'
import './MyOrders.css'
import { useState,useContext } from 'react'
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from 'axios';
import { useEffect } from 'react';
import { assets } from '../../assets/assets';
  

const MyOrders = () => {
  const {url,token} = useContext(StoreContext);
  const [data,setData] = useState([]);

  const fetchData = async()=>{
    const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
    setData(response.data.data); 
  }
  useEffect(()=>{
    if (token){
      fetchData();
    }
  },[token]);
  console.log(data);
  return (
    <div className='myorders'>
      <h2>My Orders</h2>
      <div className='container'>
        {data.map((order,index)=>{
          return (
            <div key={index} className='my-order-class'>
              <img src={assets.parcel_icon} alt="" />
              <p>{order.items.map((item,index)=>{
                  if (index==order.items.length-1){
                    return item.name + " x "+ item.quantity;
                  }
                  else{
                    return item.name + " x "+ item.quantity + ", ";
                  }
              })}</p>
              <p>₹{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span></span>  <b>{order.status}</b></p>
              <button onClick={fetchData}>Track Order</button>
            </div>
          )
        })}
      </div>
      <p>Your orders will be displayed here.</p>
    </div>
  )

}

export default MyOrders