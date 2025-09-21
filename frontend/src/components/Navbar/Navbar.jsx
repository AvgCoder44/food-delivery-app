import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({setShowLogin}) => {
  const [menu,setMenu] = useState("Menu");
  const {cartTotal,token,setToken} = useContext(StoreContext);
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' })}
  const navigate = useNavigate();
  
  const handleMenuClick = (menuName, sectionId) => {
    setMenu(menuName);
    if (window.location.pathname !== '/') {
      // If not on home page, navigate to home first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  const logOut = ()=>{
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }
  return (
    <>
      <div className="navbar">
          <Link to="/"><img src={new URL(assets.logo, import.meta.url).href} alt="" className="logo" /></Link>
          <ul className="navbar-menu">
            <Link to="/" onClick={()=>setMenu("Home")} className={menu=="Home"?"active":""} >Home</Link>
            <a href="#" onClick={()=>handleMenuClick("Menu", "explore-menu")} className={menu=="Menu"?"active":""} >Menu</a>
            <a href="#" onClick={()=>handleMenuClick("Mobile app", "app-download")} className={menu=="Mobile app"?"active":""} >Mobile app</a>
            <a href="#" onClick={()=>handleMenuClick("Contact us", "footer")} className={menu=="Contact us"?"active":""} >Contact us</a>
          </ul>
          <div className="navbar-right">
            <img src={new URL(assets.search_icon, import.meta.url).href} alt="" />
            <div className="navbar-search-icon">
              <Link to="/cart"><img src= {new URL(assets.basket_icon, import.meta.url).href}/></Link>
                <div className={cartTotal()===0?"":"dot"}/>
            </div>
            {!token?<button onClick={()=>setShowLogin(true)}>Sign in</button>:
            <div className='navbar-profile'>
              <img src={assets.profile_icon} alt="" />
              <ul className="nav-profile-dropdown">
                <li onClick={()=>navigate("/myorders")}><img src={assets.bag_icon} alt=''/><p>Orders</p> </li>
                <hr/>
                <li onClick={logOut}><img src={assets.logout_icon} alt=''/><p>Logout</p> </li>
              </ul>
            
            </div>}
          </div>
          <button onClick={scrollToTop} className="top-btn">Top ↑</button>
      </div>
    </>
  )
}

export default Navbar
