import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, imgUrl } from '../api.js'

export default function Orders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/orders/mine').then(setOrders).catch((err) => setError(err.message))
  }, [])

  if (error) return <p className="form-error orders-msg">{error}</p>
  if (!orders) return <p className="empty-state">Loading…</p>

  if (orders.length === 0) {
    return (
      <section className="section cart-page cart-page--empty">
        <h1>No orders yet</h1>
        <p>Aapne abhi tak koi order place nahi kiya.</p>
        <Link to="/shop" className="btn btn--primary">
          Start Shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="section orders-page">
      <h1 className="section__heading">MY ORDERS</h1>
      <ul className="orders-list">
        {orders.map((o) => (
          <li key={o.id} className="order-card">
            <div className="order-card__head">
              <div>
                <strong>Order #{o.id.slice(-6).toUpperCase()}</strong>
                <span>{new Date(o.createdAt).toLocaleDateString()}</span>
              </div>
              <span className={`status-badge status-badge--${o.status}`}>{o.status}</span>
            </div>
            <ul className="order-card__items">
              {o.items.map((it, i) => (
                <li key={i}>
                  <img src={imgUrl(it.image)} alt={it.name} />
                  <span>
                    {it.name} {it.size && `(${it.size})`} × {it.qty}
                  </span>
                  <span>${(it.price * it.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            {o.shippingAddress && (
              <p className="order-card__address">
                Ship to: {o.shippingAddress.fullName}, {o.shippingAddress.address}, {o.shippingAddress.city}{' '}
                {o.shippingAddress.postalCode}, {o.shippingAddress.country} · {o.shippingAddress.phone}
              </p>
            )}
            <div className="order-card__total">
              {o.discount > 0 && <span>Discount: −${o.discount.toFixed(2)}</span>}
              <span>Shipping: ${o.shipping.toFixed(2)}</span>
              <strong>Total: ${o.total.toFixed(2)}</strong>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
