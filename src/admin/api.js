// Talks to the PHP API on the server. Every change sends the CSRF token.
let csrf = ''

export function setCsrf(token) {
  csrf = token || ''
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function handle(res) {
  let data = null
  try {
    data = await res.json()
  } catch {
    throw new ApiError(
      res.status === 404
        ? "The admin can't reach the server API. It only works on the live site (or a local PHP server)."
        : `The server sent an unexpected reply (${res.status}).`,
      res.status,
    )
  }
  if (!res.ok || data?.ok === false) throw new ApiError(data?.error || `Something went wrong (${res.status}).`, res.status)
  if (data?.csrf) setCsrf(data.csrf)
  return data
}

export async function get(path) {
  const res = await fetch(`/api/${path}`, { credentials: 'same-origin', headers: { Accept: 'application/json' }, cache: 'no-store' })
  return handle(res)
}

export async function post(path, body = {}) {
  const res = await fetch(`/api/${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-Token': csrf },
    body: JSON.stringify(body),
  })
  return handle(res)
}

export async function upload(file, onProgress) {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload.php')
    xhr.setRequestHeader('X-CSRF-Token', csrf)
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () => {
      let data = null
      try { data = JSON.parse(xhr.responseText) } catch { /* not JSON */ }
      if (xhr.status >= 200 && xhr.status < 300 && data?.ok) resolve(data)
      else reject(new ApiError(data?.error || (xhr.status === 413 ? 'That file is too big for the server.' : 'The upload failed. Try again.'), xhr.status))
    }
    xhr.onerror = () => reject(new ApiError('The upload failed. Check your internet connection.', 0))
    xhr.send(fd)
  })
}

export const admin = (action, body) => (body === undefined ? get(`admin.php?action=${action}`) : post(`admin.php?action=${action}`, body))
