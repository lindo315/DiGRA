import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiArrowDown, FiArrowUp, FiClock, FiCopy, FiEdit2, FiExternalLink, FiEye, FiEyeOff, FiPlus, FiRotateCcw, FiSearch, FiTrash2 } from 'react-icons/fi'
import { collectionByKey } from '../content/schema'
import { normalizeEvent } from '../content/normalize'
import { admin, get } from './api'
import { useAdmin } from './AdminContext'
import { Fields, btnDanger, btnGhost, btnPrimary, iconBtn, inputCls } from './fields'
import { SaveBar } from './PageEditor'
import History from './History'

const titleOf = (col, it) => (col.itemTitle ? col.itemTitle(it) : it[col.titleField]) || `Untitled ${col.singular}`

function publicUrl(colKey, it) {
  if (colKey === 'news' && it.slug) return `/news/${it.slug}`
  return { events: '/events', team: '/about#board', research_areas: '/research#areas', journals: '/research#journals', teaching: '/research#teaching' }[colKey] || '/'
}

function Badge({ children, tone = 'grey' }) {
  const tones = { grey: 'bg-[#EEE9FA] text-text-secondary', green: 'bg-[#E3F6EA] text-ink-green', gold: 'bg-[#FDF1DC] text-ink-gold', red: 'bg-[#FDECEF] text-ink-red' }
  return <span className={`inline-block px-2 py-0.5 font-rajdhani font-bold uppercase tracking-wider text-xs ${tones[tone]}`}>{children}</span>
}

function Deleted({ colKey, onRestored }) {
  const [list, setList] = useState(null)
  const col = collectionByKey[colKey]
  const { toast } = useAdmin()
  useEffect(() => { get(`admin.php?action=deleted&collection=${colKey}`).then((d) => setList(d.items)).catch(() => setList([])) }, [colKey])
  if (!list) return <p className="font-dm-sans text-text-secondary">Loading…</p>
  if (!list.length) return <p className="font-dm-sans text-text-secondary">Nothing has been deleted here.</p>
  return (
    <ul className="divide-y divide-[#EEE9FA]">
      {list.map((r) => (
        <li key={r.id} className="flex items-center gap-3 py-2">
          <div className="flex-1 font-dm-sans">
            <p className="text-deep-purple">{titleOf(col, r.data)}</p>
            <p className="text-sm text-text-secondary">Deleted by {r.saved_by} on {r.created_at.slice(0, 16)}</p>
          </div>
          <button
            type="button" className={btnGhost}
            onClick={async () => {
              try { await admin('restore_deleted', { revision_id: r.id }); toast('Restored. It was added at the end of the list.'); setList(list.filter((x) => x.id !== r.id)); onRestored() } catch (e) { toast(e.message, 'error') }
            }}
          >
            <FiRotateCcw /> Restore
          </button>
        </li>
      ))}
    </ul>
  )
}

