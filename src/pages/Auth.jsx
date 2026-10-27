import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// mode = 'login' | 'register'
export default function Auth({ mode }) {
  const isLogin = mode === 'login'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={redirectTo} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isLogin) await login(email, password)
      else await register(name, email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}</h1>

        {!isLogin && (
          <label className="form-field">
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} autoComplete="name" />
          </label>
        )}
        <label className="form-field">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label className="form-field">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          {!isLogin && <small>Kam az kam 8 characters</small>}
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Please wait…' : isLogin ? 'Login' : 'Register'}
        </button>

        <p className="auth-card__switch">
          {isLogin ? (
            <>
              Account nahi hai? <Link to="/register" state={location.state}>Register karein</Link>
            </>
          ) : (
            <>
              Pehle se account hai? <Link to="/login" state={location.state}>Login karein</Link>
            </>
          )}
        </p>
      </form>
    </section>
  )
}
