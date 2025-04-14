'use client'

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnapchat, faInstagram, faYoutube, faFacebookF, faXTwitter, faUser } from '@fortawesome/free-brands-svg-icons';
import approachImg from '../../../public/Assets/Our-Approach.svg';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../components/footer';
import CTA from '../components/cta';
import off1 from "../../../public/Assets/signup.jpg";
import off2 from "../../../public/Assets/login.jpg";
import RouteTracker from '../components/RouteTracker';
import './page.css'
import ProductList from '../components/productlist';
import carousel_data from '../components/data';
import Navbar from '../components/Navbar';

const HomePage = () => {

    const [activeTab, setActiveTab] = useState(0);

    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
          // Check if user has scrolled vertically
          if (window.scrollY > 0) {
            setHasScrolled(true);
          } else {
            setHasScrolled(false);
          }
        };
      
        // Add the event listener inside the effect
        window.addEventListener('scroll', handleScroll);
      
        // Cleanup the event listener when the component unmounts
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
      


    useEffect(() => {
        const intervalId = setInterval(() => {
            // Use functional update to always get the latest state
            setActiveTab(prevTab => (prevTab === 3 ? 0 : prevTab + 1));
        }, 3000);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (

        <div className='index'>
            {/* <RouteTracker /> */}
            <div className='home-page' >
                <div className={`nav_bar ${hasScrolled ? 'nav_background' : ''}`} id='navbar' >
                    <Navbar />
                </div>
                <div className='hero'>
                    <form className="font t-white" style={{ marginLeft: '2rem' }}>
                        <h3 className='hero_heading'>Erase Carbon Footprints and Combat Global Warming.</h3>
                        <h4 style={{ marginTop: '2rem', fontWeight: 'lighter', color: 'white' }}>Transforming Industries with Authentic Carbon Neutrality Solutions,<br /> Shaping a Trustworthy Path to Net Zero.</h4>
                    </form>
                    <div className='icons' style={{ display: 'flex', flexDirection: 'column', gap: '9px',justifyContent:'flex-end' }}>
                        {/* <Link href="/dashboard"><FontAwesomeIcon icon={faUser} color='white' size='2x' /></Link> */}
                        <FontAwesomeIcon icon={faXTwitter} color='white' size='2x' />
                        <FontAwesomeIcon icon={faInstagram} color='white' size='2x' />
                        <FontAwesomeIcon icon={faYoutube} color='white' size='2x' />
                        <FontAwesomeIcon icon={faFacebookF} color='white' size='2x' />
                        <FontAwesomeIcon icon={faSnapchat} color='white' size='2x' />
                    </div>
                </div>
            </div>
            <div>
                <div className='first_page'>
                    <h1 style={{ fontWeight: 'lighter', marginBottom: '1rem', color: 'darkgreen' }}>Empower Your Business to Achieve Net Zero Emissions Today.</h1>
                    <p style={{ fontSize: '1rem', fontWeight: 'lighter' }} >We&apos;re the industry&apos;s go-to for environmental solutions, connecting buyers and sellers of carbon credits with reliability and expertise. Join us in making a real impact on our planet.</p>
                </div>
                <div>
                    <ul className='tab-list'>
                        <li className={`tab-item ${activeTab === 0 ? 'active-tab gradient-text' : ''}`}>TRANSPARENT</li>
                        <li className={`tab-item ${activeTab === 1 ? 'active-tab gradient-text' : ''}`}>ACCURATE</li>
                        <li className={`tab-item ${activeTab === 2 ? 'active-tab gradient-text' : ''}`}>CONSISTENT</li>
                        <li className={`tab-item ${activeTab === 3 ? 'active-tab gradient-text' : ''}`}>RELIABLE</li>
                    </ul>

                    <div className='sec_nav_data'>
                        <div style={{ width: '45%' }}>
                            <p style={{ color: '#454040', borderRight: '2px solid green', fontWeight: 'lighter', textAlign: 'justify', paddingRight: '3rem' }}>{carousel_data[activeTab][0]}</p>
                            <button className='b' style={{ backgroundImage: 'linear-gradient(to right, #36D4A1, #13A0AA)', color: 'white', width: '10rem', padding: '8px', marginTop: '1rem' }}>Learn More</button>
                        </div>
                        <div className='circle'>
                            <Image style={{ width: '100%',height:'100%', borderRadius: '50%' }} src={carousel_data[activeTab][1]} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="services">
                <h1 className='gradient-text' style={{ margin: '15rem 5rem',fontWeight:'600',marginBottom: '8rem',fontSize:'xxx-large', letterSpacing: '2px' }}>Calculate Carbon<br /> Impact:</h1>
                <div className="container" style={{ margin: '6rem auto', display: 'flex', flexDirection: 'column' }}>
                    <div className="services-title">
                        <h2 className='gradient-text' style={{ fontWeight: 'lighter', color: '#18311D', fontSize:'xx-large',letterSpacing: '1px', borderBottom: '2px solid #13A0AA', width: 'fit-content', marginBottom: '3rem', marginLeft:'10rem'}}>Our Services</h2>
                    </div>
                    <div className="services-cards" style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', gap: '2rem' }} >
                        <div className="card">
                            <div className="card-header one">
                                <h3>Strategic<br /> Offset Planning</h3>
                            </div>
                            <div className="card-body" style={{ backgroundColor: '#EEEACD' }}>
                                <p style={{ color: '#454040', fontWeight: 'lighter' }}>We offer blockchain-based platform that ensures visibility and traceability in</p>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header two">
                                <h3>Market<br /> Place</h3>
                            </div>
                            <div className="card-body" style={{ backgroundColor: '#EEEACD' }}>
                                <p style={{ color: '#454040', fontWeight: 'lighter' }}>We offer blockchain-based platform that ensures visibility and traceability in</p>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header three">
                                <h3>Carbon<br /> Credits</h3>
                            </div>
                            <div className="card-body" style={{ backgroundColor: '#EEEACD' }}>
                                <p style={{ color: '#454040', fontWeight: 'lighter' }}>We offer blockchain-based platform that ensures visibility and traceability in</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='gradient-background'>
                <div className='offset'>
                    <div className='offset_firstchild'>
                        <h2 className='gradient-text' style={{ color: '#18311D', fontWeight: 'lighter',fontSize:'xx-large', marginBottom: '2rem' }}>Why offset with us?</h2>
                        <p style={{ fontWeight: 'lighter' }}>With CarbClex, businesses can trust in our commitment to transparency, accuracy, and the genuine impact of our environmental projects.</p>
                    </div>
                    <div className='group1 first-offset'>
                        <p>With CarbClex, businesses can trust in our commitment to transparency, accuracy, and the genuine impact of our environmental projects.</p>
                        <div className='polygon'>
                            <div className='inner_polygon'></div>
                            <Image src={off1} alt="" />
                        </div>
                    </div>
                    <div className='group1 reverse'>
                        <p>With CarbClex, businesses can trust in our commitment to transparency, accuracy, and the genuine impact of our environmental projects.</p>
                        <div className='polygon'>
                            <div className='inner_polygon green'></div>
                            <Image src={off2} alt="" />
                        </div>
                    </div>
                    <div className='group1'>
                        <p>With CarbClex, businesses can trust in our commitment to transparency, accuracy, and the genuine impact of our environmental projects.</p>
                        <div className='polygon'>
                            <div className='inner_polygon'></div>
                            <Image src={off1} alt="" />
                        </div>
                    </div>
                </div>
                <div className="approach" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '7rem', gap: '4rem', paddingBottom: '3rem' }}>
                    <h2 className='gradient-text' style={{fontWeight:'lighter',fontSize:'xx-large'}}>Our Approach</h2>
                    <Image src={approachImg} alt="Description of SVG" style={{ width: '83%', height: '40%' }} />
                    <button className="b" style={{ width: '10rem', paddingBlock: '0.7rem', color: 'white', backgroundImage: 'linear-gradient(to right, #36D4A1, #13A0AA)' }}>Get Started</button>
                </div>
            </div>
            <div style={{ backgroundImage: 'linear-gradient(white,#ebe8d855)', marginBottom: '20rem' }}>
                <div className='products' style={{ marginTop: '10rem' }}>
                    <div className='product_head'>
                        <h2 className='gradient-text' style={{ fontWeight: 'lighter',fontSize:'xx-large' }}>Our Projects</h2>
                        <p>With CarbClex, businesses can trust in our commitment to transparency, accuracy, and the genuine impact of our environmental projects.</p>
                    </div>
                    <div style={{ height: '60%', paddingBlock: '5rem', textAlign: 'center' }}>
                        <ProductList demo={true} />
                        <div className='product_cards'>
                        </div>
                    </div>
                    <div style={{width:'fit-content',marginInline:'auto'}}>
                        <Link href='./marketplace'><button className="b" style={{ width: '10rem', paddingBlock: '0.7rem', color: 'white', backgroundImage: 'linear-gradient(to right,  #36D4A1, #13A0AA)',marginInline:'auto' }}>Visit MarketPlace</button></Link>
                    </div>
                </div>
                <div>
                    <CTA />
                </div>
                <div className='section-4'>
                    <h2 className='gradient-text' style={{fontWeight:'lighter',fontSize:'xx-large'}}>Our Objective</h2>
                    <p>We believe in building trust through transparency. Our processes are open, traceable, and designed to provide you with clear insights into your environmental impact. We believe in building trust through transparency. environmental impact.</p>
                </div>
                <div className='section-4'>
                    <h2 className='gradient-text' style={{fontWeight:'lighter',fontSize:'xx-large'}}>Our Mission</h2>
                    <p>We believe in building trust through transparency. Our processes are open, traceable, and designed to provide you with clear insights into your environmental impact. We believe in building trust through transparency. environmental impact.</p>
                </div>
                <div>
                    <div style={{ paddingBlock: '5rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex',justifyContent:'center',alignItems:'center',position:'relative', marginBottom: '3rem', width: '100%' }}>
                            <div style={{ textAlign: 'center' }}>
                                <h2 className='gradient-text' style={{ fontWeight: 'lighter', fontSize: 'xx-large' }}>Blog</h2>
                                <p style={{ width: '50vw', textAlign: 'center', marginInline: 'auto' }}>With CarbClex, businesses can trust in our commitment to transparency, accuracy, and the genuine impact of our environmental projects.</p>
                            </div>
                            <button className='b desktop-button' style={{ position:'absolute',width: '9rem', height: '50%', padding: ' 0.8rem', right: '1rem', backgroundImage: 'linear-gradient(to right, #36D4A1, #13A0AA)', color: 'white' }}>Visit our Blog</button>
                        </div>
                        <div className='product_cards'>
                            <div className='card-ele' style={{ borderRadius: '2rem' }} >
                                <div className='for_image'></div>
                                <div style={{ color: 'black', width: '100%', fontWeight: 'lighter', height: '30%',paddingTop:'1rem'}}>
                                    <h4 style={{ fontWeight: 'lighter',marginBottom:'1rem' }}>Understanding Carbon Credits:</h4>
                                    <p style={{ marginBottom: '0' }}> This guide explains how businesses and individuals can use carbon credits to offset emissions and support sustainable initiatives.</p>
                                </div>
                            </div>
                            <div className='card-ele' style={{ borderRadius: '2rem' }} >
                                <div className='for_image'></div>
                                <div style={{ color: 'black', width: '100%', fontWeight: 'lighter', height: '30%',paddingTop:'1rem'}}>
                                    <h4 style={{ fontWeight: 'lighter',marginBottom:'1rem' }}>How to Calculate Your Carbon Footprint and Why It Matters?</h4>
                                    <p>This guide explains how businesses and individuals can use carbon credits to offset emissions and support sustainable initiatives.</p>
                                </div>
                            </div>
                            <div className='card-ele' style={{ borderRadius: '2rem' }} >
                                <div className='for_image'></div>
                                <div style={{ color: 'black', width: '100%', fontWeight: 'lighter', height: '30%',paddingTop:'1rem'}}>
                                    <h4 style={{ fontWeight: 'lighter',marginBottom:'1rem' }}>Blockchain and Carbon Credits: </h4>
                                    <p style={{ marginBottom: '0' }}>This guide explains how businesses and individuals can use carbon credits to offset emissions and support sustainable initiatives.</p>
                                </div>
                            </div>
                        </div>
                        <div style={{width:'9rem',marginInline:'auto', marginTop:'2rem'}}>
                            <button className='b mobile-button' style={{width: '9rem', height: '50%', padding: ' 0.8rem',backgroundImage: 'linear-gradient(to right, #36D4A1, #13A0AA)', color: 'white' }}>Visit our Blog</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default HomePage;
