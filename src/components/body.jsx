import React from 'react'
import Ads from './body/Ads'
import Categories from '../pages/homepage/Categories'
import FeaturedListings from '../pages/homepage/FeaturedListings'
import LatestListings from '../pages/homepage/LatestListings'
import NearYou from '..pages/hompeage/NearYou'
import TrustBy from './body/trustBy'

const body = () => {
  return (
    <div style={{backgroundColor: 'green', padding: '20px', minHeight: '400px', textAlign: 'center'}}>
      <h1>Main Body</h1>
      <Ads/>
      <Categories/>
      <FeaturedListings/>
      <LatestListings/>
      <NearYou/>
      <TrustBy/>
    </div>
  )
}

export default body
