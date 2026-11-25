import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { FiExternalLink, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { get, post } from './api'
import { AdminContext } from './AdminContext'
import Login from './Login'
import PageEditor from './PageEditor'
import { CollectionList, ItemEditor } from './Collections'
import { Account, Backups, Files, Guide, LIST_LINKS, Messages, Overview, PAGE_LINKS, People } from './Screens'

function Toasts({ items, dismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2 max-w-sm" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} role={t.kind === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 px-4 py-3 shadow-[4px_4px_0_rgba(28,10,58,0.25)] font-dm-sans text-[15px] ${t.kind === 'error' ? 'bg-[#FDECEF] border-l-4 border-accent-red text-ink-red' : 'bg-deep-purple text-white border-l-4 border-accent-green'}`}>
          <span className="flex-1">{t.msg}</span>
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="opacity-70 hover:opacity-100"><FiX /></button>
        </div>
      ))}
    </div>
  )
}

const link = ({ isActive }) =>
  `flex items-center justify-between px-4 min-h-10 font-dm-sans text-[15px] border-l-4 ${isActive ? 'border-accent-gold bg-white/10 text-white' : 'border-transparent text-white/75 hover:text-white hover:bg-white/5'}`

function Group({ title, children }) {
  return (
    <div className="mt-5">
      <p className="px-4 mb-1 font-rajdhani font-bold text-xs uppercase tracking-[2px] text-accent-gold">{title}</p>
      {children}
    </div>
  )
}

function Sidebar({ user, unread, onNavigate, onLogout }) {
  return (
    <nav className="flex flex-col h-full" aria-label="Admin">
      <div className="px-4 pt-5 pb-3 border-b border-white/10">
        <img src="/digra-logo-nav.png" alt="DiGRA SA" className="h-8 w-auto" />
        <p className="font-rajdhani text-white/70 text-sm mt-2">Website admin</p>
      </div>
      <div className="flex-1 overflow-y-auto pb-6" onClick={onNavigate}>
        <div className="mt-3"><NavLink end to="/admin" className={link}>Overview</NavLink></div>
        <Group title="Lists">{LIST_LINKS.map((l) => <NavLink key={l.to} to={l.to} className={link}>{l.label}</NavLink>)}</Group>
        <Group title="Page text">{PAGE_LINKS.map((l) => <NavLink key={l.to} to={l.to} className={link}>{l.label}</NavLink>)}</Group>
        <Group title="Inbox and files">
          <NavLink to="/admin/messages" className={link}>Messages {unread > 0 && <span className="px-1.5 bg-accent-gold text-deep-purple font-rajdhani font-bold text-xs">{unread}</span>}</NavLink>
          <NavLink to="/admin/files" className={link}>Files</NavLink>
        </Group>
        <Group title="Settings">
          {user.role === 'admin' && <NavLink to="/admin/people" className={link}>People who can sign in</NavLink>}
          <NavLink to="/admin/backup" className={link}>Backups</NavLink>
          <NavLink to="/admin/account" className={link}>My account</NavLink>
          <NavLink to="/admin/guide" className={link}>Keeper's guide</NavLink>
        </Group>
      </div>
      <div className="border-t border-white/10 p-3 space-y-1">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-2 min-h-10 font-dm-sans text-white/80 hover:text-white"><FiExternalLink aria-hidden="true" /> View website</a>
        <button type="button" onClick={onLogout} className="flex items-center gap-2 px-2 min-h-10 font-dm-sans text-white/80 hover:text-white w-full text-left"><FiLogOut aria-hidden="true" /> Sign out ({user.name.split(' ')[0]})</button>
      </div>
    </nav>
  )
}

