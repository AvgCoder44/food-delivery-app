import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {cartItems,food_list,cartTotal,removeFromCart,url} = useContext(StoreContext);
  const navigate = useNavigate();
  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-items-title'>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Action/Remove</p>
        </div>
        <br/>
        <hr/>
        {food_list.map((item,index)=>{
          if (cartItems[item._id]>0)
          {
            return (
              <div>
              <div className='cart-items-title cart-item'>
                <img src={url+"/images/"+item.image} alt="" />
                <p>{item.name}</p>
                <p>₹{(item.price*10).toLocaleString("en-IN")}</p>
                <p>{cartItems[item._id]}</p>
                <p>₹{(cartItems[item._id]*item.price*10).toLocaleString("en-IN")}</p>
                <p className='cart-item-remove'><button onClick={()=>removeFromCart(item._id)}>Remove</button></p>
              </div>
              <hr/>
              </div>
            )
          }
        })}
      </div>
      <div className='cart-bottom'>
        <div className='cart-total-amount'>
          <h2>Total Cart Amount</h2>
          <div className='cart-total-details'>
            <p>Subtotal</p>
            <p>₹{cartTotal()*10}</p>
          </div>
          <hr/>
          <div className='cart-total-details'>
            <p>Delivery Fee</p>
            <p>₹{cartTotal()===0?0:20}</p>
          </div>
          <hr/>          
          <div className='cart-total-details'>
            <p>Total</p>
            <p>₹{cartTotal()===0?0:cartTotal()*10 +20}</p>
          </div>
          <hr/>
          <button onClick={()=>navigate('/order')}  className='cart-checkout-btn'>Proceed to Checkout</button> 
        </div>
        <div className=' cart-promo-code'>
          <div>
            <p>Have a promo code? Enter it here!!</p>
            <div className='cart-promo-code-input'>
              <input type="text" placeholder='Enter Promo Code' />
              <button>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart