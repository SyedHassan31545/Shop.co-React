import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import BrandsMarquee from '../components/BrandsMarquee.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import BrowseByStyle from '../components/BrowseByStyle.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Newsletter from '../components/Newsletter.jsx'
import Reveal from '../components/Reveal.jsx'
import { newArrivals, topSelling } from '../data/products.js'

export default function Home() {
  return (
    <>
      <Hero />
      <BrandsMarquee />

      <section className="section">
        <Reveal as="h2" className="section__heading">
          NEW ARRIVALS
        </Reveal>
        <ProductGrid products={newArrivals} />
        <div className="section__cta">
          <Link to="/shop" className="btn btn--outline">
            View All
          </Link>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <Reveal as="h2" className="section__heading">
          TOP SELLING
        </Reveal>
        <ProductGrid products={topSelling} />
        <div className="section__cta">
          <Link to="/shop" className="btn btn--outline">
            View All
          </Link>
        </div>
      </section>

      <BrowseByStyle />
      <Testimonials />
      <Newsletter />
    </>
  )
}
