'use client'

import Footer from '../components/footer';
import logo from '../../../public/Assets/Logo_header.png'
import Calculator_card from '../components/calculator_card';
import coal from '../../../public/Assets/coal.png'
import electric from '../../../public/Assets/Vector.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faLocationDot, faLock, faUsersLine, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import petrol from '../../../public/Assets/petrol.png'
import Image from 'next/image';
import cng from '../../../public/Assets/cng.png'
import { useState, useEffect } from 'react';
import './page.css'
import Navbar from '../components/Navbar';

const CalculatorPage = () => {

  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
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

  const handleNext = () =>{
    if(activeTab<4){
      let at = activeTab
      at++
      setActiveTab(at)

    }
  }
  const handlePrev = () =>{
    if(activeTab>0){
      let at = activeTab
      at--
      setActiveTab(at)

    }
  }

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className='calculator'>
      <div className='cal_nav'>
        <div className="dropdown">
          <div className="dropdown-header">
            <span className="dropdown-title"><FontAwesomeIcon icon={faLocationDot} color='#EEEACD' size='sm' style={{ marginRight: '15px' }} />Location</span>
            <span></span>
          </div>
        </div>
        <div className="dropdown">
          <div className="dropdown-header" onClick={toggleDropdown}>
            <span className="dropdown-title"><FontAwesomeIcon icon={faGasPump} color='#EEEACD' size='sm' style={{ marginRight: '15px' }} />Direct Emissions</span>
            <span className={`dropdown-icon ${isOpen ? 'rotate' : ''}`}>▼</span>
          </div>
          <ul className={`dropdown-menu ${isOpen ? 'show' : 'hide'}`}>
            <li onClick={() => setActiveTab(0)} className={`${activeTab == 0 ? "active_tab" : ''}`}>Stationary Combustion</li>
            <li onClick={() => setActiveTab(1)} className={`${activeTab == 1 ? "active_tab" : ''}`}>Mobile Combustion</li>
            <li onClick={() => setActiveTab(2)} className={`${activeTab == 2 ? "active_tab" : ''}`}>Fugitive Emissions</li>
            <li onClick={() => setActiveTab(3)} className={`${activeTab == 3 ? "active_tab" : ''}`}>Onsite emissions</li>
            <li onClick={() => setActiveTab(4)} className={`${activeTab == 4 ? "active_tab" : ''}`}>Biomass combustion</li>
          </ul>
        </div>
        <div className="dropdown">
          <div className="dropdown-header" >
            <span className="dropdown-title"><Image src={electric} alt='svg' width={20} height={20} style={{marginRight:'15px'}}/>Indirect Emissions</span>
            <span className={`dropdown-icon ${isOpen ? 'rotate' : ''}`}>▼</span>
          </div>
          <ul className={`dropdown-menu ${isOpen ? 'show' : 'hide'}`}>

          </ul>
        </div>
        <div className="dropdown">
          <div className="dropdown-header">
            <span className="dropdown-title"><FontAwesomeIcon icon={faUsersLine} color='#EEEACD' size='sm' style={{ marginRight: '15px' }} />Other Indirect Emissions<FontAwesomeIcon icon={faLock} color='#EEEACD' size='sm' style={{ marginLeft: '130px' }} /></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className='calculator_right' style={{}}>
      <div className={`nav_bar ${hasScrolled_market ? 'nav_background' : ''}`} id='navbar' >
                        <Navbar />
          </div>
        <div className={`stationary ${activeTab == 0 ? "dis_block" : 'dis_none'}`} >
          <div className='fuel emission'>
            <h1 style={{ color: '#033614' }}>Fuel emission</h1>
            <div style={{ display: 'flex', width: '60vw', justifyContent: 'space-around', marginTop: '2rem' }}>
              <Calculator_card
                title="Diesel"
                image={petrol}
                color1="#4CAF50"
                color2="#8BC34A"
                quantity="00000"
                source="IPCC Guidelines"
                factor="1.08"
              />
              <Calculator_card
                title="Gasoline/Petrol"
                image={petrol}
                color1="#36D4A1"
                color2="#13A0AA"
                quantity="00000"
                source="IPCC Guidelines"
                factor="1.08"
              />
            </div>
          </div>
          {/* <div style={{ width: 'fit-content', marginInline: 'auto' }}>
            <button className='next_button'>Next</button>
          </div> */}
          <div className='gas emission'>
            <h1 style={{ color: '#033614' }}>Gas emission</h1>
            <div style={{ display: 'flex', width: '60vw', justifyContent: 'space-around', marginTop: '2rem' }}>
              <Calculator_card
                title="Coal"
                image={coal}
                color1="#58646E"
                color2="#161C23"
                quantity="00000"
                source="GHG Guidelines"
                factor="5.67"
              />
              <Calculator_card
                title="Coal"
                image={coal}
                color1="#58646E"
                color2="#161C23"
                quantity="00000"
                source="GHG Guidelines"
                factor="5.67"
              />
              <Calculator_card
                title="Coal"
                image={coal}
                color1="#58646E"
                color2="#161C23"
                quantity="00000"
                source="GHG Guidelines"
                factor="5.67"
              />

            </div>
          </div>

          <div className='coal emission'>
            <h1 style={{ color: '#033614' }}>Coal emission</h1>
            <div style={{ display: 'flex', width: '60vw', justifyContent: 'space-around', marginTop: '2rem' }}>
              <Calculator_card
                title="Coal"
                image={coal}
                color1="#58646E"
                color2="#161C23"
                quantity="00000"
                source="GHG Guidelines"
                factor="1.08"
              />
            </div>
          </div>
        </div>
        <div className={`mobile ${activeTab == 1 ? "dis_block" : 'dis_none'}`}>
          <div className='fleet emission'>
            <h1 style={{ color: '#033614' }}>Fleet emission</h1>
            <div style={{ display: 'flex', width: '60vw', justifyContent: 'space-around', marginTop: '2rem' }}>
              <Calculator_card
                title="Heavy Vehicles"
                image={petrol}
                color1="#4CAF50"
                color2="#8BC34A"
                quantity="00000"
                source="IPCC Guidelines"
                factor="1.08"
              />
              <Calculator_card
                title="Light Vehicles"
                image={petrol}
                color1="#36D4A1"
                color2="#13A0AA"
                quantity="00000"
                source="IPCC Guidelines"
                factor="2.07"
              />
              <Calculator_card
                title="Passenger Car"
                image={cng}
                color1="#EA8C03"
                color2="#EF4506"
                quantity="00000"
                source="IPCC Guidelines"
                factor="1.08"
              />
            </div>
          </div>
        </div>
        <div className='btns' style={{width:'fit-content',marginInline:'auto',marginBottom:'10rem'}}>
          <button className='prev_button' onClick={()=>handlePrev()} style={{}}>
          <FontAwesomeIcon icon={faArrowLeft} color='white' size='x' /></button>
          <button className='next_btn' onClick={()=>handleNext()}>NEXT</button>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default CalculatorPage;