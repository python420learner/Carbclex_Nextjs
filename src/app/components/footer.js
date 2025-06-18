import React from 'react'
import logo from "../../../public/Assets/Logo-footer.png"
import "./css/footer.css"
import Image from 'next/image';


const Footer = () => {
  return (
    <div className='footer' style={{backgroundColor:'#18311D'}}>
      <div className='footer-head'>
        <div>
          <h3>SERVICES</h3>
          <ul>
              <li>OFFSET PLANNING</li>
              <li>CLIMATE CONSULTING</li>
              <li>CARBON CREDITS</li>
          </ul>
        </div>
        <div>
          <h3>PROJECTS</h3>
          <ul>
              <li>RENEWABLE ENERGY</li>
              <li>COMMUNTIY PROJECTS</li>
              <li>FORESTATION PROJECTS</li>
              <li>ENERGY EFFICIENCY</li>
              <li>SUSTAINABLE FARMING</li>
              <li>METHANE CAPTURE</li>
              <li>CARBON CAPTURES</li>
          </ul>
        </div>
        <div>
          <h3>ABOUT US</h3>
          <ul>
              <li>OUR TEAM</li>
              <li>OUR VALUE</li>
              <li>OUR MISSION</li>
              <li>OUR APPROACH</li>
              <li>SITE MAP</li>
              <li>PRIVACY POLICY</li>
              <li>TERMS OF SERVICE</li>
          </ul>
        </div>
        <div>
          <h3>FOR SUPPLIER</h3>
          <ul>
              <li>PROJECT REGISTRATION</li>
              <li>SUPPLIER&apos;S GUIDE</li>
          </ul>
        </div>
      </div>
      <div style={{color:'white',width:'fit-content',marginInline:'auto',textAlign:'center',paddingBottom:'5rem'}}>
        <Image src={logo} alt="carbclex_logo" width={'70%'}/>
      </div>
    </div>
  )
}

export default Footer
