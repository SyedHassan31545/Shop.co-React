import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { api, imgUrl } from '../api.js'

const CartContext = createContext(null)

const CART_KEY = 'shopco:cart'
const WISHLIST_KEY = 'shopco:wishlist'

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []))
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_KEY, []))
  const [toast, setToast] = useState(null)

  const { user } = useAuth()
  const userId = user?.id
  const syncedFor = useRef(null) // kis user ke liye state server se sync ho chuki ha
  const prevUserId = useRef(null)

  // Login: server ka cart/wishlist lo aur guest (localStorage) wale ke saath merge karo.
  // Logout: cart/wishlist screen se saaf (DB ma safe rehta ha).
  useEffect(() => {
    if (!userId) {
      if (prevUserId.current) {
        setCart([])
        setWishlist([])
      }
      prevUserId.current = null
      syncedFor.current = null
      return
    }
    prevUserId.current = userId
    let cancelled = false
    ;(async () => {
      try {
        const [serverCart, serverWish] = await Promise.all([api.get('/cart'), api.get('/wishlist')])
        if (cancelled) return
        const guestCart = readStorage(CART_KEY, [])
        const guestWish = readStorage(WISHLIST_KEY, [])
        const merged = new Map()
        const lines = [...serverCart.items.map((i) => ({ ...i, image: imgUrl(i.image) })), ...guestCart]
        for (const line of lines) {
          const prev = merged.get(line.lineId)
          merged.set(line.lineId, prev ? { ...prev, qty: Math.min(99, prev.qty + line.qty) } : line)
        }
        localStorage.removeItem(CART_KEY)
        localStorage.removeItem(WISHLIST_KEY)
        syncedFor.current = userId
        setCart([...merged.values()])
        setWishlist([...new Set([...serverWish.items, ...guestWish])])
      } catch {
        // Server na mile to local state hi chalti rahe
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userId])

  // Guest: localStorage ma save. Logged-in: DB ma save (debounced).
  useEffect(() => {
    if (!userId) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
      return
    }
    if (syncedFor.current !== userId) return
    const t = setTimeout(() => {
      api
        .put('/cart', { items: cart.map(({ id, size, color, qty }) => ({ id, size, color, qty })) })
        .catch(() => {})
    }, 300)
    return () => clearTimeout(t)
  }, [cart, userId])

  useEffect(() => {
    if (!userId) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
      return
    }
    if (syncedFor.current !== userId) return
    const t = setTimeout(() => api.put('/wishlist', { items: wishlist }).catch(() => {}), 300)
    return () => clearTimeout(t)
  }, [wishlist, userId])

  // Auto-dismiss toast notifications.
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const addToCart = (product, options = {}) => {
    const { size = product.sizes?.[0] ?? null, color = product.colors?.[0] ?? null, qty = 1 } = options
    setCart((prev) => {
      const lineId = `${product.id}__${size}__${color}`
      const existing = prev.find((item) => item.lineId === lineId)
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId ? { ...item, qty: item.qty + qty } : item,
        )
      }
      return [
        ...prev,
        {
          lineId,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          color,
          qty,
        },
      ]
    })
    setToast(`${product.name} added to cart`)
  }

  const removeFromCart = (lineId) => setCart((prev) => prev.filter((i) => i.lineId !== lineId))

  const updateQty = (lineId, qty) =>
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.lineId !== lineId)
        : prev.map((i) => (i.lineId === lineId ? { ...i, qty } : i)),
    )

  const clearCart = () => setCart([])

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const isInWishlist = (productId) => wishlist.includes(productId)

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart])
  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + i.qty * i.price, 0), [cart])

  const value = {
    cart,
    wishlist,
    toast,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    toggleWishlist,
    isInWishlist,
    cartCount,
    cartTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
