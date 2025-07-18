import React from 'react'
import Navbar from '../Components/Navbar'
import Main from '../Components/Main'
import SelectRide from '../Components/SelectRide'
import Services from '../Components/Services'
import LoginUser from '../Components/LoginUser'
import Download from '../Components/Download'
import Help from '../Components/Help'
import Footer from '../Components/Footer'


const LandingPage = () => {
  return (
    <>
       <Navbar />
        <Main />
        <SelectRide />
        <Services />
        <LoginUser />
        <Download />
        <Help />
        <Footer />
        
    </>
  )
}

export default LandingPage
