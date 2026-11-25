import { useEffect, useId, useRef, useState } from 'react'
import { FiArrowDown, FiArrowUp, FiChevronDown, FiChevronRight, FiCopy, FiFile, FiImage, FiPlus, FiTrash2, FiUpload, FiX } from 'react-icons/fi'
import { admin, upload } from './api'
import { useAdmin } from './AdminContext'

// ── Shared styles ────────────────────────────────────────────────────────
export const inputCls =
  'w-full bg-white border-2 border-[#DDD5F5] px-3 py-2.5 font-dm-sans text-[15px] text-deep-purple outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(245,166,35,0.18)] transition-shadow'
export const btn =
  'inline-flex items-center justify-center gap-2 min-h-10 px-4 font-rajdhani font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed'
export const btnPrimary = `${btn} bg-accent-gold text-deep-purple shadow-[3px_3px_0_rgba(28,10,58,0.25)] hover:-translate-y-px`
export const btnGhost = `${btn} border-2 border-[#DDD5F5] text-deep-purple bg-white hover:border-deep-purple`
export const btnDanger = `${btn} border-2 border-[#F3C3CC] text-ink-red bg-white hover:bg-[#FDECEF]`
export const iconBtn =
  'inline-flex items-center justify-center w-9 h-9 text-text-secondary hover:text-deep-purple hover:bg-bg-tint disabled:opacity-30 disabled:hover:bg-transparent'

export function Label({ htmlFor, children, help }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block font-dm-sans font-semibold text-[15px] text-deep-purple">{children}</label>
      {help && <p className="font-dm-sans text-[13px] text-text-secondary leading-snug mt-0.5">{help}</p>}
    </div>
  )
}

const move = (arr, from, to) => {
  const next = [...arr]
  const [x] = next.splice(from, 1)
  next.splice(to, 0, x)
  return next
}

// ── Individual field types ──────────────────────────────────────────────

function TextField({ id, value, onChange, field }) {
  const listId = field.suggestions ? `${id}-list` : undefined
  return (
    <>
      <input id={id} type="text" className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} list={listId} />
      {listId && <datalist id={listId}>{field.suggestions.map((s) => <option key={s} value={s} />)}</datalist>}
    </>
  )
}

function AutoTextarea({ id, value, onChange, minRows = 3, placeholder }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight + 4, 600)}px`
  }, [value])
  return (
    <textarea
      ref={ref} id={id} rows={minRows} placeholder={placeholder}
      className={`${inputCls} resize-y leading-relaxed`}
      value={value ?? ''} onChange={(e) => onChange(e.target.value)}
    />
  )
}

function LinesField({ id, value, onChange }) {
  // Stored as an array of strings, edited one per line.
  const [text, setText] = useState(() => (Array.isArray(value) ? value.join('\n') : value || ''))
  const last = useRef(value)
  useEffect(() => {
    // Keep the text box in step when the value is replaced from outside (e.g. loading an earlier version)
    if (value !== last.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(Array.isArray(value) ? value.join('\n') : value || '')
      last.current = value
    }
  }, [value])
  return (
    <AutoTextarea
      id={id} value={text} minRows={3}
      onChange={(t) => {
        setText(t)
        const arr = t.split('\n').map((s) => s.trim()).filter(Boolean)
        last.current = arr
        onChange(arr)
      }}
    />
  )
}

function LinkField({ id, value, onChange }) {
  const v = value || {}
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <input id={id} aria-label="Link text" placeholder="Text, e.g. Join the chapter" className={inputCls} value={v.label ?? ''} onChange={(e) => onChange({ ...v, label: e.target.value })} />
      <input aria-label="Goes to" placeholder="Goes to, e.g. /membership or https://…" className={inputCls} value={v.url ?? ''} onChange={(e) => onChange({ ...v, url: e.target.value })} />
    </div>
  )
}

function LinksField({ value, onChange }) {
  const list = Array.isArray(value) ? value : []
  return (
    <div className="space-y-2">
      {list.map((l, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1"><LinkField value={l} onChange={(nv) => onChange(list.map((x, j) => (j === i ? nv : x)))} /></div>
          <button type="button" className={iconBtn} onClick={() => onChange(move(list, i, i - 1))} disabled={i === 0} aria-label="Move up"><FiArrowUp /></button>
          <button type="button" className={iconBtn} onClick={() => onChange(move(list, i, i + 1))} disabled={i === list.length - 1} aria-label="Move down"><FiArrowDown /></button>
          <button type="button" className={iconBtn} onClick={() => onChange(list.filter((_, j) => j !== i))} aria-label="Remove link"><FiTrash2 /></button>
        </div>
      ))}
      <button type="button" className={btnGhost} onClick={() => onChange([...list, { label: '', url: '' }])}><FiPlus /> Add a link</button>
    </div>
  )
}

function Toggle({ id, value, onChange, label }) {
  return (
    <button
      id={id} type="button" role="switch" aria-checked={!!value} onClick={() => onChange(!value)}
      className="inline-flex items-center gap-3 min-h-10 font-dm-sans text-[15px] text-deep-purple"
    >
      <span className={`relative w-11 h-6 transition-colors ${value ? 'bg-ink-green' : 'bg-[#CFC6E8]'}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white shadow transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
      {label ?? (value ? 'Yes' : 'No')}
    </button>
  )
}

