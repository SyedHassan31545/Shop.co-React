import React, { useEffect, useState } from 'react'
import { api } from '../../api.js'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/orders').then(setOrders).catch((err) => setError(err.message))
  }, [])

  const changeStatus = async (id, status) => {
    try {
      const updated = await api.patch(`/orders/${id}/status`, { status })
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: updated.status } : o)))
    } catch (err) {
      setError(err.message)
    }
  }

  if (!orders && !error) return <p className="empty-state">Loading…</p>

  return (
    <div className="admin-table-wrap">
      {error && <p className="form-error">{error}</p>}
      <table className="admin-table">
        <thead>
          <tr><th>Order</th><th>Customer</th><th>Items</th><th>Ship to</th><th>Total</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          {(orders || []).map((o) => (
            <tr key={o.id}>
              <td>#{o.id.slice(-6).toUpperCase()}</td>
              <td>{o.user ? `${o.user.name} (${o.user.email})` : 'deleted user'}</td>
              <td>{o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}</td>
              <td>
                {o.shippingAddress
                  ? `${o.shippingAddress.fullName}, ${o.shippingAddress.address}, ${o.shippingAddress.city} ${o.shippingAddress.postalCode}, ${o.shippingAddress.country} · ${o.shippingAddress.phone}`
                  : '-'}
              </td>
              <td>${o.total.toFixed(2)}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>
                <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders && orders.length === 0 && <p className="empty-state">Abhi koi order nahi aaya.</p>}
    </div>
  )
}
