// Sends a form to the PHP handler on the Axxess server (public/api/contact.php),
// which emails it to info@digrasa.co.za.

export { CONTACT_EMAIL } from '../data/site'
const ENDPOINT = '/api/contact.php'

export async function submitForm(form, fields, startedAt) {
  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ form, ...fields, startedAt }),
    })
  } catch {
    throw new Error('network')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    // Non-JSON reply (e.g. local dev server without PHP)
  }

  if (!res.ok || !data?.ok) {
    const err = new Error(data?.error || 'failed')
    err.fields = data?.fields
    throw err
  }
  return data
}
