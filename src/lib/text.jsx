import { Fragment } from 'react'
import { Link } from 'react-router-dom'

// ── Links ───────────────────────────────────────────────────────────────

/** Only allow web, email, phone and on-site links (blocks javascript: and friends). */
export function safeUrl(url) {
  const u = String(url || '').trim()
  if (!u) return ''
  if (u.startsWith('/') || u.startsWith('#')) return u
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u)) return 'https://' + u   // "digra.org" → https://digra.org
  return ''
}

export function isExternal(url) {
  return /^(https?:|mailto:|tel:)/i.test(url || '')
}

/** A link that works for both on-site paths and outside websites. */
export function SmartLink({ to, children, ...rest }) {
  const href = safeUrl(to)
  if (!href) return <span {...rest}>{children}</span>
  if (isExternal(href)) {
    const web = /^https?:/i.test(href)
    return (
      <a href={href} {...(web ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    )
  }
  return <Link to={href} {...rest}>{children}</Link>
}

// ── Light formatting inside text: **bold**, *italic*, [label](url) ──────

const TOKEN_SRC = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/.source

export function Inline({ text, linkClassName = 'underline underline-offset-2 font-medium' }) {
  const s = String(text ?? '')
  const out = []
  let last = 0
  let m
  let i = 0
  const TOKEN = new RegExp(TOKEN_SRC, 'g')
  while ((m = TOKEN.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index))
    const t = m[0]
    if (t.startsWith('**')) out.push(<strong key={i++}>{t.slice(2, -2)}</strong>)
    else if (t.startsWith('[')) {
      const [, label, url] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(t)
      out.push(<SmartLink key={i++} to={url} className={linkClassName}>{label}</SmartLink>)
    } else out.push(<em key={i++}>{t.slice(1, -1)}</em>)
    last = m.index + t.length
  }
  if (last < s.length) out.push(s.slice(last))
  return <Fragment>{out}</Fragment>
}

/** Splits on blank lines into paragraphs. Single line breaks are kept. */
export function paragraphs(text) {
  return String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
}

export function Paras({ text, className = '', lastClassName }) {
  const list = paragraphs(text)
  return list.map((p, i) => (
    <p key={i} className={i === list.length - 1 && lastClassName != null ? lastClassName : className}>
      {p.split('\n').map((line, j) => (
        <Fragment key={j}>{j > 0 && <br />}<Inline text={line} /></Fragment>
      ))}
    </p>
  ))
}

export function hasText(v) {
  return typeof v === 'string' ? v.trim() !== '' : Array.isArray(v) ? v.length > 0 : !!v
}
