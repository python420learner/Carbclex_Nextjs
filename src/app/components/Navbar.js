import React from 'react'
import logo from '../../../public/Assets/Logo_header.png'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import "./css/navbar.css"
import { useState } from 'react'
import Image from 'next/image';


const Navbar = () => {

    // const {where} = props

    const [hasScrolled, setHasScrolled] = React.useState(false);

    React.useEffect(() => {
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

    const [isToggled, setIsToggled] = useState(false);

    // Event handler to toggle the state
    const handleToggle = () => {
        setIsToggled(prev => !prev);
    };

    return (
        <div>
            <div className="navbar-1 bg-transparent" >
                <div>
                    <Link className="navbar-brand" href="/"><Image src={logo} style={{ marginLeft: '2rem' }} alt="Carbex Logo" /></Link>
                </div>
                <div>
                    <div className='hamburger'>
                        <FontAwesomeIcon icon={faBars} onClick={handleToggle} color='white' size='2x'/>
                    </div>
                    <ul className={`${isToggled ? 'toggleTopNav' : 'navbar-element '} ${hasScrolled ? 'transparent' : 'back_colored'}`}>
                        
                        <li className="nav-item" >
                            <Link className="nav-link" href="/">Home</Link>
                        </li>
                        <li className="nav-item" >
                            <Link className="nav-link" href="/">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/calculator">Carbon Calculator</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/marketplace">Market Place</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/">Blog</Link>
                        </li>
                        <li><Link className='signup_btn' href="/signup">sign in</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
