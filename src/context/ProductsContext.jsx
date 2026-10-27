import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, imgUrl } from '../api.js'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [state, setState] = useState({ rawProducts: [], testimonials: [], loading: true, error: '' })

  const refresh = useCallback(async () => {
    try {
      const [rawProducts, testimonials] = await Promise.all([api.get('/products'), api.get('/testimonials')])
      setState({ rawProducts, testimonials, loading: false, error: '' })
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err.message }))
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Storefront ke liye image ka full URL; admin form rawProducts (relative path) use karta hai
  const products = useMemo(
    () => state.rawProducts.map((p) => ({ ...p, image: imgUrl(p.image) })),
    [state.rawProducts],
  )
  const newArrivals = useMemo(() => products.filter((p) => p.tag === 'new'), [products])
  const topSelling = useMemo(() => products.filter((p) => p.tag === 'top'), [products])

  const value = {
    products,
    rawProducts: state.rawProducts,
    newArrivals,
    topSelling,
    testimonials: state.testimonials,
    loading: state.loading,
    error: state.error,
    refresh,
  }
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider')
  return ctx
}
