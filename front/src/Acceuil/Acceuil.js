import React from 'react'
// import Header from './Header'
// import Footer from './Footer'
import { Box } from '@mui/material'
import TwoRowGrid from './Grid'
import Carousel from '../Acceuil/Carousel/Carousel'
import FeaturesSection from './Service'
function Acceuil() {
  return (
    <div>
        <div style={{marginTop: "64px"}}>
          <Carousel />
          <TwoRowGrid />
        <Box
          sx={{
            height: "4px",
            width: "200px",
            background: "linear-gradient(90deg,#008d36,#008d36)",
            margin: "40px auto 0 auto",
            borderRadius: "8px",
          }}
        ></Box>
        <FeaturesSection/>
    </div>
    </div>
  )
}

export default Acceuil