'use client';
import React,{useRef,useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { useSearchParams } from 'next/navigation'
import Footer from '../components/footer';
import RouteTracker from '../components/RouteTracker'
import Cart from '../components/cart'
import './page.css'

const Details = () => {

    const [activeTab, setActiveTab] = React.useState("overview");
    const [params, setSearchParams] = React.useState(null)

    useEffect(() => {
        // Parse the query string using URLSearchParams
        const params = new URLSearchParams(window.location.search);
        setSearchParams(params);
      }, []);


    // const searchParams = useSearchParams();
    // const projectData = searchParams.get("data");

    const sectionRefs = {
        overview: useRef(null),
        details: useRef(null),
        description: useRef(null),
        verification: useRef(null),
        document: useRef(null),
        status: useRef(null),
    };

    const handleScrollToSection = (section) => {
        sectionRefs[section]?.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    };

    useEffect(() => {
        const handleScroll = () => {
          const currentScroll = window.scrollY;
    
          for (const [section, ref] of Object.entries(sectionRefs)) {
            const element = ref.current;
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (currentScroll >= offsetTop - 100 && currentScroll < offsetTop + offsetHeight - 100) {
                setActiveTab(section);
                break;
              }
            }
          }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);

      if (!params) {
        return <div>Loading project details...</div>;
      }
      const project = projectData ? JSON.parse(decodeURIComponent(projectData)) : {};
      const projectData = params.get("data");

  return (
    <>
        {/* <RouteTracker/> */}
        <div className='project_details'>
            <header style={{height:'70vh',marginTop:'8rem',backgroundColor:'#065F24',color:'white',paddingTop:'55vh' }}>
                <div style={{marginLeft:'3rem',top:'20rem'}}>
                    <h1>{project.projectName}</h1>
                    <div style={{display:'flex'}}>
                        <FontAwesomeIcon icon={faLocationDot} color='white' size='2x' style={{marginInline:'1rem'}}/>
                        <p>{project.countryId.country}</p>
                    </div>
                </div>
            </header>
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{width:'60vw',marginInline:'auto'}}>
                    <nav className='nav_list'>
                        <ul>
                            {Object.keys(sectionRefs).map((section) => (
                                <li
                                    key={section}
                                    className={`nav-item ${activeTab === section ? "active" : ""}`}
                                    onClick={() => handleScrollToSection(section)}
                                >
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div id='overview' ref={sectionRefs.overview} style={{display:'flex',justifyContent:'space-around',marginTop:'4rem'}}>
                        <div style={{width:'40%',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                            <h2 style={{textAlign:'center',color:'#065F24',marginBottom:'2rem'}}>OVERVIEW</h2>
                            <p>{project.projectDescription}</p>
                        </div>
                    </div>
                    <div>
                        <div style={{display:'flex',justifyContent:'center',gap:'1rem',marginTop:'8rem'}}>
                            <div className='pro_image'></div>
                            <div className='pro_image'></div>
                            <div className='pro_image'></div>
                        </div>
                        <ul style={{display:'flex',justifyContent:'center',marginTop:'2rem'}}>
                            <li className='pro_tags'></li>
                            <li className='pro_tags'></li>
                            <li className='pro_tags'></li>
                            <li className='pro_tags'></li>
                        </ul>
                    </div>
                    <div id='details' ref={sectionRefs.details} style={{marginLeft:'4rem'}}>
                        <h2 style={{color:'#065F24'}}>PROJECT DETAILS</h2>
                        <form style={{marginTop:'3rem',marginLeft:'6rem'}}>
                            <span style={{display:'flex', gap:'4rem',marginBottom:'2rem'}}>
                                <h4>Project Type:</h4>
                                <p>{project.projectType}</p>
                            </span>
                            <span style={{display:'flex',gap:'4rem',marginBottom:'2rem'}}>
                                <h4>Project ID:</h4>
                                <p>{project.projectid}</p>
                            </span>
                            <span style={{display:'flex',gap:'4rem',marginBottom:'2rem'}}>
                                <h4>Verification Standards:</h4>
                                <p></p>
                            </span>
                        </form>
                    </div>
                    <div id='description' ref={sectionRefs.description}>
                        <h2 style={{width:'fit-content',marginInline:'auto',marginTop:'4rem'}}>DESCRIPTION</h2>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                            <span style={{width:'60vw',marginBottom:'3rem'}}>
                                <h3 style={{marginBottom:'8px',color:'#065F24',fontWeight:'light'}}>Mission & Vision</h3>
                                <p>{project.projectDescription}</p>
                            </span>
                            <span style={{width:'60vw',marginBottom:'3rem'}}>
                                <h3 style={{marginBottom:'8px',color:'#065F24',fontWeight:'light'}}>How it works</h3>
                                <p>This project helps small communities plant trees to create a nature-based carbon removal system that helps train leaders and pull families out of poverty.</p>
                            </span>
                            <span style={{width:'60vw',marginBottom:'3rem'}}>
                                <h3 style={{marginBottom:'8px',color:'#065F24',fontWeight:'light'}}>Environmental and Social Benefits</h3>
                                <p>This project helps small communities plant trees to create a nature-based carbon removal system that helps train leaders and pull families out of poverty.</p>
                            </span>
                            <span style={{width:'60vw',marginBottom:'3rem'}}>
                                <h3 style={{marginBottom:'8px',color:'#065F24',fontWeight:'light'}}>Challenges</h3>
                                <p>This project helps small communities plant trees to create a nature-based carbon removal system that helps train leaders and pull families out of poverty.</p>
                            </span>
                        </div>
                    </div>
                    <div id='verification' ref={sectionRefs.verification} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'2rem'}}>
                        <h4>LOCATION</h4>
                        <div style={{width:'35vw',height:'15vw',backgroundColor:'#065F24'}}></div>
                        <h4>Verification and Certification</h4>
                        <div style={{display:'flex',gap:'4rem'}}>
                            <div style={{width:'4rem',height:'4rem',borderRadius:'100px',backgroundColor:'#065F24'}}></div>
                            <div style={{width:'4rem',height:'4rem',borderRadius:'100px',backgroundColor:'#065F24'}}></div>
                            <div style={{width:'4rem',height:'4rem',borderRadius:'100px',backgroundColor:'#065F24'}}></div>
                        </div>
                        <h4>DOCUMENTS</h4>

                    </div>
                </div>
                <Cart project = {project} />
            </div>
            <Footer/>
        </div> 
    </>
  )
}

export default Details
