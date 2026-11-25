import { useRef, useState } from 'react'
import { submitForm } from '../lib/submitForm'
import { useContent } from '../content/ContentContext'

export const labelClass = 'block font-rajdhani font-semibold text-text-primary text-sm uppercase tracking-wider mb-2'

export function inputClass(hasError) {
  return `w-full font-dm-sans text-text-primary bg-white px-4 py-3 border-2 outline-none transition-all duration-200 ${
    hasError ? 'border-accent-red' : 'border-border-light focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]'
  }`
}

export function FieldError({ id, children }) {
  if (!children) return null
  return <p id={id} className="font-dm-sans text-ink-red text-base mt-1.5" role="alert">{children}</p>
}

/** Hidden field that only spam bots fill in. */
export function Honeypot({ id, value, onChange }) {
  return (
    <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
      <label htmlFor={id}>Leave this field empty</label>
      <input id={id} type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

/** Shared state + submit logic for the Contact and Membership forms. */
export function useSiteForm(formName, initial, validate) {
  const { site } = useContent()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const startedAt = useRef(Date.now())

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(evt) {
    evt.preventDefault()
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(`${formName}-${Object.keys(e)[0]}`)?.focus()
      return
    }
    setSending(true)
    setSendError('')
    try {
      await submitForm(formName, { ...form, website: honeypot }, startedAt.current)
      setSubmitted(true)
    } catch (err) {
      if (err.fields) setErrors(err.fields)
      setSendError(err.fields ? 'fields' : 'unsent')
    } finally {
      setSending(false)
    }
  }

  return { form, set, errors, sending, sendError, submitted, honeypot, setHoneypot, onSubmit, email: site.contact_email }
}

export function SendError({ kind, email }) {
  if (!kind) return null
  return (
    <div className="p-4 bg-[#FDECEF] border-l-4 border-accent-red font-dm-sans text-text-primary text-base" role="alert">
      {kind === 'fields' ? (
        'Some fields need attention. Check the messages above.'
      ) : (
        <>
          The message didn't go through. Try again, or email us at{' '}
          <a className="font-semibold underline text-ink-red" href={`mailto:${email}`}>{email}</a>.
        </>
      )}
    </div>
  )
}

export const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '')
