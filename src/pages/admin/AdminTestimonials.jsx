import React, { useState } from 'react'
import { api } from '../../api.js'
import { useProducts } from '../../context/ProductsContext.jsx'

const EMPTY = { name: '', rating: '5', text: '' }

export default function AdminTestimonials() {
  const { testimonials, refresh } = useProducts()
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const reset = () => {
    setEditingId(null)
    setForm(EMPTY)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = { name: form.name, rating: Number(form.rating), text: form.text }
    try {
      if (editingId) await api.put(`/testimonials/${editingId}`, payload)
      else await api.post('/testimonials', payload)
      await refresh()
      reset()
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (t) => {
    if (!window.confirm(`${t.name} ka testimonial delete karna hai?`)) return
    try {
      await api.del(`/testimonials/${t.id}`)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <form className="admin-form" onSubmit={submit}>
        <h3>{editingId ? 'Edit testimonial' : 'Add testimonial'}</h3>
        <div className="admin-form__grid">
          <label className="form-field">Name<input value={form.name} onChange={set('name')} required /></label>
          <label className="form-field">Rating (1-5)<input type="number" min="1" max="5" value={form.rating} onChange={set('rating')} required /></label>
        </div>
        <label className="form-field">Text<textarea rows="3" value={form.text} onChange={set('text')} required /></label>
        {error && <p className="form-error">{error}</p>}
        <div className="admin-form__actions">
          <button type="submit" className="btn btn--primary">{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" className="btn btn--outline" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Rating</th><th>Text</th><th></th></tr></thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.rating}★</td>
                <td>{t.text}</td>
                <td className="admin-table__actions">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(t.id)
                      setForm({ name: t.name, rating: String(t.rating), text: t.text })
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => remove(t)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
