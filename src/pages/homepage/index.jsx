import React from 'react'
import Navbar from '../../components/navbar'
import Ads from '../../components/body/Ads.jsx'
import Categories from './components/Categories'
import LatestListings from './components/LatestListings'
import NearYou from './components/NearYou'
import TrustBy from '../../components/body/trustBy.jsx'
import Footer from '../../components/footer'

const index = () => {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, width: '100%' }}>
        <Ads />
        <Categories />
        <LatestListings />
        <NearYou />
        <TrustBy />
      </div>
      <Footer />
    </div>
  )
}

export default index
