import React from 'react'
import Navbar from '../../components/navbar'
import Ads from '../../components/body/Ads.jsx'
import Categories from './components/Categories'
import FeaturedListings from './components/FeaturedListings'
import LatestListings from './components/LatestListings'
import NearYou from './components/NearYou'
import TrustBy from '../../components/body/trustBy.jsx'
import Footer from '../../components/footer'

const index = () => {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '400px', textAlign: 'center', height: '100vh', width: '100vw' }}>
      <Navbar />
      <Ads />
      <Categories />
      <FeaturedListings />
      <LatestListings />
      <NearYou />
      <TrustBy />
      <Footer />
    </div>
  )
}

export default index
