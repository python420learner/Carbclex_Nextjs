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
    // fetch('/api/getAll')
    fetch(' /api/getAll')
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

        <ProductCard key={project.projectid} project={project} />
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
