import React, { useState } from 'react'
import { api, imgUrl } from '../../api.js'
import { useProducts } from '../../context/ProductsContext.jsx'

const EMPTY = {
  name: '', price: '', oldPrice: '', category: '', style: 'casual', gender: 'men', tag: '',
  colors: '', sizes: '', image: '', rating: '0', reviews: '0', description: '',
}
const toList = (s) => s.split(',').map((x) => x.trim()).filter(Boolean)

export default function AdminProducts() {
  const { rawProducts, refresh } = useProducts()
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const reset = () => {
    setEditingId(null)
    setForm(EMPTY)
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : '',
      category: p.category,
      style: p.style,
      gender: p.gender,
      tag: p.tag || '',
      colors: (p.colors || []).join(', '),
      sizes: (p.sizes || []).join(', '),
      image: p.image,
      rating: String(p.rating),
      reviews: String(p.reviews),
      description: p.description || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMsg({ type: '', text: '' })
    const payload = {
      name: form.name,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      category: form.category,
      style: form.style,
      gender: form.gender,
      tag: form.tag,
      colors: toList(form.colors),
      sizes: toList(form.sizes),
      image: form.image,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      description: form.description,
    }
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload)
      else await api.post('/products', payload)
      await refresh()
      setMsg({ type: 'ok', text: editingId ? 'Product update ho gaya' : 'Product add ho gaya' })
      reset()
    } catch (err) {
      setMsg({ type: 'err', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`"${p.name}" delete karna hai?`)) return
    try {
      await api.del(`/products/${p.id}`)
      await refresh()
      if (editingId === p.id) reset()
      setMsg({ type: 'ok', text: 'Product delete ho gaya' })
    } catch (err) {
      setMsg({ type: 'err', text: err.message })
    }
  }

  const upload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    try {
      const { url } = await api.upload(fd)
      setForm((f) => ({ ...f, image: url }))
    } catch (err) {
      setMsg({ type: 'err', text: err.message })
    }
    e.target.value = ''
  }

  return (
    <div>
      <form className="admin-form" onSubmit={submit}>
        <h3>{editingId ? 'Edit product' : 'Add new product'}</h3>

        <div className="admin-form__grid">
          <label className="form-field">Name<input value={form.name} onChange={set('name')} required /></label>
          <label className="form-field">Category<input value={form.category} onChange={set('category')} required placeholder="T-shirts, Jeans…" /></label>
          <label className="form-field">Price ($)<input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required /></label>
          <label className="form-field">Old price ($) <small>(sale ke liye)</small><input type="number" min="0" step="0.01" value={form.oldPrice} onChange={set('oldPrice')} /></label>
          <label className="form-field">Style
            <select value={form.style} onChange={set('style')}>
              {['casual', 'formal', 'party', 'gym'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="form-field">Gender
            <select value={form.gender} onChange={set('gender')}>
              {['men', 'women', 'unisex'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="form-field">Tag
            <select value={form.tag} onChange={set('tag')}>
              <option value="">none</option>
              <option value="new">new (New Arrivals)</option>
              <option value="top">top (Top Selling)</option>
            </select>
          </label>
          <label className="form-field">Rating (0-5)<input type="number" min="0" max="5" step="0.5" value={form.rating} onChange={set('rating')} /></label>
          <label className="form-field">Reviews count<input type="number" min="0" value={form.reviews} onChange={set('reviews')} /></label>
          <label className="form-field">Colors <small>(hex, comma se alag: #000000, #3b5375)</small><input value={form.colors} onChange={set('colors')} /></label>
          <label className="form-field">Sizes <small>(comma se alag: S, M, L)</small><input value={form.sizes} onChange={set('sizes')} /></label>
        </div>

        <div className="form-field">
          Image
          <div className="admin-form__image">
            <input value={form.image} onChange={set('image')} placeholder="https://… ya upload karein" required />
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={upload} />
            {form.image && <img src={imgUrl(form.image)} alt="preview" />}
          </div>
        </div>

        <label className="form-field">Description<textarea rows="3" value={form.description} onChange={set('description')} /></label>

        {msg.text && <p className={msg.type === 'ok' ? 'form-ok' : 'form-error'}>{msg.text}</p>}

        <div className="admin-form__actions">
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? 'Saving…' : editingId ? 'Update product' : 'Add product'}
          </button>
          {editingId && (
            <button type="button" className="btn btn--outline" onClick={reset}>Cancel</button>
          )}
        </div>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Tag</th><th></th></tr>
          </thead>
          <tbody>
            {rawProducts.map((p) => (
              <tr key={p.id}>
                <td><img src={imgUrl(p.image)} alt="" className="admin-table__thumb" /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price}{p.oldPrice ? <s> ${p.oldPrice}</s> : null}</td>
                <td>{p.tag || '-'}</td>
                <td className="admin-table__actions">
                  <button type="button" onClick={() => startEdit(p)}>Edit</button>
                  <button type="button" className="danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rawProducts.length === 0 && <p className="empty-state">Koi product nahi hai.</p>}
      </div>
    </div>
  )
}
