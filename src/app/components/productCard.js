import React from 'react';
import projectImage from '../../../public/Assets/project_img.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ project }) => {
  const encodedProject = encodeURIComponent(JSON.stringify(project)); // Convert to JSON string
  // console.log("this is json project",project.projectName)
  return(
    <div key={project.projectid} style={{ backgroundColor: 'white', width: '28%', height: 'fit-content', marginBottom: '2rem', paddingBottom: '2rem' }}>
      <div style={{ backgroundColor: '#065424', width: '100%', height: '50%' }}>
        <Image src={project.image || projectImage} style={{height:'50%',width:'100%'}} alt='project_image' />
      </div>
      <div className='cont_one' style={{ marginInline: '0.5rem' }}>
        <h5 style={{ color: '#182330', marginTop: '2rem', fontWeight: 'bold' }}>{project.countryId.country}</h5>
        <h3 style={{ color: '#065F24',fontSize:'1.7rem', marginTop:'1rem' }}>{project.projectName}</h3>
        <h4 style={{ color: '#000000', fontWeight: 'lighter', fontSize: '18px', marginTop:'1rem' }}>{project.projectDescription}</h4>
        <p style={{marginTop:'1rem'}}>$10 per Tonne</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <FontAwesomeIcon icon={faCartShopping} color='#065F24' size='2x' />
          <Suspense fallback={<div>Loading...</div>}>
            <Link href={`/projectDetails?data=${encodedProject}`} state={project}>
              <button style={{ width: '7rem', color: '#065424', cursor: 'pointer', backgroundColor: 'white', border: '2px solid #065424' }}>
                SEE MORE
              </button>
            </Link>
          </Suspense>
        </div>
      </div>
    </div>
  )
};
  
export default ProductCard