export function CollectionList() {
  const { key } = useParams()
  const col = collectionByKey[key]
  const { data, setData, reload, toast } = useAdmin()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const items = useMemo(() => data.collections[key] || [], [data, key])

  if (!col) return <p>That list doesn't exist.</p>

  const shown = q.trim() ? items.filter((it) => JSON.stringify(it).toLowerCase().includes(q.trim().toLowerCase())) : items

  async function reorder(from, to) {
    const next = [...items]
    const [x] = next.splice(from, 1)
    next.splice(to, 0, x)
    setData((d) => ({ ...d, collections: { ...d.collections, [key]: next } }))
    try { await admin('reorder', { collection: key, ids: next.map((i) => i.id) }) } catch (e) { toast(e.message, 'error'); reload() }
  }

  async function togglePublished(it) {
    try {
      await admin('set_published', { id: it.id, published: !it._published })
      setData((d) => ({ ...d, collections: { ...d.collections, [key]: d.collections[key].map((x) => (x.id === it.id ? { ...x, _published: !it._published } : x)) } }))
      toast(it._published ? 'Hidden from the website.' : 'Now showing on the website.')
    } catch (e) { toast(e.message, 'error') }
  }

  async function duplicate(it) {
    const copy = Object.fromEntries(Object.entries(it).filter(([k]) => k !== 'id' && !k.startsWith('_')))
    if (col.titleField && copy[col.titleField]) copy[col.titleField] = `${copy[col.titleField]} (copy)`
    if (key === 'news') copy.slug = `${copy.slug || 'story'}-copy`
    try {
      const r = await admin('save_item', { collection: key, data: copy, published: false })
      await reload()
      toast('Copy made. It stays hidden until you show it.')
      navigate(`/admin/list/${key}/${r.id}`)
    } catch (e) { toast(e.message, 'error') }
  }

  async function remove(it) {
    if (!window.confirm(`Delete "${titleOf(col, it)}"? You can restore it later from "Recently deleted".`)) return
    try {
      await admin('delete_item', { id: it.id })
      setData((d) => ({ ...d, collections: { ...d.collections, [key]: d.collections[key].filter((x) => x.id !== it.id) } }))
      toast('Deleted.')
    } catch (e) { toast(e.message, 'error') }
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-rajdhani font-bold text-[34px] leading-tight text-deep-purple">{col.label}</h1>
          {col.description && <p className="font-dm-sans text-text-secondary mt-1 max-w-2xl">{col.description}</p>}
        </div>
        <Link to={`/admin/list/${key}/new`} className={`${btnPrimary} min-h-11`}><FiPlus /> Add {col.singular}</Link>
      </header>

      {items.length > 6 && (
        <div className="relative mb-4 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
          <input className={`${inputCls} pl-9`} placeholder={`Search ${col.label.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        </div>
      )}
      {col.sortHint && <p className="font-dm-sans text-sm text-text-secondary mb-3">{col.sortHint}</p>}

      <ul className="bg-white border-2 border-[#EEE9FA] divide-y divide-[#EEE9FA]">
        {!shown.length && <li className="p-6 font-dm-sans text-text-secondary">{q ? 'Nothing matches that search.' : `No ${col.label.toLowerCase()} yet. Add the first one.`}</li>}
        {shown.map((it) => {
          const i = items.indexOf(it)
          const img = col.image && it[col.image]
          const ev = key === 'events' ? normalizeEvent(it) : null
          return (
            <li key={it.id} className={`flex items-center gap-3 px-3 py-2.5 ${it._published ? '' : 'bg-[#FAF9FD]'}`}>
              {!q && (
                <div className="flex flex-col">
                  <button type="button" className={`${iconBtn} h-7`} onClick={() => reorder(i, i - 1)} disabled={i === 0} aria-label="Move up"><FiArrowUp /></button>
                  <button type="button" className={`${iconBtn} h-7`} onClick={() => reorder(i, i + 1)} disabled={i === items.length - 1} aria-label="Move down"><FiArrowDown /></button>
                </div>
              )}
              {col.image && (
                <span className="w-11 h-11 shrink-0 bg-bg-tint overflow-hidden">{img && <img src={img} alt="" className="w-full h-full object-cover" />}</span>
              )}
              <Link to={`/admin/list/${key}/${it.id}`} className="flex-1 min-w-0 py-1 group">
                <span className="block font-dm-sans font-semibold text-deep-purple group-hover:underline line-clamp-2 break-words">{titleOf(col, it)}</span>
                <span className="flex flex-wrap gap-2 items-center mt-0.5">
                  {col.subtitle && <span className="font-dm-sans text-sm text-text-secondary truncate">{col.subtitle(it)}</span>}
                  {!it._published && <Badge>Hidden</Badge>}
                  {it.vacant && <Badge tone="gold">Vacant</Badge>}
                  {ev && it._published && <Badge tone={ev.status === 'upcoming' ? 'green' : 'grey'}>{ev.status === 'upcoming' ? 'Upcoming' : 'Past'}</Badge>}
                </span>
              </Link>
              <div className="flex items-center">
                <button type="button" className={iconBtn} onClick={() => togglePublished(it)} aria-label={it._published ? 'Hide from website' : 'Show on website'} title={it._published ? 'Hide from website' : 'Show on website'}>
                  {it._published ? <FiEye /> : <FiEyeOff />}
                </button>
                <Link to={`/admin/list/${key}/${it.id}`} className={`${iconBtn} hidden sm:inline-flex`} aria-label="Edit" title="Edit"><FiEdit2 /></Link>
                <button type="button" className={`${iconBtn} hidden sm:inline-flex`} onClick={() => duplicate(it)} aria-label="Duplicate" title="Duplicate"><FiCopy /></button>
                <button type="button" className={iconBtn} onClick={() => remove(it)} aria-label="Delete" title="Delete"><FiTrash2 /></button>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-8">
        <button type="button" className="font-dm-sans text-sm underline text-text-secondary" onClick={() => setShowDeleted(!showDeleted)} aria-expanded={showDeleted}>
          {showDeleted ? 'Hide recently deleted' : 'Recently deleted'}
        </button>
        {showDeleted && <div className="mt-3 bg-white border-2 border-[#EEE9FA] p-4"><Deleted colKey={key} onRestored={reload} /></div>}
      </div>
    </div>
  )
}

function validate(key, value, items, id) {
  if (key === 'news') {
    if (!value.title?.trim()) return 'Give the story a headline.'
    if (!value.slug?.trim()) return 'Give the story a web address (press "From headline").'
    if (items.some((n) => n.slug === value.slug && String(n.id) !== String(id))) return 'Another story already uses that web address. Change it slightly.'
  }
  if (key === 'events' && !value.title?.trim()) return 'Give the event a name.'
  if (key === 'events' && value.end_date && value.start_date && value.end_date < value.start_date) return 'The end date is before the start date.'
  if (key === 'team' && !value.vacant && !value.name?.trim()) return 'Add the person’s name, or turn on "Vacant seat".'
  if (key === 'team' && !value.role?.trim()) return 'Add the role on the board.'
  return ''
}

export function ItemEditor() {
  const { key, id } = useParams()
  const col = collectionByKey[key]
  const isNew = id === 'new'
  const { data, reload, toast, setDirty } = useAdmin()
  const navigate = useNavigate()
  const items = useMemo(() => data.collections[key] || [], [data, key])
  const existing = isNew ? null : items.find((i) => String(i.id) === id)

  const initial = useMemo(() => {
    if (isNew) return { data: structuredClone(col?.blank || {}), published: true }
    if (!existing) return null
    const d = Object.fromEntries(Object.entries(existing).filter(([k]) => k !== 'id' && !k.startsWith('_')))
    return { data: d, published: existing._published }
  }, [isNew, existing, col])

  const [value, setValue] = useState(initial?.data)
  const [published, setPublished] = useState(initial?.published ?? true)
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState(false)
  useEffect(() => { if (initial) { setValue(initial.data); setPublished(initial.published) } }, [initial])

  const dirty = initial ? JSON.stringify(value) !== JSON.stringify(initial.data) || published !== initial.published : false
  useEffect(() => { setDirty(dirty); return () => setDirty(false) }, [dirty, setDirty])

  if (!col) return <p>That list doesn't exist.</p>
  if (!initial || !value) return <p className="font-dm-sans">This {col.singular} doesn't exist any more. <Link className="underline" to={`/admin/list/${key}`}>Back to {col.label}</Link></p>

  async function save() {
    const v = { ...value }
    if (key === 'news' && !v.slug && v.title) v.slug = v.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
    const err = validate(key, v, items, id)
    if (err) { toast(err, 'error'); return }
    setSaving(true)
    try {
      const r = await admin('save_item', { collection: key, id: isNew ? undefined : Number(id), data: v, published, position: key === 'news' || key === 'events' ? 'start' : 'end' })
      setDirty(false)
      await reload()
      toast(published ? 'Saved. It’s live on the website.' : 'Saved. It’s hidden from the website.')
      if (isNew) navigate(`/admin/list/${key}/${r.id}`, { replace: true })
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Delete this ${col.singular}? You can restore it later from "Recently deleted".`)) return
    try {
      await admin('delete_item', { id: Number(id) })
      setDirty(false)
      await reload()
      toast('Deleted.')
      navigate(`/admin/list/${key}`)
    } catch (e) { toast(e.message, 'error') }
  }

  return (
    <div>
      <Link to={`/admin/list/${key}`} className="font-dm-sans text-sm underline text-text-secondary">← All {col.label.toLowerCase()}</Link>
      <header className="flex flex-wrap items-end justify-between gap-4 mt-2 mb-6">
        <h1 className="font-rajdhani font-bold text-[34px] leading-tight text-deep-purple">{isNew ? `New ${col.singular}` : titleOf(col, value)}</h1>
        {!isNew && (
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnGhost} onClick={() => setHistory(true)}><FiClock /> Earlier versions</button>
            <a className={btnGhost} href={publicUrl(key, value)} target="_blank" rel="noreferrer"><FiExternalLink /> View on site</a>
          </div>
        )}
      </header>

      <section className="bg-white border-2 border-[#EEE9FA] p-5 sm:p-6 mb-6 flex flex-wrap items-center gap-4">
        <button type="button" role="switch" aria-checked={published} onClick={() => setPublished(!published)} className="inline-flex items-center gap-3 min-h-10 font-dm-sans font-semibold text-deep-purple">
          <span className={`relative w-11 h-6 transition-colors ${published ? 'bg-ink-green' : 'bg-[#CFC6E8]'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white shadow transition-all ${published ? 'left-[22px]' : 'left-0.5'}`} />
          </span>
          {published ? 'Showing on the website' : 'Hidden from the website'}
        </button>
        <span className="font-dm-sans text-sm text-text-secondary">Hidden items are kept here but visitors can't see them.</span>
      </section>

      <section className="bg-white border-2 border-[#EEE9FA] p-5 sm:p-6">
        <Fields fields={col.fields} value={value} onChange={setValue} showIf={col.showIf} />
      </section>

      <SaveBar
        dirty={dirty || isNew} saving={saving} onSave={save}
        onDiscard={() => { if (isNew) navigate(`/admin/list/${key}`); else { setValue(initial.data); setPublished(initial.published) } }}
        extra={!isNew && <button type="button" className={btnDanger} onClick={remove}><FiTrash2 /> Delete</button>}
      />

      {history && (
        <History type="item" refKey={id} onClose={() => setHistory(false)} onRestore={(d) => { setValue(d); setHistory(false); toast('Earlier version loaded. Check it, then press Save changes.') }} />
      )}
    </div>
  )
}
