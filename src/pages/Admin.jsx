import React, { useState } from 'react'
import AdminProducts from './admin/AdminProducts.jsx'
import AdminOrders from './admin/AdminOrders.jsx'
import AdminTestimonials from './admin/AdminTestimonials.jsx'

const TABS = [
  { id: 'products', label: 'Products', Component: AdminProducts },
  { id: 'orders', label: 'Orders', Component: AdminOrders },
  { id: 'testimonials', label: 'Testimonials', Component: AdminTestimonials },
]

export default function Admin() {
  const [tab, setTab] = useState('products')
  const Active = TABS.find((t) => t.id === tab).Component

  return (
    <section className="section admin-page">
      <h1 className="section__heading">ADMIN PANEL</h1>
      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`filter-pill ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <Active />
    </section>
  )
}
