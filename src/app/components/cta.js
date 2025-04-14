import React from 'react'
import "./css/cta.css"

const CTA = () => {
  return (
    <>
        <div className='cta'>
            <div className='info'>
                <div className='cta_hero'>
                    <h2 style={{fontWeight:'bold',letterSpacing:'2px',marginBottom:'.8rem'}}>ARE YOU A 
                    PROJECT DEVELOPER?</h2>
                    <p style={{marginBottom:'2rem'}}>We unite carbon offset suppliers and global buyers, creating a seamless connection that bridges the gap between environmental projects and businesses striving for sustainability.</p>
                    <p style={{marginTop:'4rem'}}>Bring your carbon offset project to life on our secure marketplace with our streamlined 4-step process.</p>
                </div>
                <div className='progress_body'>
                    <div className="progress-container">
                        <div className="progress-bar"></div>
                        <div className="step">
                            <div className="circle_cta"></div>
                            <div className="text">Create An Account</div>
                        </div>
                        <div className="step">
                            <div className="circle_cta"></div>
                            <div className="text">Submit Project Details</div>
                        </div>
                        <div className="step">
                            <div className="circle_cta"></div>
                            <div className="text">Verification & Validation</div>
                        </div>
                        <div className="step">
                            <div className="circle_cta"></div>
                            <div className="text">Go live on Marketplace</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='register'>
                <h3 style={{fontWeight:'500',fontSize:'2.3rem'}}>Monetize Your Eco-Friendly Efforts: </h3>
                <h3 style={{fontWeight:'lighter',marginBottom:'4rem',letterSpacing:'1px'}}>Sell Carbon Credits with ease</h3>
                <button style={{border:'2px solid white',color:'white',borderRadius:'15px',padding:'0.7rem 3rem',backgroundColor:'transparent',fontSize:'1.2rem'}}>REGISTER PROJECT</button>
            </div>
        </div>
    </>
  )
}

export default CTA