// ── Files and photos ────────────────────────────────────────────────────

export function MediaPicker({ onPick, onClose, accept = 'image' }) {
  const [files, setFiles] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    admin('media').then((d) => setFiles(d.files)).catch((e) => setError(e.message))
  }, [])
  const shown = (files || []).filter((f) => (accept === 'image' ? /\.(webp|jpe?g|png|gif)$/i.test(f.url) : true))
  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Choose a file" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#DDD5F5]">
          <h2 className="font-rajdhani font-bold text-xl text-deep-purple">Choose from uploaded files</h2>
          <button type="button" className={iconBtn} onClick={onClose} aria-label="Close"><FiX size={20} /></button>
        </div>
        <div className="p-5 overflow-y-auto">
          {error && <p className="text-ink-red">{error}</p>}
          {!files && !error && <p className="text-text-secondary">Loading…</p>}
          {files && !shown.length && <p className="text-text-secondary">Nothing uploaded yet. Use the Upload button instead.</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {shown.map((f) => (
              <button key={f.url} type="button" onClick={() => onPick(f.url)} className="group text-left border-2 border-transparent hover:border-accent-gold focus:border-accent-gold">
                {/\.(webp|jpe?g|png|gif)$/i.test(f.url) ? (
                  <img src={f.url} alt="" className="w-full aspect-square object-cover bg-bg-tint" loading="lazy" />
                ) : (
                  <span className="w-full aspect-square flex items-center justify-center bg-bg-tint"><FiFile size={32} /></span>
                )}
                <span className="block text-xs text-text-secondary truncate px-1 py-1">{f.url.split('/').pop()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function UploadButton({ accept, onDone, children = 'Upload' }) {
  const ref = useRef(null)
  const [pct, setPct] = useState(null)
  const [error, setError] = useState('')
  return (
    <>
      <input
        ref={ref} type="file" accept={accept} className="sr-only" tabIndex={-1}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          setError('')
          setPct(0)
          try {
            const r = await upload(file, setPct)
            onDone(r.url)
          } catch (err) {
            setError(err.message)
          } finally {
            setPct(null)
          }
        }}
      />
      <button type="button" className={btnGhost} onClick={() => ref.current?.click()} disabled={pct !== null}>
        <FiUpload /> {pct !== null ? `Uploading ${pct}%` : children}
      </button>
      {error && <p className="basis-full text-ink-red text-sm" role="alert">{error}</p>}
    </>
  )
}

function ImageField({ id, value, onChange }) {
  const [picking, setPicking] = useState(false)
  const [showUrl, setShowUrl] = useState(false)
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <div className="w-36 h-28 shrink-0 bg-bg-tint border-2 border-dashed border-[#DDD5F5] flex items-center justify-center overflow-hidden">
        {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <FiImage size={28} className="text-text-secondary" aria-hidden="true" />}
      </div>
      <div className="flex-1 flex flex-wrap gap-2 items-center">
        <UploadButton accept="image/jpeg,image/png,image/webp,image/gif" onDone={onChange}>{value ? 'Replace photo' : 'Upload photo'}</UploadButton>
        <button type="button" className={btnGhost} onClick={() => setPicking(true)}>Choose uploaded</button>
        {value && <button type="button" className={btnDanger} onClick={() => onChange('')}><FiX /> Remove</button>}
        <button type="button" className="text-sm underline text-text-secondary min-h-10" onClick={() => setShowUrl(!showUrl)}>{showUrl ? 'Hide' : 'Use a web address instead'}</button>
        {showUrl && <input id={id} className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="/images/photo.webp or https://…" />}
      </div>
      {picking && <MediaPicker onClose={() => setPicking(false)} onPick={(u) => { onChange(u); setPicking(false) }} />}
    </div>
  )
}

function FileField({ id, value, onChange }) {
  const [picking, setPicking] = useState(false)
  return (
    <div className="space-y-2">
      <input id={id} className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload a PDF" />
      <div className="flex flex-wrap gap-2">
        <UploadButton accept="application/pdf,image/*" onDone={onChange}>Upload PDF</UploadButton>
        <button type="button" className={btnGhost} onClick={() => setPicking(true)}>Choose uploaded</button>
        {value && <a href={value} target="_blank" rel="noreferrer" className={btnGhost}>Open</a>}
      </div>
      {picking && <MediaPicker accept="any" onClose={() => setPicking(false)} onPick={(u) => { onChange(u); setPicking(false) }} />}
    </div>
  )
}

function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

function SlugField({ id, value, onChange, item }) {
  return (
    <div className="flex gap-2 items-center">
      <span className="font-dm-sans text-text-secondary text-sm shrink-0">/news/</span>
      <input id={id} className={inputCls} value={value ?? ''} onChange={(e) => onChange(slugify(e.target.value))} />
      <button type="button" className={btnGhost} onClick={() => onChange(slugify(item?.title))}>From headline</button>
    </div>
  )
}

function NewsSelect({ id, value, onChange }) {
  const { data } = useAdmin()
  const news = data?.collections?.news || []
  return (
    <select id={id} className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">None</option>
      {news.map((n) => <option key={n.id} value={n.slug}>{n.title}</option>)}
    </select>
  )
}

// ── Article body ────────────────────────────────────────────────────────

const BLOCK_TYPES = [
  { type: 'p', label: 'Paragraph' },
  { type: 'h', label: 'Sub-heading' },
  { type: 'list', label: 'Bullet list' },
  { type: 'quote', label: 'Highlighted line' },
  { type: 'note', label: 'Small note' },
  { type: 'image', label: 'Photo' },
  { type: 'button', label: 'Button' },
]
const blockLabel = (t) => BLOCK_TYPES.find((b) => b.type === t)?.label || t

function BlocksField({ value, onChange }) {
  const list = Array.isArray(value) ? value : []
  const set = (i, patch) => onChange(list.map((b, j) => (j === i ? { ...b, ...patch } : b)))
  const add = (type, at) => {
    const next = [...list]
    next.splice(at, 0, { type, text: '' })
    onChange(next)
  }
  return (
    <div className="space-y-3">
      {list.map((b, i) => (
        <div key={i} className="border-2 border-[#EEE9FA] bg-white">
          <div className="flex items-center gap-1 px-2 py-1 bg-[#F8F6FE] border-b border-[#EEE9FA]">
            <select aria-label="Block type" className="bg-transparent font-rajdhani font-bold uppercase tracking-wider text-xs text-deep-purple py-1" value={b.type} onChange={(e) => set(i, { type: e.target.value })}>
              {BLOCK_TYPES.map((t) => <option key={t.type} value={t.type}>{t.label}</option>)}
            </select>
            <span className="flex-1" />
            <button type="button" className={iconBtn} onClick={() => onChange(move(list, i, i - 1))} disabled={i === 0} aria-label="Move up"><FiArrowUp /></button>
            <button type="button" className={iconBtn} onClick={() => onChange(move(list, i, i + 1))} disabled={i === list.length - 1} aria-label="Move down"><FiArrowDown /></button>
            <button type="button" className={iconBtn} onClick={() => onChange(list.filter((_, j) => j !== i))} aria-label={`Remove ${blockLabel(b.type)}`}><FiTrash2 /></button>
          </div>
          <div className="p-3 space-y-2">
            {b.type === 'image' && (
              <>
                <ImageField value={b.url} onChange={(u) => set(i, { url: u })} />
                <input className={inputCls} placeholder="Describe the photo for screen readers" value={b.alt ?? ''} onChange={(e) => set(i, { alt: e.target.value })} />
                <input className={inputCls} placeholder="Caption (optional)" value={b.text ?? ''} onChange={(e) => set(i, { text: e.target.value })} />
              </>
            )}
            {b.type === 'button' && (
              <LinkField value={{ label: b.text, url: b.url }} onChange={(v) => set(i, { text: v.label, url: v.url })} />
            )}
            {b.type === 'h' && <input className={`${inputCls} font-rajdhani font-bold text-lg`} value={b.text ?? ''} onChange={(e) => set(i, { text: e.target.value })} aria-label="Sub-heading" />}
            {['p', 'list', 'quote', 'note'].includes(b.type) && (
              <AutoTextarea value={b.text} onChange={(t) => set(i, { text: t })} minRows={b.type === 'p' ? 3 : 2} placeholder={b.type === 'list' ? 'One item per line' : ''} />
            )}
            {b.type === 'list' && <p className="text-[13px] text-text-secondary">One bullet per line.</p>}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-dm-sans text-sm text-text-secondary">Add:</span>
        {BLOCK_TYPES.map((t) => (
          <button key={t.type} type="button" className={`${btnGhost} min-h-9 px-3`} onClick={() => add(t.type, list.length)}><FiPlus /> {t.label}</button>
        ))}
      </div>
      <p className="text-[13px] text-text-secondary">In paragraphs, lists and notes: **bold**, *italic* and [link text](https://…) work.</p>
    </div>
  )
}

// ── Repeating groups (lists of things) ─────────────────────────────────

function blankFor(fields) {
  const o = {}
  for (const f of fields) {
    o[f.key] = f.type === 'list' || f.type === 'links' || f.type === 'lines' || f.type === 'blocks' ? [] : f.type === 'bool' ? false : f.type === 'link' ? { label: '', url: '' } : f.type === 'select' ? f.options?.[0]?.value ?? '' : ''
  }
  return o
}

function ListField({ value, onChange, field }) {
  const list = Array.isArray(value) ? value : []
  const [open, setOpen] = useState(() => (list.length <= 1 ? [0] : []))
  const toggle = (i) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))
  const title = (it, i) => (field.itemLabel?.(it) || '').toString().trim() || `Item ${i + 1}`
  const full = field.max && list.length >= field.max
  return (
    <div className="space-y-2">
      {list.map((it, i) => {
        const isOpen = open.includes(i)
        return (
          <div key={i} className="border-2 border-[#EEE9FA] bg-white">
            <div className="flex items-center gap-1 pr-1">
              <button type="button" className="flex-1 flex items-center gap-2 text-left px-3 py-2 min-h-11 font-dm-sans font-semibold text-deep-purple" onClick={() => toggle(i)} aria-expanded={isOpen}>
                {isOpen ? <FiChevronDown aria-hidden="true" /> : <FiChevronRight aria-hidden="true" />}
                <span className="truncate">{title(it, i)}</span>
              </button>
              <button type="button" className={iconBtn} onClick={() => { onChange(move(list, i, i - 1)); setOpen([]) }} disabled={i === 0} aria-label="Move up"><FiArrowUp /></button>
              <button type="button" className={iconBtn} onClick={() => { onChange(move(list, i, i + 1)); setOpen([]) }} disabled={i === list.length - 1} aria-label="Move down"><FiArrowDown /></button>
              <button type="button" className={iconBtn} onClick={() => { const n = [...list]; n.splice(i + 1, 0, structuredClone(it)); onChange(n) }} disabled={full} aria-label="Duplicate"><FiCopy /></button>
              <button
                type="button" className={iconBtn} aria-label={`Remove ${title(it, i)}`}
                onClick={() => { if (window.confirm(`Remove "${title(it, i)}"?`)) { onChange(list.filter((_, j) => j !== i)); setOpen([]) } }}
              >
                <FiTrash2 />
              </button>
            </div>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-[#EEE9FA]">
                <Fields fields={field.fields} value={it} onChange={(nv) => onChange(list.map((x, j) => (j === i ? nv : x)))} compact />
              </div>
            )}
          </div>
        )
      })}
      {!full && (
        <button type="button" className={btnGhost} onClick={() => { onChange([...list, blankFor(field.fields)]); setOpen([list.length]) }}>
          <FiPlus /> {field.addLabel || 'Add another'}
        </button>
      )}
    </div>
  )
}

// ── Dispatcher ──────────────────────────────────────────────────────────

export function Field({ field, value, onChange, item }) {
  const id = useId()
  const props = { id, value, onChange, field, item }
  let input
  switch (field.type) {
    case 'textarea': input = <AutoTextarea {...props} />; break
    case 'lines': input = <LinesField {...props} />; break
    case 'link': input = <LinkField {...props} />; break
    case 'links': input = <LinksField {...props} />; break
    case 'image': input = <ImageField {...props} />; break
    case 'file': input = <FileField {...props} />; break
    case 'bool': input = <Toggle {...props} />; break
    case 'number': input = <input id={id} type="number" min="0" className={`${inputCls} max-w-[140px]`} value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />; break
    case 'date': input = <input id={id} type="date" className={`${inputCls} max-w-[220px]`} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />; break
    case 'email': input = <input id={id} type="email" className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />; break
    case 'url': input = <input id={id} type="text" inputMode="url" className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="/page or https://…" />; break
    case 'select':
      input = (
        <select id={id} className={`${inputCls} max-w-sm`} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {!field.options.some((o) => o.value === value) && <option value={value ?? ''}>{value || 'Choose…'}</option>}
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
      break
    case 'slug': input = <SlugField {...props} />; break
    case 'news': input = <NewsSelect {...props} />; break
    case 'blocks': input = <BlocksField {...props} />; break
    case 'list': input = <ListField {...props} />; break
    default: input = <TextField {...props} />
  }
  const groupLike = ['list', 'links', 'blocks', 'link', 'image', 'bool'].includes(field.type)
  return (
    <div>
      {groupLike ? (
        <div className="mb-1.5">
          <p className="font-dm-sans font-semibold text-[15px] text-deep-purple" id={`${id}-label`}>{field.label}</p>
          {field.help && <p className="font-dm-sans text-[13px] text-text-secondary leading-snug mt-0.5">{field.help}</p>}
        </div>
      ) : (
        <Label htmlFor={id} help={field.help}>{field.label}</Label>
      )}
      {input}
    </div>
  )
}

/** Renders a set of fields against one object. */
export function Fields({ fields, value, onChange, showIf = {}, compact = false }) {
  const v = value || {}
  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      {fields.map((f) =>
        showIf[f.key] && !showIf[f.key](v) ? null : (
          <Field key={f.key} field={f} value={v[f.key]} item={v} onChange={(nv) => onChange({ ...v, [f.key]: nv })} />
        ),
      )}
    </div>
  )
}
