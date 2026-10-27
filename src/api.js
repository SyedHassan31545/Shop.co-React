// Backend se baat karne ka chhota wrapper (fetch + JWT token)
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

const TOKEN_KEY = 'shopco:token'
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY)

// "/images/x.png" jaisa relative path backend ke full URL mein badal deta hai
export const imgUrl = (src) => {
  if (!src) return ''
  if (/^(https?:|data:)/.test(src)) return src
  if (src.startsWith('/images/')) return src // frontend ke public/images se
  return `${API_URL}${src.startsWith('/') ? '' : '/'}${src}`
}

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let payload
  if (form) {
    payload = form
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`${API_URL}/api${path}`, { method, headers, body: payload })
  } catch {
    throw new Error('Server se connect nahi ho paya. Kya backend chal raha hai?')
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    // Token expire/invalid ho gaya to logout kara do
    if (res.status === 401 && token && !path.startsWith('/auth/login')) {
      setToken(null)
      window.dispatchEvent(new Event('shopco:logout'))
    }
    const err = new Error(data?.message || 'Kuch galat ho gaya')
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  upload: (formData) => request('/upload', { method: 'POST', form: formData }),
}
