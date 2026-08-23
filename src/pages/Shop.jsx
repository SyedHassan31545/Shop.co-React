import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid.jsx'
import Reveal from '../components/Reveal.jsx'
import { products } from '../data/products.js'
import { Link } from 'react-router-dom'

const styles = ['all', 'casual', 'formal', 'party', 'gym']
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

const CATEGORIES = ['T-shirts', 'Shirts', 'Shorts', 'Jeans']
const ALL_COLORS = [...new Set(products.flatMap((p) => p.colors || []))]

const SIZES = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large']
const SIZE_LABEL_MAP = { S: 'Small', M: 'Medium', L: 'Large', XL: 'X-Large' }

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const styleParam = searchParams.get('style') || 'all'
  const categoryParam = searchParams.get('category') || 'all'
  const colorParam = searchParams.get('colors') || ''
  const selectedColors = colorParam ? colorParam.split(',') : []
  const sizeParam = searchParams.get('size') || ''
  const searchParam = searchParams.get('search') || ''
  const saleOnly = searchParams.get('sale') === 'true'

  const [sort, setSort] = useState('popular')
  const [minPrice, setMinPrice] = useState(50)
  const [maxPrice, setMaxPrice] = useState(500)

  // draft = jo UI mein select ho raha hai, Apply se pehle URL update nahi hoti
  const [draftStyle, setDraftStyle] = useState(styleParam)
  const [draftCategory, setDraftCategory] = useState(categoryParam)
  const [draftColors, setDraftColors] = useState(selectedColors)
  const [draftSize, setDraftSize] = useState(sizeParam)
  const [draftSale, setDraftSale] = useState(saleOnly)
  const [draftMinPrice, setDraftMinPrice] = useState(minPrice)
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice)

  const setStyle = (style) => setDraftStyle(style)
  const setCategory = (cat) => setDraftCategory(cat)

  const toggleColor = (c) => {
    setDraftColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  const setSizeFilter = (s) => setDraftSize((prev) => (prev === s ? '' : s))
  const toggleSale = () => setDraftSale((prev) => !prev)

  const handleMinChange = (v) => setDraftMinPrice(Math.min(v, draftMaxPrice - 10))
  const handleMaxChange = (v) => setDraftMaxPrice(Math.max(v, draftMinPrice + 10))

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams)

    if (draftStyle === 'all') next.delete('style')
    else next.set('style', draftStyle)

    if (draftCategory === 'all') next.delete('category')
    else next.set('category', draftCategory)

    if (draftColors.length) next.set('colors', draftColors.join(','))
    else next.delete('colors')

    if (draftSize) next.set('size', draftSize)
    else next.delete('size')

    if (draftSale) next.set('sale', 'true')
    else next.delete('sale')

    setSearchParams(next)
    setMinPrice(draftMinPrice)
    setMaxPrice(draftMaxPrice)
  }

  const filtered = useMemo(() => {
    let list = [...products]

    if (styleParam !== 'all') list = list.filter((p) => p.style === styleParam)
    if (categoryParam !== 'all') list = list.filter((p) => p.category === categoryParam)
    if (selectedColors.length) list = list.filter((p) => p.colors?.some((c) => selectedColors.includes(c)))
    if (sizeParam) list = list.filter((p) => p.sizes?.some((s) => SIZE_LABEL_MAP[s] === sizeParam))
    if (saleOnly) list = list.filter((p) => p.oldPrice)
    if (searchParam) {
      const q = searchParam.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
        list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice)

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    return list
  }, [styleParam, saleOnly, searchParam, minPrice, maxPrice, sort, categoryParam, selectedColors, sizeParam])

  return (
    <section className="section shop-page">
            <nav className="breadcrumb">
        <Link to="/">Home</Link> / <span>{styleParam === 'all' ? 'Shop' : styleParam[0].toUpperCase() + styleParam.slice(1)}</span>
      </nav>

      <Reveal as="h1" className="section__heading">
        {searchParam ? `Results for "${searchParam}"` : styleParam === 'all' ? 'ALL PRODUCTS' : styleParam.toUpperCase()}
      </Reveal>

      <div className="shop-page__layout">
                <aside className="shop-filters">

          <div className="shop-filters__group">
            <h4>Category</h4>
            <ul>
              <li>
                <button
                  type="button"
                  className={`filter-pill ${draftCategory === 'all' ? 'is-active' : ''}`}
                  onClick={() => setCategory('all')}
                >
                  All
                </button>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    className={`filter-pill ${draftCategory === cat ? 'is-active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="shop-filters__group">
            <h4>Colors</h4>
            <div className="filter-colors">
              {ALL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`filter-color-swatch ${draftColors.includes(c) ? 'is-active' : ''}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                  onClick={() => toggleColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="shop-filters__group">
            <h4>Size</h4>
            <div className="size-filter-grid">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`size-filter-pill ${draftSize === s ? 'is-active' : ''}`}
                  onClick={() => setSizeFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-filters__group">
            <h4>Dress Style</h4>
            <ul>
              {styles.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className={`filter-pill ${draftStyle === s ? 'is-active' : ''}`}
                    onClick={() => setStyle(s)}
                  >
                    {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="shop-filters__group">
            <h4>Price: ${draftMinPrice} - ${draftMaxPrice}</h4>
            <div className="price-slider">
              <div
                className="price-slider__track-fill"
                style={{
                  left: `${((draftMinPrice - 50) / (500 - 50)) * 100}%`,
                  right: `${100 - ((draftMaxPrice - 50) / (500 - 50)) * 100}%`,
                }}
              />
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={draftMinPrice}
                onChange={(e) => handleMinChange(Number(e.target.value))}
              />
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={draftMaxPrice}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="shop-filters__group">
            <label className="filter-checkbox">
              <input type="checkbox" checked={draftSale} onChange={toggleSale} />
              On sale only
            </label>
          </div>

          <button type="button" className="btn btn--primary shop-filters__apply" onClick={applyFilters}>
            Apply Filter
          </button>
        </aside>

        <div className="shop-page__results">
                    <div className="shop-page__toolbar">
            <span>Showing {filtered.length ? 1 : 0}-{filtered.length} of {products.length} Products</span>
            <label>
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <ProductGrid products={filtered} />
        </div>
      </div>
    </section>
  )
}

