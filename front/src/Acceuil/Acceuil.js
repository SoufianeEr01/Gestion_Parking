import React from 'react'
// import Header from './Header'
// import Footer from './Footer'
import TwoRowGrid from './Grid'
import Carousel from '../Acceuil/Carousel/Carousel'
function Acceuil() {
  return (
    <div>
        <div style={{marginTop: "64px"}}>
          <Carousel />
          <TwoRowGrid />
        </div>
    </div>
  )
}

export default Acceuil