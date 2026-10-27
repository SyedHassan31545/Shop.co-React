import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../api.js'

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, cartTotal } = useCart()
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [checkedOut, setCheckedOut] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const { user, setUser } = useAuth()
  const [addr, setAddr] = useState({ fullName: '', phone: '', address: '', city: '', postalCode: '', country: '' })
  const setField = (key) => (e) => setAddr((a) => ({ ...a, [key]: e.target.value }))

  // Pichla address (ya kam az kam naam) prefill karo
  useEffect(() => {
    if (!user) return
    setAddr((a) => (a.address ? a : { ...a, ...(user.address || {}), fullName: user.address?.fullName || user.name }))
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const navigate = useNavigate()

  const shipping = cart.length > 0 ? 15 : 0
  const discount = promoApplied ? cartTotal * 0.1 : 0
  const total = cartTotal - discount + shipping

  const applyPromo = (e) => {
    e.preventDefault()
    if (promo.trim().toLowerCase() === 'shopco10') setPromoApplied(true)
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    setPlacing(true)
    setError('')
    try {
      // Price server khud calculate karta hai; hum sirf id/qty/size/color bhejte hain
      await api.post('/orders', {
        items: cart.map(({ id, qty, size, color }) => ({ id, qty, size, color })),
        promoCode: promoApplied ? promo : '',
        shippingAddress: addr,
      })
      setUser((u) => ({ ...u, address: addr }))
      setCheckedOut(true)
      clearCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setPlacing(false)
    }
  }

  if (checkedOut) {
    return (
      <section className="section cart-page cart-page--empty">
        <h1>Order placed 🎉</h1>
        <p>Thanks for shopping with us — aapka order save ho gaya hai.</p>
        <Link to="/orders" className="btn btn--primary">
          View My Orders
        </Link>
      </section>
    )
  }

  if (cart.length === 0) {
    return (
      <section className="section cart-page cart-page--empty">
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn--primary">
          Start Shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="section cart-page">
      <h1 className="section__heading">YOUR CART</h1>

      <div className="cart-page__layout">
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={item.lineId} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item__info">
                <h3>{item.name}</h3>
                <p className="cart-item__meta">
                  {item.size && <>Size: {item.size} </>}
                  {item.color && (
                    <span className="cart-item__color" style={{ backgroundColor: item.color }} />
                  )}
                </p>
                <button type="button" className="cart-item__remove" onClick={() => removeFromCart(item.lineId)}>
                  Remove
                </button>
              </div>
              <div className="qty-stepper qty-stepper--sm">
                <button type="button" onClick={() => updateQty(item.lineId, item.qty - 1)}>
                  −
                </button>
                <span>{item.qty}</span>
                <button type="button" onClick={() => updateQty(item.lineId, item.qty + 1)}>
                  +
                </button>
              </div>
              <div className="cart-item__price">${item.price * item.qty}</div>
            </li>
          ))}
        </ul>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <div className="cart-summary__row cart-summary__row--discount">
              <span>Discount (10%)</span>
              <span>−${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <form className="cart-summary__promo" onSubmit={applyPromo}>
            <input
              type="text"
              placeholder="Add promo code (try SHOPCO10)"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button type="submit">Apply</button>
          </form>
          {promoApplied && <p className="newsletter__feedback newsletter__feedback--ok">Promo applied!</p>}

          <form className="checkout-form" onSubmit={handleCheckout}>
            {user && (
              <>
                <h4>Shipping Address</h4>
                <input placeholder="Full name" value={addr.fullName} onChange={setField('fullName')} required minLength={2} maxLength={80} autoComplete="name" />
                <input placeholder="Phone number" type="tel" value={addr.phone} onChange={setField('phone')} required pattern="[0-9+\- ]{7,20}" title="Sirf digits, +, - aur space (7-20 characters)" autoComplete="tel" />
                <input placeholder="Street address" value={addr.address} onChange={setField('address')} required minLength={5} maxLength={200} autoComplete="street-address" />
                <div className="checkout-form__row">
                  <input placeholder="City" value={addr.city} onChange={setField('city')} required minLength={2} maxLength={60} autoComplete="address-level2" />
                  <input placeholder="Postal code" value={addr.postalCode} onChange={setField('postalCode')} required minLength={2} maxLength={12} autoComplete="postal-code" />
                </div>
                <input placeholder="Country" value={addr.country} onChange={setField('country')} required minLength={2} maxLength={60} autoComplete="country-name" />
              </>
            )}
            {error && <p className="form-error">{error}</p>}
            <button
              type={user ? 'submit' : 'button'}
              className="btn btn--primary cart-summary__checkout"
              onClick={user ? undefined : handleCheckout}
              disabled={placing}
            >
              {placing ? 'Placing order…' : user ? 'Place Order →' : 'Login to Checkout →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
