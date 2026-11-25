import { useState } from 'react'
import { post } from './api'
import { btnPrimary, inputCls, Label } from './fields'

function Shell({ title, children }) {
  return (
    <div className="min-h-screen dark-textured flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <img src="/digra-logo-nav.png" alt="DiGRA SA" className="h-10 w-auto mb-6 mx-auto" />
        <div className="bg-white p-7 sm:p-8 border-t-4 border-accent-gold shadow-[8px_8px_0_rgba(0,0,0,0.3)]">
          <h1 className="font-rajdhani font-bold text-3xl text-deep-purple mb-1">{title}</h1>
          {children}
        </div>
        <p className="text-center mt-6"><a href="/" className="font-dm-sans text-white/80 underline text-sm">Back to the website</a></p>
      </div>
    </div>
  )
}

function Err({ children }) {
  return children ? <p className="p-3 bg-[#FDECEF] border-l-4 border-accent-red text-ink-red font-dm-sans text-[15px]" role="alert">{children}</p> : null
}

export default function Login({ onLogin }) {
  const reset = new URLSearchParams(window.location.search).get('reset')
  const [mode, setMode] = useState(reset ? 'reset' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function run(fn) {
    setBusy(true)
    setError('')
    try { await fn() } catch (e) { setError(e.message) } finally { setBusy(false) }
  }

  if (mode === 'forgot') {
    return (
      <Shell title="Reset your password">
        <p className="font-dm-sans text-text-secondary mb-5">Enter your email and we'll send you a link to choose a new password.</p>
        {info ? (
          <p className="p-3 bg-[#E9F8EE] border-l-4 border-ink-green font-dm-sans" role="status">{info}</p>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); run(async () => { await post('auth.php?action=forgot', { email }); setInfo('If that email has an account, a reset link is on its way. It works for one hour. Check your spam folder too.') }) }}>
            <div><Label htmlFor="f-email">Email</Label><input id="f-email" type="email" autoComplete="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <Err>{error}</Err>
            <button className={`${btnPrimary} w-full min-h-12`} disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
          </form>
        )}
        <button type="button" className="mt-5 underline font-dm-sans text-sm text-text-secondary" onClick={() => { setMode('login'); setInfo(''); setError('') }}>Back to sign in</button>
      </Shell>
    )
  }

  if (mode === 'reset') {
    return (
      <Shell title="Choose a new password">
        {info ? (
          <>
            <p className="p-3 bg-[#E9F8EE] border-l-4 border-ink-green font-dm-sans mt-4" role="status">{info}</p>
            <button type="button" className={`${btnPrimary} w-full min-h-12 mt-5`} onClick={() => { window.history.replaceState(null, '', '/admin'); setMode('login'); setInfo('') }}>Sign in</button>
          </>
        ) : (
          <form className="space-y-4 mt-4" onSubmit={(e) => { e.preventDefault(); run(async () => { await post('auth.php?action=reset', { token: reset, password }); setInfo('Your password has been changed. You can sign in now.') }) }}>
            <div><Label htmlFor="r-pass" help="At least 10 characters. A short sentence is easy to remember.">New password</Label><input id="r-pass" type="password" autoComplete="new-password" minLength={10} required className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Err>{error}</Err>
            <button className={`${btnPrimary} w-full min-h-12`} disabled={busy}>{busy ? 'Saving…' : 'Save new password'}</button>
          </form>
        )}
      </Shell>
    )
  }

  return (
    <Shell title="Website admin">
      <p className="font-dm-sans text-text-secondary mb-5">Sign in to update the DiGRA South Africa website.</p>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); run(async () => { const d = await post('auth.php?action=login', { email, password }); onLogin(d.user) }) }}>
        <div><Label htmlFor="l-email">Email</Label><input id="l-email" type="email" autoComplete="username" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><Label htmlFor="l-pass">Password</Label><input id="l-pass" type="password" autoComplete="current-password" required className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Err>{error}</Err>
        <button className={`${btnPrimary} w-full min-h-12`} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <button type="button" className="mt-5 underline font-dm-sans text-sm text-text-secondary" onClick={() => { setMode('forgot'); setError('') }}>Forgot your password?</button>
    </Shell>
  )
}
