import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Verify = () => {
    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const {url, token} = useContext(StoreContext);
    const navigate = useNavigate();
    
    const verifyPayment = async()=>{
        try {
            // Get token from localStorage to ensure we have it
            const authToken = localStorage.getItem("token");
            
            if (!authToken) {
                alert("Please login first");
                navigate('/');
                return;
            }

            const response = await axios.post(url+"/api/order/verify",{
                success,
                orderId
            },{ 
                headers: {token: authToken} 
            });
            
            // In Verify.jsx after successful payment
            if (response.data.success){
                // Clear Razorpay's localStorage items
                localStorage.removeItem('rzp_checkout_anon_id');
                localStorage.removeItem('rzp_device_id');
                localStorage.removeItem('rzp_stored_checkout_id');
                
                alert("Payment successful! Order confirmed.");
                navigate('/myorders');
            } else {
                alert("Payment failed or cancelled.");
                navigate('/');
            }
        } catch (error) {
            console.error('Verification error:', error);
            alert("Error verifying payment");
            navigate('/');
        }
    }

    useEffect(()=>{
        verifyPayment();
    },[]);

  return (
    <div className='verify'>
    <div className='Spinner'/>
        Verify
    </div>
  )
}

export default Verify