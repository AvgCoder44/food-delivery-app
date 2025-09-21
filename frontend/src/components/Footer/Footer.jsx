import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className='footer-content-left'>
                <img src={assets.logo} alt="" />
                <p>Food provides essential nutrients for overall health and well-being</p>
                <div className='footer-content-left-social-media'>
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />

                </div>
            </div>
            <div className='footer-content-center'>
                <h2>COMPANY</h2>
                <ul>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>
                    <li>Terms & Conditions</li>
                </ul>
            </div>
            <div className='footer-content-right'>
                <h2>
                    Get in touch
                </h2>
                <ul>
                    <li>+81******78</li>
                    <li>food@gmail.com</li>
                    <li>123, Main Street, Anytown, USA</li>
                </ul>
            </div>
        </div>
        <hr/>
        <p className="footer-copyright">Copyright © 2025 Food. All rights reserved.</p>
    </div>
  )
}

export default Footer