import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiArrowDown, FiArrowUp, FiClock, FiExternalLink, FiEye, FiEyeOff } from 'react-icons/fi'
import { pageByKey, sectionOrder } from '../content/schema'
import { admin } from './api'
import { useAdmin } from './AdminContext'
import { Fields, btnGhost, btnPrimary, iconBtn } from './fields'
import History from './History'

export function SaveBar({ dirty, saving, onSave, onDiscard, extra }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 sm:-mx-8 mt-10 px-4 sm:px-8 py-3 bg-white/95 border-t-2 border-[#EEE9FA] flex flex-wrap items-center gap-3">
      <button type="button" className={`${btnPrimary} min-h-11 px-6`} onClick={onSave} disabled={!dirty || saving}>
        {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
      </button>
      {dirty && !saving && <button type="button" className={btnGhost} onClick={onDiscard}>Discard changes</button>}
      {dirty && <span className="font-dm-sans text-sm text-ink-orange">You have unsaved changes.</span>}
      <span className="flex-1" />
      {extra}
    </div>
  )
}

/** Gets/sets a group's values: flat pages store fields at the top level. */
function groupValue(page, value, g) {
  return page.flat ? value : value[g.key] || {}
}
function setGroup(page, value, g, gv) {
  return page.flat ? gv : { ...value, [g.key]: gv }
}

function SectionOrder({ pageKey, value, onChange }) {
  const page = pageByKey[pageKey]
  const order = sectionOrder(pageKey, value._sections)
  const labelOf = (k) => page.groups.find((g) => g.key === k)?.label || k
  const save = (list) => onChange({ ...value, _sections: list })
  const move = (i, to) => {
    const n = [...order]
    const [x] = n.splice(i, 1)
    n.splice(to, 0, x)
    save(n)
  }
  return (
    <section className="bg-white border-2 border-[#EEE9FA] p-5 sm:p-6">
      <h2 className="font-rajdhani font-bold text-xl text-deep-purple mb-1">Sections on this page</h2>
      <p className="font-dm-sans text-sm text-text-secondary mb-4">Change the order sections appear in, or hide one without deleting its text.</p>
      <ol className="space-y-1.5">
        {order.map((s, i) => (
          <li key={s.key} className={`flex items-center gap-2 px-3 py-1.5 border-2 ${s.show === false ? 'border-dashed border-[#DDD5F5] bg-[#FAF9FD]' : 'border-[#EEE9FA] bg-white'}`}>
            <span className="w-6 text-center font-rajdhani font-bold text-text-secondary">{i + 1}</span>
            <span className={`flex-1 font-dm-sans ${s.show === false ? 'text-text-secondary line-through' : 'text-deep-purple'}`}>{labelOf(s.key)}</span>
            <button type="button" className={iconBtn} onClick={() => save(order.map((x, j) => (j === i ? { ...x, show: x.show === false } : x)))} aria-label={s.show === false ? `Show ${labelOf(s.key)}` : `Hide ${labelOf(s.key)}`} title={s.show === false ? 'Show' : 'Hide'}>
              {s.show === false ? <FiEyeOff /> : <FiEye />}
            </button>
            <button type="button" className={iconBtn} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${labelOf(s.key)} up`}><FiArrowUp /></button>
            <button type="button" className={iconBtn} onClick={() => move(i, i + 1)} disabled={i === order.length - 1} aria-label={`Move ${labelOf(s.key)} down`}><FiArrowDown /></button>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function PageEditor() {
  const { key } = useParams()
  const page = pageByKey[key]
  const { data, setData, toast, setDirty } = useAdmin()
  const saved = useMemo(() => data.settings[key] || {}, [data, key])
  const [value, setValue] = useState(saved)
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState(false)
  const dirty = JSON.stringify(value) !== JSON.stringify(saved)

  useEffect(() => setValue(saved), [saved])
  useEffect(() => { setDirty(dirty); return () => setDirty(false) }, [dirty, setDirty])

  if (!page) return <p>That page doesn't exist.</p>

  async function save() {
    setSaving(true)
    try {
      await admin('save_settings', { key, data: value })
      setData((d) => ({ ...d, settings: { ...d.settings, [key]: value } }))
      toast('Saved. The website shows the change straight away.')
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const hasOrder = page.groups.some((g) => g.movable)
  const orderKeys = hasOrder ? sectionOrder(key, value._sections) : []
  // Fixed groups first, then movable ones in their page order.
  const groups = [
    ...page.groups.filter((g) => !g.movable),
    ...orderKeys.map((s) => page.groups.find((g) => g.key === s.key)).filter(Boolean),
  ]

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-rajdhani font-bold text-[34px] leading-tight text-deep-purple">{page.label}</h1>
          {page.description && <p className="font-dm-sans text-text-secondary mt-1">{page.description}</p>}
        </div>
        <div className="flex gap-2">
          <button type="button" className={btnGhost} onClick={() => setHistory(true)}><FiClock /> Earlier versions</button>
          {page.path && <a className={btnGhost} href={page.path} target="_blank" rel="noreferrer"><FiExternalLink /> View page</a>}
        </div>
      </header>

      <div className="space-y-6">
        {hasOrder && <SectionOrder pageKey={key} value={value} onChange={setValue} />}
        {groups.map((g) => {
          const hidden = g.movable && orderKeys.find((s) => s.key === g.key)?.show === false
          return (
            <section key={g.key} id={`g-${g.key}`} className={`bg-white border-2 p-5 sm:p-6 ${hidden ? 'border-dashed border-[#DDD5F5] opacity-75' : 'border-[#EEE9FA]'}`}>
              <div className="flex items-baseline justify-between gap-3 mb-4">
                <h2 className="font-rajdhani font-bold text-xl text-deep-purple">{g.label}</h2>
                {hidden && <span className="font-dm-sans text-sm text-text-secondary">Hidden on the website</span>}
              </div>
              {g.help && <p className="font-dm-sans text-sm text-text-secondary -mt-2 mb-4">{g.help}</p>}
              <Fields fields={g.fields} value={groupValue(page, value, g)} onChange={(gv) => setValue(setGroup(page, value, g, gv))} />
            </section>
          )
        })}
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={() => setValue(saved)} />

      {history && (
        <History
          type="settings" refKey={key} onClose={() => setHistory(false)}
          onRestore={(d) => { setValue(d); setHistory(false); toast('Earlier version loaded. Check it, then press Save changes.') }}
        />
      )}
    </div>
  )
}
