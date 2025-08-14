import React from 'react'
import logo from '../../../public/Assets/Logo_header.png'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Button } from './ui/button';
import { Search, ArrowRight, Globe, TrendingUp, Shield, Users, Leaf, Menu, X } from 'lucide-react';
// import "./css/navbar.css"
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar({activePage}) {
  const [activeTab, setActiveTab] = useState(activePage || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false); // Close mobile menu when a tab is selected
  };

  const navLinks = [
    { name: 'Home', tab: 'home', href: '/' },
    { name: 'About', tab: 'about', href: '/about' },
    { name: 'Carbon Calculator', tab: 'calculator', href: '/calculator' },
    { name: 'Marketplace', tab: 'marketplace', href: '/marketplace' },
    { name: 'Blog', tab: 'blog', href: '/blog' },
  ];

  return (
    <div className="bg-white sticky top-0 shadow z-50">
      <nav className="relative z-10 flex items-center justify-between px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-900">CarbClex</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.tab} href={link.href}>
              <button
                onClick={() => handleTabClick(link.tab)}
                className={`text-gray-700 hover:text-green-600 ${
                  activeTab === link.tab
                    ? 'text-green-600 font-semibold hover:text-green-700'
                    : ''
                } transition-colors`}
              >
                {link.name}
              </button>
            </Link>
          ))}
          <Link href="/auth">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleTabClick('signup')}
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link key={link.tab} href={link.href}>
                  <button
                    onClick={() => handleTabClick(link.tab)}
                    className={`text-left py-2 px-4 rounded-md ${
                      activeTab === link.tab
                        ? 'bg-green-50 text-green-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    {link.name}
                  </button>
                </Link>
              ))}
              <Link href="/auth">
                <Button
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700 mt-2"
                  onClick={() => handleTabClick('signup')}
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}


// const Navbar = ({activePage}) => {

//     // const {where} = props

//     const [hasScrolled, setHasScrolled] = React.useState(false);
//     const [activeTab, setActiveTab] = React.useState(activePage || '');

//     React.useEffect(() => {
//         const handleScroll = () => {
//             // Check if user has scrolled vertically
//             if (window.scrollY > 0) {
//                 setHasScrolled(true);
//             } else {
//                 setHasScrolled(false);
//             }
//         };

//         // Add the event listener inside the effect
//         window.addEventListener('scroll', handleScroll);

//         // Cleanup the event listener when the component unmounts
//         // return () => {
//         //     window.removeEventListener('scroll', handleScroll);
//         // };
//     }, []);


//     const [isToggled, setIsToggled] = useState(false);

//     // Event handler to toggle the state
//     const handleToggle = () => {
//         setIsToggled(prev => !prev);
//     };

//     return (
//         <div className="bg-white sticky top-0 shadow z-50">
//             <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
//                 <div className="flex items-center gap-2">
//                     <Leaf className="w-8 h-8 text-green-600" />
//                     <span className="text-2xl font-bold text-gray-900">CarbClex</span>
//                 </div>

//                 <div className="hidden md:flex items-center gap-8">
//                     <Link onClick={() => setActiveTab('home')} href="/"><button className={`text-gray-700 hover:text-green-600  ${activeTab === 'home' ? 'text-green-600 font-semibold hover:text-green-700' : ''} transition-colors`}>Home</button></Link>
//                     <Link onClick={() => setActiveTab('about')} href="/about"><button className={`text-gray-700 hover:text-green-600 ${activeTab === 'about' ? 'text-green-600 font-semibold hover:text-green-700' : ''} transition-colors`}>About</button></Link>
//                     <Link onClick={() => setActiveTab('calculator')} href="/calculator"><button className={`text-gray-700 hover:text-green-600 ${activeTab === 'calculator' ? 'text-green-600 font-semibold hover:text-green-700' : ''} transition-colors`}>Carbon Calculator</button></Link>
//                     <Link onClick={() => setActiveTab('marketplace')} href="/marketplace"><button className={`text-gray-700 hover:text-green-600 ${activeTab === 'marketplace' ? 'text-green-600 font-semibold hover:text-green-700' : ''} transition-colors`}>Marketplace</button></Link>
//                     <Link onClick={() => setActiveTab('blog')} href="/blog"><button className={`text-gray-700 hover:text-green-600 ${activeTab === 'blog' ? 'text-green-600 font-semibold hover:text-green-700' : ''} transition-colors`}>Blog</button></Link>
//                     <Link onClick={() => setActiveTab('signup')} href="/auth"><Button size="sm" className="bg-green-600 hover:bg-green-700">Sign In</Button></Link>
//                 </div>

//                 <Button variant="ghost" size="sm" className="md:hidden">
//                     <Menu className="w-5 h-5" />
//                 </Button>
//             </nav>
//         </div>

//     );
// }

// export default Navbar;



// {/* <div className="navbar-1 bg-transparent" >
//                 <div>
//                     <Link className="navbar-brand" href="/"><Image src={logo} style={{ marginLeft: '2rem' }} alt="Carbex Logo" /></Link>
//                 </div>
//                 <div>
//                     <div className='hamburger'>
//                         <FontAwesomeIcon icon={faBars} onClick={handleToggle} color='white' size='2x'/>
//                     </div>
//                     <ul className={`${isToggled ? 'toggleTopNav' : 'navbar-element '} ${hasScrolled ? 'transparent' : 'back_colored'}`}>
                        
//                         <li className="nav-item" >
//                             <Link className="nav-link" href="/">Home</Link>
//                         </li>
//                         <li className="nav-item" >
//                             <Link className="nav-link" href="/">About Us</Link>
//                         </li>
//                         <li className="nav-item">
//                             <Link className="nav-link" href="/calculator">Carbon Calculator</Link>
//                         </li>
//                         <li className="nav-item">
//                             <Link className="nav-link" href="/marketplace">Market Place</Link>
//                         </li>
//                         <li className="nav-item">
//                             <Link className="nav-link" href="/blog">Blog</Link>
//                         </li>
//                         <li><Link className='signup_btn' href="/signup">sign in</Link></li>
//                     </ul>
//                 </div>
//             </div> */}