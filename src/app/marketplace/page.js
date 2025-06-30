'use client';
import category from '../../../public/Assets/project_category.png'
import CTA from '../components/cta';
import ProductList from '../components/productlist'
import { useState, useEffect } from 'react';
import RouteTracker from '../components/RouteTracker';
import './page.css'
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import Image from "next/image";
import heroImage from "../../../public/Assets/marketplace.png"

const MarketPlace = () => {
    const [hasScrolled_market, setHasScrolled_market] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
          // Check if user has scrolled vertically
          if (window.scrollY > 0) {
            setHasScrolled_market(true);
          } else {
            setHasScrolled_market(false);
          }
        };
      
        // Add the event listener inside the effect
        window.addEventListener('scroll', handleScroll);
      
        // Cleanup the event listener when the component unmounts
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
    return (
        <div >
            {/* <RouteTracker/> */}
            <div className='market' style={{marginBottom:'10rem'}}>   
              <div className='marketplace' style={{height:'90vh'}} >
                <div className={`nav_bar ${hasScrolled_market ? 'nav_background' : ''}`} id='navbar' >
                        <Navbar />
                </div>
                <div className='intro'>
                    <p style={{color:'#18311D',fontWeight:'bold'}}>Shape Greener Future:</p>
                    <h1 className='t-white lspace' style={{color:'#18311D'}}>Trade Verified <br/> Carbon Credits</h1>
                </div>

              </div>
                <div className='categories' style={{margin:'4rem 1rem',width:'80vw',marginInline:'auto'}}>
                    <h3 style={{marginBottom:'2rem'}} >Browse By category</h3>
                    <div style={{width:'80%',marginInline:'auto'}}>
                        <Image src={category} style={{width:'100%',height:'100%'}} alt='categories' />

                    </div>
                </div>
                <div className='mx-auto' style={{marginBlock:'8rem',width:'80vw' }}>
                    <h3 className='lspace' style={{color:'#2F4834',fontSize:'large' }}>ALL CATEGORIES</h3>
                    <ProductList/>
                </div>
            </div>
            <CTA/>
            <Footer/>
        </div>
    )
}

export default MarketPlace;