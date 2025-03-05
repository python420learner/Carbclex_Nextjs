import React, { useState, useEffect } from 'react';
import projectImage from '../../../public/Assets/project_img.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import ProductCard from './productCard';
import Image from 'next/image';
import "./css/list.css"

const ProductList = ({demo = false}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const displayProjects = demo ? projects.slice(0,3) : projects

  useEffect((e) => {
    // Make GET request to fetch products when component mounts
    fetch('http://localhost:8080/carbclex/getAll')
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
  }, [projects]);

  const categorizedProjects = projects.reduce((acc, project) => {
    if (!acc[project.projectType]) {
      acc[project.projectType] = [];
    }
    acc[project.projectType].push(project);
    return acc;
  }, {});
  

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while data is being fetched
  }

  return (
    <>
      <div className='section_one'>
        {displayProjects.map(project => (
          <div key={project.projectid} className='project'>
            <div style={{backgroundColor:'#065424',width:'100%',height:'50%'}}>
              <Image src={projectImage} style={{height:'50%',width:'100%'}} alt='project_image'/>
            </div>
            <div className='cont_one'>
              <h5 style={{color:'#182330',marginTop:'2rem',fontWeight:'bold', marginTop:'1rem'}}>{project.countryId.country}</h5>
              <h3 style={{color:'#065F24',fontSize:'1.7rem', marginTop:'1rem'}}>{project.projectName}</h3>
              <h4 style={{color:'#000000' ,fontWeight:'lighter',fontSize:'18px', marginTop:'1rem'}}>{project.projectDescription}</h4>
              <p style={{marginTop:'1rem'}}>$10 per Tonne</p>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <FontAwesomeIcon icon={faCartShopping} color='#065F24' size='2x'/>
                <Link href={`/project/${project.projectid}`} state={project}><button style={{width:'7rem',color:'#065424',cursor:'pointer',backgroundColor:'white',border:'2px solid #065424'}}>SEE MORE</button></Link>
              </div>
            </div>
          </div>
        ))}
        {demo && (<div className='visit'>
            <h2 style={{color:'white',fontWeight:'bold',fontSize:'1.7rem',textAlign:'left'}}>Discover the rigorous methodologies behind our forest projects validations</h2>
            <Link href="/marketplace"><button style={{padding:'0.6rem 2rem',alignSelf:'center',backgroundColor:'transparent',border:'4px solid white',color:'white'}}>Visit Market Place</button></Link>
        </div>)}
        {!demo && (<div style={{width:'28%',padding:'2rem',backgroundImage:'linear-gradient(#36D4A1,#13A0AA)',display:'flex',flexDirection:'column',justifyContent:'space-between',marginBottom:'2rem'}}>
            <h2 style={{color:'white',fontWeight:'bold',fontSize:'1.7rem'}}>Discover the rigorous methodologies behind our forest projects validations</h2>
            <button style={{padding:'0.6rem 2rem',alignSelf:'center',backgroundColor:'transparent',border:'4px solid white',color:'white',fontWeight:'bold'}}>EXPLORE</button>
        </div>)}
      </div>

      {!demo && (<div>
        {Object.entries(categorizedProjects).map(([category, projects]) => (
          <div key={category} style={{ marginBottom: '3rem' }}>
            <h3 style={{ color: '#065424', marginBottom: '1rem',textTransform:'uppercase',fontSize:'large' }}>{category} Projects</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
              <div style={{width:'28%',padding:'2rem',backgroundColor:'brown',display:'flex',flexDirection:'column',justifyContent:'space-between',marginBottom:'2rem'}}>
                <h2 style={{color:'white',fontWeight:'bold',fontSize:'1.7rem'}}>Discover the rigorous methodologies behind our forest projects validations</h2>
                <button style={{padding:'0.6rem 2rem',alignSelf:'center',backgroundColor:'transparent',border:'4px solid white',color:'white',fontWeight:'bold'}}>EXPLORE</button>
              </div>
              {projects.map(project => (
                <ProductCard key={project.projectid} project={project} />
              ))}
            </div>
          </div>
        ))}
      </div>)}

    </>
  );
}

export default ProductList;
