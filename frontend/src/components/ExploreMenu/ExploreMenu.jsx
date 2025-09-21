import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'
const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore Our Menu</h1>
        <p className='explore-menu-description'>From sizzling starters to mouthwatering mains and decadent desserts, our diverse menu offers something for every craving. Whether you're in the mood for spicy street food, hearty comfort meals, or healthy bites, we've got you covered. Browse by cuisine, dietary preferences, or chef specials — and discover flavors you’ll love with every click.</p>
        <div className='explore-menu-list'>
            {menu_list.map((item,index)=>{
                return (
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name ? 'All':item.menu_name)} key={index} className='explore-menu-list-item' >
                        <img className={category===item.menu_name ? 'active' : ''} src={item.menu_image} alt='' />
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
        <hr/>
    </div>
  )
}

export default ExploreMenu