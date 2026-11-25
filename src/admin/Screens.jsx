import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiDownload, FiEdit3, FiFile, FiMail, FiTrash2, FiUpload, FiUsers } from 'react-icons/fi'
import { COLLECTIONS, PAGES } from '../content/schema'
import { normalizeEvent } from '../content/normalize'
import { admin, upload } from './api'
import { useAdmin } from './AdminContext'
import { Label, btnDanger, btnGhost, btnPrimary, inputCls } from './fields'

const H1 = ({ children, sub }) => (
  <header className="mb-6">
    <h1 className="font-rajdhani font-bold text-[34px] leading-tight text-deep-purple">{children}</h1>
    {sub && <p className="font-dm-sans text-text-secondary mt-1 max-w-2xl">{sub}</p>}
  </header>
)
const Card = ({ children, className = '' }) => <section className={`bg-white border-2 border-[#EEE9FA] p-5 sm:p-6 ${className}`}>{children}</section>
const H2 = ({ children }) => <h2 className="font-rajdhani font-bold text-xl text-deep-purple mb-3">{children}</h2>

// ── Overview ────────────────────────────────────────────────────────────
export function Overview() {
  const { data, user } = useAdmin()
  const c = data.collections
  const upcoming = (c.events || []).filter((e) => e._published).map((e) => normalizeEvent(e)).filter((e) => e.status === 'upcoming')
  const vacant = (c.team || []).filter((m) => m.vacant && m._published).length
  const tasks = [
    { to: '/admin/list/news/new', icon: FiEdit3, title: 'Post news', text: 'Announcements, recaps, calls for nominations.' },
    { to: '/admin/list/events/new', icon: FiCalendar, title: 'Add an event', text: 'It moves to Past events by itself after it ends.' },
    { to: '/admin/list/team', icon: FiUsers, title: 'Update the board', text: 'Names, photos, bios and vacant seats.' },
    { to: '/admin/messages', icon: FiMail, title: 'Read messages', text: data.unread ? `${data.unread} new from the website forms.` : 'Contact and membership form messages.' },
  ]
  return (
    <div>
      <H1 sub="Everything on the website can be changed from here. Nothing you do here needs a developer.">Hello, {user.name.split(' ')[0]}</H1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {tasks.map(({ to, icon: Icon, title, text }) => (
          <Link key={to} to={to} className="group flex gap-4 items-start bg-white border-2 border-[#EEE9FA] hover:border-accent-gold p-5 transition-colors">
            <span className="w-11 h-11 shrink-0 flex items-center justify-center bg-deep-purple text-accent-gold"><Icon size={20} aria-hidden="true" /></span>
            <span>
              <span className="block font-rajdhani font-bold text-xl text-deep-purple group-hover:underline">{title}</span>
              <span className="block font-dm-sans text-[15px] text-text-secondary">{text}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <H2>At a glance</H2>
          <dl className="font-dm-sans space-y-1.5 text-[15px]">
            <div className="flex justify-between"><dt>Upcoming events</dt><dd className="font-semibold">{upcoming.length}</dd></div>
            <div className="flex justify-between"><dt>News stories</dt><dd className="font-semibold">{(c.news || []).filter((n) => n._published).length}</dd></div>
            <div className="flex justify-between"><dt>People on the board</dt><dd className="font-semibold">{(c.team || []).filter((m) => !m.vacant && m._published).length}</dd></div>
            <div className="flex justify-between"><dt>Vacant seats</dt><dd className="font-semibold">{vacant}</dd></div>
            <div className="flex justify-between"><dt>Unread messages</dt><dd className="font-semibold">{data.unread}</dd></div>
          </dl>
        </Card>
        <Card className="lg:col-span-2">
          <H2>Page text</H2>
          <div className="flex flex-wrap gap-2">
            {PAGES.map((p) => <Link key={p.key} to={`/admin/page/${p.key}`} className={btnGhost}>{p.label}</Link>)}
          </div>
          <p className="font-dm-sans text-sm text-text-secondary mt-4">New to this? Read the <Link to="/admin/guide" className="underline">keeper's guide</Link>. It takes five minutes.</p>
        </Card>
      </div>
    </div>
  )
}

// ── Messages ────────────────────────────────────────────────────────────
export function Messages() {
  const { setData, toast } = useAdmin()
  const [list, setList] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const load = () => admin('submissions').then((d) => setList(d.submissions)).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])
  useEffect(() => { if (list) setData((d) => ({ ...d, unread: list.filter((m) => !m.is_read).length })) }, [list, setData])

  async function mark(m, read) {
    try { await admin('submission_read', { id: m.id, read }); setList((l) => l.map((x) => (x.id === m.id ? { ...x, is_read: read } : x))) } catch (e) { toast(e.message, 'error') }
  }
  async function remove(m) {
    if (!window.confirm(`Delete the message from ${m.name}? This can't be undone.`)) return
    try { await admin('submission_delete', { id: m.id }); setList((l) => l.filter((x) => x.id !== m.id)); toast('Message deleted.') } catch (e) { toast(e.message, 'error') }
  }

  const shown = (list || []).filter((m) => filter === 'all' || (filter === 'unread' ? !m.is_read : m.form === filter))
  return (
    <div>
      <H1 sub="Everything sent through the Contact and Membership forms. Each message is also emailed to the address in Site settings.">Messages</H1>
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Show">
        {[['all', 'All'], ['unread', 'Unread'], ['contact', 'Contact form'], ['membership', 'Membership']].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFilter(k)} aria-pressed={filter === k} className={filter === k ? btnPrimary : btnGhost}>{l}</button>
        ))}
      </div>
      {error && <p className="text-ink-red">{error}</p>}
      {!list && !error && <p className="font-dm-sans">Loading…</p>}
      {list && !shown.length && <Card><p className="font-dm-sans text-text-secondary">No messages here yet.</p></Card>}
      <div className="space-y-3">
        {shown.map((m) => (
          <article key={m.id} className={`bg-white border-2 p-5 ${m.is_read ? 'border-[#EEE9FA]' : 'border-accent-gold'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-dm-sans font-semibold text-deep-purple text-lg">{m.name} {!m.is_read && <span className="ml-2 px-2 py-0.5 bg-accent-gold text-deep-purple font-rajdhani font-bold text-xs uppercase tracking-wider align-middle">New</span>}</p>
                <p className="font-dm-sans text-sm text-text-secondary">
                  <a href={`mailto:${m.email}`} className="underline">{m.email}</a> · {m.form === 'membership' ? 'Membership form' : 'Contact form'} · {m.created_at.slice(0, 16)}
                  {!m.emailed && <span className="text-ink-red"> · The email copy didn't send</span>}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message to DiGRA South Africa')}`} className={btnPrimary} onClick={() => mark(m, true)}><FiMail /> Reply</a>
                <button type="button" className={btnGhost} onClick={() => mark(m, !m.is_read)}>{m.is_read ? 'Mark unread' : 'Mark read'}</button>
                <button type="button" className={btnDanger} onClick={() => remove(m)} aria-label={`Delete message from ${m.name}`}><FiTrash2 /></button>
              </div>
            </div>
            <dl className="font-dm-sans text-[15px] space-y-2">
              {Object.entries(m.data || {}).filter(([, v]) => v).map(([k, v]) => (
                <div key={k}><dt className="font-semibold text-deep-purple">{k}</dt><dd className="whitespace-pre-wrap text-text-primary">{v}</dd></div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </div>
  )
}

// ── Files ───────────────────────────────────────────────────────────────
export function Files() {
  const { toast } = useAdmin()
  const [files, setFiles] = useState(null)
  const [pct, setPct] = useState(null)
  const ref = useRef(null)
  const load = () => admin('media').then((d) => setFiles(d.files)).catch((e) => toast(e.message, 'error'))
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const isImg = (u) => /\.(webp|jpe?g|png|gif)$/i.test(u)
  return (
    <div>
      <H1 sub="Photos and PDFs you've uploaded. Photos are resized and compressed automatically. Copy a file's address to use it anywhere a link is asked for.">Files</H1>
      <div className="mb-6">
        <input ref={ref} type="file" className="sr-only" tabIndex={-1} accept="image/*,application/pdf" onChange={async (e) => {
          const f = e.target.files?.[0]; e.target.value = ''
          if (!f) return
          setPct(0)
          try { await upload(f, setPct); toast('Uploaded.'); load() } catch (err) { toast(err.message, 'error') } finally { setPct(null) }
        }} />
        <button type="button" className={btnPrimary} onClick={() => ref.current?.click()} disabled={pct !== null}><FiUpload /> {pct !== null ? `Uploading ${pct}%` : 'Upload a file'}</button>
      </div>
      {!files && <p className="font-dm-sans">Loading…</p>}
      {files && !files.length && <Card><p className="font-dm-sans text-text-secondary">Nothing uploaded yet.</p></Card>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {(files || []).map((f) => (
          <figure key={f.url} className="bg-white border-2 border-[#EEE9FA]">
            <a href={f.url} target="_blank" rel="noreferrer">
              {isImg(f.url) ? <img src={f.url} alt="" loading="lazy" className="w-full aspect-square object-cover bg-bg-tint" /> : <span className="w-full aspect-square flex items-center justify-center bg-bg-tint"><FiFile size={36} aria-hidden="true" /></span>}
            </a>
            <figcaption className="p-2">
              <p className="font-dm-sans text-xs text-text-secondary truncate" title={f.url}>{f.url.split('/').pop()}</p>
              <p className="font-dm-sans text-xs text-text-secondary">{Math.round(f.size / 1024)} KB</p>
              <div className="flex gap-1 mt-1">
                <button type="button" className="font-dm-sans text-xs underline" onClick={() => { navigator.clipboard?.writeText(f.url); toast('Address copied.') }}>Copy address</button>
                <span className="flex-1" />
                <button type="button" className="font-dm-sans text-xs underline text-ink-red" onClick={async () => {
                  if (!window.confirm('Delete this file? Anything using it on the website will show a broken image.')) return
                  try { await admin('media_delete', { url: f.url }); load() } catch (e) { toast(e.message, 'error') }
                }}>Delete</button>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

// ── People who can sign in ──────────────────────────────────────────────
export function People() {
  const { user, toast } = useAdmin()
  const [list, setList] = useState(null)
  const [edit, setEdit] = useState(null)
  const load = () => admin('users').then((d) => setList(d.users)).catch((e) => toast(e.message, 'error'))
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (user.role !== 'admin') return <p className="font-dm-sans">Only administrators can manage who signs in.</p>

  async function save(e) {
    e.preventDefault()
    try { await admin('user_save', edit); toast(edit.id ? 'Account updated.' : 'Account created. Send them the sign-in address and their password.'); setEdit(null); load() } catch (err) { toast(err.message, 'error') }
  }
  return (
    <div>
      <H1 sub="Who can sign in to this admin. Keepers can change all website content. Administrators can also add and remove people and restore backups.">People who can sign in</H1>
      <button type="button" className={`${btnPrimary} mb-4`} onClick={() => setEdit({ name: '', email: '', role: 'editor', password: '' })}>Add a person</button>
      {edit && (
        <Card className="mb-6">
          <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label htmlFor="u-name">Name</Label><input id="u-name" required className={inputCls} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
            <div><Label htmlFor="u-email">Email</Label><input id="u-email" type="email" required className={inputCls} value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></div>
            <div>
              <Label htmlFor="u-role">Access</Label>
              <select id="u-role" className={inputCls} value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })}>
                <option value="editor">Keeper (edits content)</option>
                <option value="admin">Administrator (also manages people and backups)</option>
              </select>
            </div>
            <div><Label htmlFor="u-pass" help={edit.id ? 'Leave empty to keep their current password.' : 'At least 10 characters. They can change it later.'}>Password</Label><input id="u-pass" type="text" autoComplete="new-password" className={inputCls} value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} /></div>
            <div className="sm:col-span-2 flex gap-2"><button className={btnPrimary}>Save</button><button type="button" className={btnGhost} onClick={() => setEdit(null)}>Cancel</button></div>
          </form>
        </Card>
      )}
      <ul className="bg-white border-2 border-[#EEE9FA] divide-y divide-[#EEE9FA]">
        {(list || []).map((u) => (
          <li key={u.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="flex-1 font-dm-sans">
              <p className="font-semibold text-deep-purple">{u.name} {Number(u.id) === user.id && <span className="text-text-secondary font-normal">(you)</span>}</p>
              <p className="text-sm text-text-secondary">{u.email} · {u.role === 'admin' ? 'Administrator' : 'Keeper'} · {u.last_login ? `last signed in ${u.last_login.slice(0, 10)}` : 'never signed in'}</p>
            </div>
            <button type="button" className={btnGhost} onClick={() => setEdit({ ...u, id: Number(u.id), password: '' })}>Edit</button>
            {Number(u.id) !== user.id && (
              <button type="button" className={btnDanger} onClick={async () => {
                if (!window.confirm(`Remove ${u.name}'s access?`)) return
                try { await admin('user_delete', { id: Number(u.id) }); load() } catch (e) { toast(e.message, 'error') }
              }}>Remove</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Backups ─────────────────────────────────────────────────────────────
export function Backups() {
  const { user, reload, toast } = useAdmin()
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  return (
    <div>
      <H1 sub="A backup is one file with all the website's text, events, news and people (not the photo files themselves).">Backups</H1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <H2>Download a backup</H2>
          <p className="font-dm-sans text-[15px] text-text-secondary mb-4">Do this every few months, and before big changes. Keep the file somewhere safe, like the chapter's shared drive.</p>
          <a href="/api/admin.php?action=export" className={btnPrimary}><FiDownload /> Download backup</a>
        </Card>
        <Card>
          <H2>Restore from a backup</H2>
          {user.role !== 'admin' ? (
            <p className="font-dm-sans text-[15px] text-text-secondary">Ask an administrator to restore a backup.</p>
          ) : (
            <>
              <p className="font-dm-sans text-[15px] text-text-secondary mb-4">This replaces everything on the website with what's in the file. A copy of the current content is saved first.</p>
              <input ref={ref} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} onChange={async (e) => {
                const f = e.target.files?.[0]; e.target.value = ''
                if (!f) return
                if (!window.confirm(`Replace all website content with "${f.name}"?`)) return
                setBusy(true)
                try {
                  const backup = JSON.parse(await f.text())
                  await admin('import', { backup })
                  await reload()
                  toast('Backup restored.')
                } catch (err) { toast(err instanceof SyntaxError ? "That file isn't a backup." : err.message, 'error') } finally { setBusy(false) }
              }} />
              <button type="button" className={btnDanger} onClick={() => ref.current?.click()} disabled={busy}><FiUpload /> {busy ? 'Restoring…' : 'Choose backup file'}</button>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

// ── My account ──────────────────────────────────────────────────────────
export function Account() {
  const { user, setUser, toast } = useAdmin()
  const [profile, setProfile] = useState({ name: user.name, email: user.email })
  const [pw, setPw] = useState({ current: '', new: '' })
  return (
    <div>
      <H1>My account</H1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <H2>Name and email</H2>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault()
            try { await admin('update_profile', profile); setUser({ ...user, ...profile }); toast('Saved.') } catch (err) { toast(err.message, 'error') }
          }}>
            <div><Label htmlFor="a-name">Name</Label><input id="a-name" className={inputCls} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
            <div><Label htmlFor="a-email" help="Used to sign in and for password resets.">Email</Label><input id="a-email" type="email" className={inputCls} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
            <button className={btnPrimary}>Save</button>
          </form>
        </Card>
        <Card>
          <H2>Change password</H2>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault()
            try { await admin('change_password', pw); setPw({ current: '', new: '' }); toast('Password changed.') } catch (err) { toast(err.message, 'error') }
          }}>
            <div><Label htmlFor="a-cur">Current password</Label><input id="a-cur" type="password" autoComplete="current-password" className={inputCls} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></div>
            <div><Label htmlFor="a-new" help="At least 10 characters.">New password</Label><input id="a-new" type="password" autoComplete="new-password" minLength={10} className={inputCls} value={pw.new} onChange={(e) => setPw({ ...pw, new: e.target.value })} /></div>
            <button className={btnPrimary}>Change password</button>
          </form>
        </Card>
      </div>
    </div>
  )
}

// ── Keeper's guide ──────────────────────────────────────────────────────
function S({ title, children }) {
  return (
    <Card className="mb-4">
      <H2>{title}</H2>
      <div className="font-dm-sans text-[15px] text-text-primary leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:underline [&_code]:bg-bg-tint [&_code]:px-1">{children}</div>
    </Card>
  )
}

export function Guide() {
  return (
    <div className="max-w-3xl">
      <H1 sub="How to keep the DiGRA South Africa website up to date. Nothing here can break the site, and every save can be undone.">Keeper's guide</H1>
      <S title="The basics">
        <ul>
          <li><strong>Lists</strong> (Events, News, Board and people, Research areas, Journals, Teaching resources) hold things there are many of. Add, edit, reorder, hide or delete them.</li>
          <li><strong>Page text</strong> holds every heading, paragraph, button and label on each page, plus the Menu, Footer and Site settings.</li>
          <li>Changes go live as soon as you press <strong>Save changes</strong>. Visitors may need to refresh.</li>
          <li>Made a mistake? Open <strong>Earlier versions</strong> on any page or item to bring back what was there before. Deleted items can be brought back from <strong>Recently deleted</strong> at the bottom of each list.</li>
        </ul>
      </S>
      <S title="Common jobs">
        <ul>
          <li><strong>Add an event:</strong> <Link to="/admin/list/events/new">Events → Add event</Link>. Fill in the start and end dates. The event shows under Upcoming until the end date has passed, then moves to Past events on its own. Link a recap story under "Recap article" once it's written.</li>
          <li><strong>Post news:</strong> <Link to="/admin/list/news/new">News → Add story</Link>. Build the article from paragraphs, sub-headings, lists and photos. The newest story is featured on the Home page.</li>
          <li><strong>Fill a vacant board seat:</strong> open the vacant card in <Link to="/admin/list/team">Board and people</Link>, turn off "Vacant seat", then add the name, photo and bio.</li>
          <li><strong>Show or hide the yellow notice bar:</strong> <Link to="/admin/page/site">Site settings → Notice bar</Link>.</li>
          <li><strong>Reorder a page:</strong> open the page under Page text and use "Sections on this page". The eye button hides a section without losing its text.</li>
          <li><strong>Change where form messages go:</strong> <Link to="/admin/page/site">Site settings → Contact</Link>. Every message is also kept under <Link to="/admin/messages">Messages</Link>.</li>
        </ul>
      </S>
      <S title="Writing tips">
        <ul>
          <li>Leave an empty line between paragraphs.</li>
          <li>Type <code>**words**</code> for <strong>bold</strong>, <code>*words*</code> for <em>italic</em>, and <code>[link text](https://example.com)</code> for a link.</li>
          <li>Links to pages on this site start with a slash, like <code>/events</code> or <code>/news/board-call-for-nominations</code>. A <code>#</code> jumps to a section, like <code>/about#board</code>.</li>
          <li>Photos: upload them straight from your phone or computer. They're resized automatically. Always fill in "Describe the photo" for people who use screen readers.</li>
        </ul>
      </S>
      <S title="Looking after the site">
        <ul>
          <li>Download a <Link to="/admin/backup">backup</Link> every few months.</li>
          <li>Give each keeper their own sign-in under <Link to="/admin/people">People</Link>. Don't share passwords. When someone leaves the board, remove their access.</li>
          <li>Forgot your password? Use "Forgot your password?" on the sign-in page.</li>
          <li>The site is hosted on Axxess (cPanel) at digrasa.co.za. The domain and hosting renew yearly. Make sure someone on the board receives the Axxess invoices.</li>
        </ul>
      </S>
    </div>
  )
}

export const LIST_LINKS = COLLECTIONS.map((c) => ({ to: `/admin/list/${c.key}`, label: c.label }))
export const PAGE_LINKS = PAGES.map((p) => ({ to: `/admin/page/${p.key}`, label: p.label }))

