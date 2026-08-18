import React from 'react'
import { brands } from '../data/products.js'

export default function BrandsMarquee() {
  // Duplicate the list so the CSS animation can loop seamlessly.
  const loop = [...brands]

  return (
    <div className="marquee">
      <div className="marquee__track">
        {loop.map((brand, i) => (
  <span className="marquee__item" key={`${brand.name}-${i}`}>
    <img src={brand.logo} alt={brand.name} className="marquee__logo" />
  </span>
))}
      </div>
    </div>
  )
}
