import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"


const LoginPopup = ({setShowLogin}) => {
    const {url,setToken} = useContext(StoreContext)
    const [data,setData] = useState({
        name:"",
        email:"",
        password:"",
    })

    const onChangeHandler = (event)=>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }
    const onLogin = async (event)=>{
        event.preventDefault();
        let newurl = url;
        if (curState==="Login"){
            newurl+="/api/user/login"
        } else {
            newurl+="/api/user/register"
        }

        const response = await axios.post(newurl,data);

        if (response.data.success){
            setToken(response.data.token);
            localStorage.setItem("token",response.data.token);
            setShowLogin(false);
        } else {
            alert(response.data.message);
        }
    }

    const [curState,setCurState] = useState("Login");
    return (
        <div className='login-popup'>
            <form  onSubmit={onLogin} className='login-popup-container'>
                <div className='login-popup-title'>
                    <h2>{curState}</h2>
                    <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className='login-popup-input'>
                    {curState==="Login"?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your Name' required/>}
                    <input  name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required/>
                    <input  name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required/>
                </div>
                <button type='submit'>
                    {curState==="Sign Up"?"Create Account":"Login"}
                </button> 
                <div className='login-popup-condition'>
                    <input type="checkbox" />
                    <p>I agree to the <span>Terms & Conditions</span></p>
                </div>
                {curState==="Login"?
                    <p>Don't have an account? <span onClick={()=>setCurState("Sign Up")}>Sign Up</span></p>
                    :<p>Already have an account? <span onClick={()=>setCurState("Login")}>Login</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup