import React from 'react'
import Image from 'next/image'
import "./css/calcu_card.css"

const Calculator_card = ({title, image, color1, color2, quantity, source, factor}) => {
  return (
    <div style={{width:'13vw',display:'flex',flexDirection:'column',alignItems:'center', justifyContent:'center'}}>
      <h2 style={{fontWeight:'lighter',color:'#033614'}}>{title}</h2>
        <Image src={image} alt="Display" width= {150} height={150} className="w-24 h-24 object-contain mb-6" style={{ borderRadius: '50%',marginBlock:'1rem' }} />

      <div className="text-green-900 text-sm mb-1" style={{fontWeight:'lighter',alignSelf:'start',color:'#033614'}}>Quantity (Liters)</div>
      <div className='cal_input'
        style={{ backgroundImage: `linear-gradient(to right, ${color1},${color2}` }}
      >
        {quantity}
      </div>

      <div className="text-green-900 text-sm mb-1" style={{fontWeight:'lighter',alignSelf:'start',color:'#033614'}}>Emission Factor Source</div>
      <div className='cal_input'
        style={{ backgroundImage: `linear-gradient(to right, ${color1},${color2}` }}
      >
        {source}
      </div>

      <div className="text-green-900 text-sm mb-1" style={{fontWeight:'lighter',alignSelf:'start',color:'#033614'}}>Emission Factor</div>
      <div className='cal_input'
        style={{ backgroundImage: `linear-gradient(to right, ${color1},${color2}` }}
      >
        {factor}
      </div>
    </div>
  )
}

export default Calculator_card