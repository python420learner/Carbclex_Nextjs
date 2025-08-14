'use client';
import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import CategoryFilter from '../components/CategoryFilter';
import ProjectGrid from '../components/ProjectGrid';
import ProjectCard from '../components/ProjectCard';
// import AboutUs from './components/AboutUs';
import DeveloperSection from '../components/DeveloperSection';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import ProjectDetails from '../components/ProjectDetails';
import { useRouter } from 'next/navigation';
// import { ProjectData, CategoryType } from './types/marketplace';

// Sample project data
const sampleProjects = [
  {
    id: '1',
    title: 'Forest Conservation Initiative',
    description: 'Large-scale reforestation project protecting biodiversity and capturing carbon',
    location: 'BRAZIL',
    price: 12.78,
    category: 'forestry',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    verified: true,
    verificationAgency: 'Verra',
    impactMetrics: {
      carbonOffset: 50000,
      treesPlanted: 250000,
      biodiversityScore: 9.2
    },
    sdgAlignment: [13, 15, 1],
    featured: true,
    media: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
        title: 'Aerial View of Forest Conservation Area',
        description: 'Drone footage showing the preserved forest area with native species',
        date: '2024-03-15',
        photographer: 'Conservation Team',
        featured: true
      },
      {
        id: '2',
        type: 'satellite',
        url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop',
        title: 'Satellite Imagery - Before and After',
        description: 'Satellite comparison showing forest regeneration over 2 years',
        date: '2024-01-10'
      },
      {
        id: '3',
        type: 'video',
        url: 'https://player.vimeo.com/video/sample',
        thumbnail: 'https://images.unsplash.com/photo-1574263867128-c7e537c48741?w=300&h=200&fit=crop',
        title: 'Project Impact Documentary',
        description: '10-minute documentary showcasing local community involvement',
        date: '2024-02-20'
      },
      {
        id: '4',
        type: 'drone',
        url: 'https://images.unsplash.com/photo-1574263867128-c7e537c48741?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1574263867128-c7e537c48741?w=300&h=200&fit=crop',
        title: 'Drone Survey - Tree Growth',
        description: 'Monthly drone surveys tracking new tree growth and health',
        date: '2024-03-01'
      },
      {
        id: '5',
        type: 'map',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
        title: '3D Topographical Map',
        description: 'Interactive 3D map showing project boundaries and elevation',
        date: '2024-01-05'
      },
      {
        id: '6',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=300&h=200&fit=crop',
        title: 'Local Community Engagement',
        description: 'Community members participating in tree planting activities',
        date: '2024-02-14',
        photographer: 'Maria Santos'
      }
    ]
  },
  {
    id: '2',
    title: 'Solar Farm Development',
    description: 'Clean energy generation project reducing reliance on fossil fuels',
    location: 'INDIA',
    price: 8.45,
    category: 'renewable',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop',
    verified: true,
    verificationAgency: 'Gold Standard',
    impactMetrics: {
      carbonOffset: 75000,
      energyGenerated: 150000,
      householdsServed: 25000
    },
    sdgAlignment: [7, 13, 11],
    featured: false,
    media: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop',
        title: 'Solar Panel Installation',
        description: 'Wide angle view of solar panel arrays in operation',
        date: '2024-01-20',
        featured: true
      },
      {
        id: '2',
        type: 'video',
        url: 'https://player.vimeo.com/video/sample-solar',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
        title: 'Solar Farm Time-lapse Construction',
        description: 'Time-lapse video showing 6-month construction process',
        date: '2024-02-01'
      },
      {
        id: '3',
        type: 'satellite',
        url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=300&h=200&fit=crop',
        title: 'Satellite Energy Output Analysis',
        description: 'Thermal satellite imagery showing energy generation patterns',
        date: '2024-03-10'
      }
    ]
  },
  {
    id: '3',
    title: 'Methane Capture Facility',
    description: 'Advanced technology capturing and utilizing methane emissions',
    location: 'USA',
    price: 15.20,
    category: 'methane',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
    verified: true,
    verificationAgency: 'Verra',
    impactMetrics: {
      carbonOffset: 100000,
      methaneCapture: 25000,
      wasteProcessed: 500000
    },
    sdgAlignment: [13, 12, 9],
    featured: true,
    media: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
        title: 'Methane Capture Equipment',
        description: 'Industrial methane capture and processing facility',
        date: '2024-02-15',
        featured: true
      },
      {
        id: '2',
        type: 'video',
        url: 'https://player.vimeo.com/video/sample-methane',
        thumbnail: 'https://images.unsplash.com/photo-1574263867128-c7e537c48741?w=300&h=200&fit=crop',
        title: 'How Methane Capture Works',
        description: 'Educational video explaining the methane capture process',
        date: '2024-01-30'
      }
    ]
  },
  {
    id: '4',
    title: 'Improved Cookstove Program',
    description: 'Distribution of efficient cookstoves reducing emissions and improving health',
    location: 'KENYA',
    price: 6.80,
    category: 'community',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    verified: true,
    verificationAgency: 'Gold Standard',
    impactMetrics: {
      carbonOffset: 30000,
      cookstovesDistributed: 10000,
      beneficiaries: 50000
    },
    sdgAlignment: [3, 13, 5],
    featured: false,
    media: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        title: 'Improved Cookstove in Use',
        description: 'Local woman using the new efficient cookstove technology',
        date: '2024-03-05',
        location: 'Nairobi, Kenya',
        featured: true
      },
      {
        id: '2',
        type: 'video',
        url: 'https://player.vimeo.com/video/sample-cookstove',
        thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop',
        title: 'Community Impact Stories',
        description: 'Interviews with families benefiting from the cookstove program',
        date: '2024-02-28'
      },
      {
        id: '3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop',
        title: 'Cookstove Distribution Day',
        description: 'Community gathering for cookstove distribution and training',
        date: '2024-01-15',
        photographer: 'James Mwangi'
      }
    ]
  },
  {
    id: '5',
    title: 'Regenerative Agriculture',
    description: 'Sustainable farming practices improving soil health and carbon sequestration',
    location: 'AUSTRALIA',
    price: 11.30,
    category: 'agriculture',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    verified: true,
    verificationAgency: 'Verra',
    impactMetrics: {
      carbonOffset: 40000,
      farmlandRestored: 15000,
      soilHealthImproved: 95
    },
    sdgAlignment: [2, 13, 15],
    featured: false,
    media: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop',
        title: 'Regenerative Farmland',
        description: 'Healthy soil and diverse crop rotation on regenerative farm',
        date: '2024-02-20',
        featured: true
      },
      {
        id: '2',
        type: 'drone',
        url: 'https://images.unsplash.com/photo-1574691250077-03a929faece5?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1574691250077-03a929faece5?w=300&h=200&fit=crop',
        title: 'Aerial Farm Survey',
        description: 'Drone imagery showing crop diversity and soil health improvements',
        date: '2024-03-01'
      }
    ]
  },
  {
    id: '6',
    title: 'Direct Air Capture Plant',
    description: 'Cutting-edge technology directly removing CO2 from atmosphere',
    location: 'ICELAND',
    price: 95.50,
    category: 'carbon-capture',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
    verified: true,
    verificationAgency: 'Verra',
    impactMetrics: {
      carbonOffset: 500000,
      co2Captured: 100000,
      technologyEfficiency: 98
    },
    sdgAlignment: [13, 9, 17],
    featured: true,
    media: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop',
        title: 'Direct Air Capture Facility',
        description: 'State-of-the-art CO2 capture technology in Iceland',
        date: '2024-03-10',
        featured: true
      },
      {
        id: '2',
        type: 'video',
        url: 'https://player.vimeo.com/video/sample-dac',
        thumbnail: 'https://images.unsplash.com/photo-1574263867128-c7e537c48741?w=300&h=200&fit=crop',
        title: 'How Direct Air Capture Works',
        description: 'Technical overview of CO2 extraction and storage process',
        date: '2024-01-25'
      },
      {
        id: '3',
        type: 'map',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
        title: 'Facility Location Map',
        description: '3D interactive map showing facility location and impact zone',
        date: '2024-01-15'
      }
    ]
  }
];