export default function AdminApp() {
  const [user, setUser] = useState(undefined) // undefined = checking, null = signed out
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState([])
  const [menu, setMenu] = useState(false)
  const dirtyRef = useRef(false)
  const location = useLocation()

  const toast = useCallback((msg, kind = 'ok') => {
    const id = Math.random()
    setToasts((t) => [...t, { id, msg, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 9000 : 4000)
  }, [])
  const setDirty = useCallback((v) => { dirtyRef.current = v }, [])

  const reload = useCallback(async () => {
    try {
      const d = await get('admin.php?action=bootstrap')
      setData(d)
      setError('')
    } catch (e) {
      if (e.status === 401) { setUser(null); setData(null) } else setError(e.message)
    }
  }, [])

  useEffect(() => {
    document.title = 'Admin — DiGRA South Africa'
    const meta = document.createElement('meta')
    meta.name = 'robots'; meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    get('auth.php?action=me').then((d) => setUser(d.user)).catch((e) => { setError(e.message); setUser(null) })
    return () => meta.remove()
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- loads data from the server once signed in
  useEffect(() => { if (user) reload() }, [user, reload])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const h = (e) => { if (dirtyRef.current) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  const ctx = useMemo(() => ({ data, setData, reload, user, setUser, toast, setDirty }), [data, reload, user, toast, setDirty])

  if (user === undefined) return <div className="min-h-screen dark-textured" />
  if (!user) {
    return (
      <>
        {error && <p className="fixed top-0 inset-x-0 z-50 bg-[#FDECEF] text-ink-red p-3 text-center font-dm-sans">{error}</p>}
        <Login onLogin={(u) => { window.history.replaceState(null, '', location.pathname); setUser(u) }} />
      </>
    )
  }

  const guardNav = (e) => {
    const a = e.target.closest('a')
    if (a && dirtyRef.current && !window.confirm('You have unsaved changes. Leave without saving?')) { e.preventDefault(); e.stopPropagation(); return }
    if (a) { dirtyRef.current = false; setMenu(false) }
  }
  const logout = async () => {
    if (dirtyRef.current && !window.confirm('You have unsaved changes. Sign out anyway?')) return
    try { await post('auth.php?action=logout') } catch { /* signed out anyway */ }
    setUser(null); setData(null)
  }

  return (
    <AdminContext.Provider value={ctx}>
      <div className="min-h-screen bg-[#F6F4FB] lg:pl-64">
        <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-deep-purple z-30">
          <Sidebar user={user} unread={data?.unread || 0} onNavigate={guardNav} onLogout={logout} />
        </aside>
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-deep-purple px-4 h-14">
          <img src="/digra-logo-nav.png" alt="DiGRA SA admin" className="h-7 w-auto" />
          <button type="button" className="flex items-center gap-2 text-white min-h-11 px-2 font-rajdhani font-bold uppercase" onClick={() => setMenu(true)} aria-expanded={menu}><FiMenu size={22} aria-hidden="true" /> Menu</button>
        </div>
        {menu && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMenu(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-deep-purple">
              <button type="button" className="absolute top-3 right-3 text-white w-10 h-10 flex items-center justify-center" onClick={() => setMenu(false)} aria-label="Close menu"><FiX size={22} /></button>
              <Sidebar user={user} unread={data?.unread || 0} onNavigate={guardNav} onLogout={logout} />
            </aside>
          </div>
        )}
        <main className="px-4 sm:px-8 py-8 max-w-5xl">
          {error && <p className="mb-4 p-3 bg-[#FDECEF] border-l-4 border-accent-red text-ink-red font-dm-sans" role="alert">{error} <button type="button" className="underline" onClick={reload}>Try again</button></p>}
          {!data ? (
            <p className="font-dm-sans text-text-secondary">Loading…</p>
          ) : (
            <Routes>
              <Route index element={<Overview />} />
              <Route path="page/:key" element={<PageEditor />} />
              <Route path="list/:key" element={<CollectionList />} />
              <Route path="list/:key/:id" element={<ItemEditor />} />
              <Route path="messages" element={<Messages />} />
              <Route path="files" element={<Files />} />
              <Route path="people" element={<People />} />
              <Route path="backup" element={<Backups />} />
              <Route path="account" element={<Account />} />
              <Route path="guide" element={<Guide />} />
              <Route path="*" element={<p className="font-dm-sans">That admin page doesn't exist.</p>} />
            </Routes>
          )}
        </main>
      </div>
      <Toasts items={toasts} dismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </AdminContext.Provider>
  )
}
