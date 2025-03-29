'use client';
import category from '../../../public/Assets/project_category.png'
import CTA from '../components/cta';
import ProductList from '../components/productlist'
import RouteTracker from '../components/RouteTracker';
import './page.css'
import Image from "next/image";



const MarketPlace = () => {
    return (
        <>
            {/* <RouteTracker/> */}
            <div className='market' style={{backgroundColor:'#F4FFF6',marginBottom:'10rem'}}>   
                <div className='intro'>
                    <p style={{color:'#18311D',fontWeight:'bold'}}>Shape Greener Future:</p>
                    <h1 className='t-white lspace' style={{color:'#18311D'}}>Trade Verified <br/> Carbon Credits</h1>
                </div>
                <div className='categories' style={{margin:'4rem 1rem',width:'80vw',marginInline:'auto'}}>
                    <h3 style={{marginBottom:'2rem'}} >Browse By category</h3>
                    <div style={{width:'80%',marginInline:'auto'}}>
                        <Image src={category} style={{width:'100%',height:'100%'}} alt='categories' />

                    </div>
                </div>
                <div style={{margin:'8rem 2rem',width:'80vw',marginInline:'auto' }}>
                    <h3 className='lspace' style={{color:'#2F4834',fontSize:'large' }}>ALL CATEGORIES</h3>
                    <ProductList/>
                </div>
            </div>
            <CTA/>
        </>
    )
}

export default MarketPlace;