const PageType = 'marketplace' | 'project-details' | 'about' | 'calculator' | 'blog' | 'signin';

export default function App() {
  const [currentPage, setCurrentPage] = useState('marketplace');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [offsetCounter, setOffsetCounter] = useState(24321);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // const displayProjects = demo ? projects.slice(0, 3) : projects

  useEffect((e) => {
    // Make GET request to fetch products when component mounts
    fetch('/api/project/getVerifiedProjects')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(error => {
        console.log("error")
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  // Simulate real-time offset counter
  useEffect(() => {
    const interval = setInterval(() => {
      setOffsetCounter(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredProjects = projects?.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.projectType === selectedCategory;
    const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.locationDetails.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'impact':
        return b.impactMetrics.carbonOffset - a.impactMetrics.carbonOffset;
      case 'latest':
      default:
        return 0; // Keep original order for latest
    }
  });

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentPage('project-details');
  };

  const handleNavigateToMarketplace = () => {
    setCurrentPage(null);
    setSelectedProject(null);
    router.push('/marketplace')
    
  };

  const onRegisterProject = ()=>{
    localStorage.setItem("dashboardActiveTab", "project_management");
    localStorage.setItem("subTab", "new-registration");
    router.push('/dashboard')
  }

  // const handleNavigateToAbout = () => {
  //   setCurrentPage('about');
  // };

  // const handleNavigateToCalculator = () => {
  //   setCurrentPage('calculator');
  // };

  // const handleNavigateToBlog = () => {
  //   setCurrentPage('blog');
  // };

  // const handleNavigateToSignIn = () => {
  //   setCurrentPage('signin');
  // };

  // // Render based on current page
  // if (currentPage === 'about') {
  //   return <AboutUs onBack={handleNavigateToMarketplace} />;
  // }

  if (currentPage === 'project-details' && selectedProject) {
    return (
      <ProjectDetails 
        project={selectedProject}
        onBack={handleNavigateToMarketplace}
      />
    );
  }

  // if (currentPage === 'calculator') {
  //   return (
  //     <div className="min-h-screen bg-[#f4fff6] flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-4xl font-bold text-gray-900 mb-4">Carbon Calculator</h1>
  //         <p className="text-xl text-gray-600 mb-8">Coming Soon - Calculate your carbon footprint</p>
  //         <Button onClick={handleNavigateToMarketplace} className="bg-green-600 hover:bg-green-700">
  //           Back to Marketplace
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  // if (currentPage === 'blog') {
  //   return (
  //     <div className="min-h-screen bg-[#f4fff6] flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-4xl font-bold text-gray-900 mb-4">Climate Blog</h1>
  //         <p className="text-xl text-gray-600 mb-8">Coming Soon - Latest insights on climate action</p>
  //         <Button onClick={handleNavigateToMarketplace} className="bg-green-600 hover:bg-green-700">
  //           Back to Marketplace
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  // if (currentPage === 'signin') {
  //   return (
  //     <div className="min-h-screen bg-[#f4fff6] flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-4xl font-bold text-gray-900 mb-4">Sign In</h1>
  //         <p className="text-xl text-gray-600 mb-8">Coming Soon - User authentication</p>
  //         <Button onClick={handleNavigateToMarketplace} className="bg-green-600 hover:bg-green-700">
  //           Back to Marketplace
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#f4fff6]">
      <HeroSection 
        offsetCounter={offsetCounter} 
        // onAboutClick={handleNavigateToAbout}
        // onCalculatorClick={handleNavigateToCalculator}
        // onBlogClick={handleNavigateToBlog}
        // onSignInClick={handleNavigateToSignIn}
      />
      
      <CategoryFilter 
        selectedCategory={selectedCategory}
        projects={projects}
        onCategoryChange={setSelectedCategory}
      />

      <ProjectGrid 
        projects={sortedProjects}
        onProjectClick={handleProjectClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <DeveloperSection handleRegisterProject={onRegisterProject} />
      
      {/* <Footer onAboutClick={handleNavigateToAbout} /> */}
      <Footer  />
    </div>
  );
}













// import category from '../../../public/Assets/project_category.png'
// import CTA from '../components/cta';
// import ProductList from '../components/productlist'
// import { useState, useEffect } from 'react';
// import RouteTracker from '../components/RouteTracker';
// import './page.css'
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Image from "next/image";
// import heroImage from "../../../public/Assets/marketplace.png"

// const MarketPlace = () => {
//     const [hasScrolled_market, setHasScrolled_market] = useState(false);

//     useEffect(() => {
//         const handleScroll = () => {
//           // Check if user has scrolled vertically
//           if (window.scrollY > 0) {
//             setHasScrolled_market(true);
//           } else {
//             setHasScrolled_market(false);
//           }
//         };
      
//         // Add the event listener inside the effect
//         window.addEventListener('scroll', handleScroll);
      
//         // Cleanup the event listener when the component unmounts
//         return () => {
//           window.removeEventListener('scroll', handleScroll);
//         };
//       }, []);
//     return (
//         <div >
//             {/* <RouteTracker/> */}
//             <div className='market' style={{marginBottom:'10rem'}}>   
//               <div className='marketplace' style={{height:'90vh'}} >
//                 <div className={`nav_bar ${hasScrolled_market ? 'nav_background' : ''}`} id='navbar' >
//                         <Navbar />
//                 </div>
//                 <div className='intro'>
//                     <p style={{color:'#18311D',fontWeight:'bold'}}>Shape Greener Future:</p>
//                     <h1 className='t-white lspace' style={{color:'#18311D'}}>Trade Verified <br/> Carbon Credits</h1>
//                 </div>

//               </div>
//                 <div className='categories' style={{margin:'4rem 1rem',width:'80vw',marginInline:'auto'}}>
//                     <h3 style={{marginBottom:'2rem'}} >Browse By category</h3>
//                     <div style={{width:'80%',marginInline:'auto'}}>
//                         <Image src={category} style={{width:'100%',height:'100%'}} alt='categories' />

//                     </div>
//                 </div>
//                 <div className='mx-auto' style={{marginBlock:'8rem',width:'80vw' }}>
//                     <h3 className='lspace' style={{color:'#2F4834',fontSize:'large' }}>ALL CATEGORIES</h3>
//                     <ProductList/>
//                 </div>
//             </div>
//             <CTA/>
//             <Footer/>
//         </div>
//     )
// }

// export default MarketPlace;