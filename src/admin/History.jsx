import { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { get } from './api'
import { btnGhost, iconBtn } from './fields'

/** Lists earlier saved versions of a page or item, newest first. */
export default function History({ type, refKey, onRestore, onClose }) {
  const [list, setList] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    get(`admin.php?action=revisions&type=${type}&key=${encodeURIComponent(refKey)}`)
      .then((d) => setList(d.revisions))
      .catch((e) => setError(e.message))
  }, [type, refKey])
  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Earlier versions" onClick={onClose}>
      <div className="bg-white w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#DDD5F5]">
          <h2 className="font-rajdhani font-bold text-xl text-deep-purple">Earlier versions</h2>
          <button type="button" className={iconBtn} onClick={onClose} aria-label="Close"><FiX size={20} /></button>
        </div>
        <div className="p-5 overflow-y-auto">
          <p className="font-dm-sans text-sm text-text-secondary mb-4">Each time someone saves, the version before is kept here (the last 25). Loading one doesn't change the website until you save.</p>
          {error && <p className="text-ink-red">{error}</p>}
          {list && !list.length && <p className="font-dm-sans text-text-secondary">No earlier versions yet.</p>}
          <ul className="divide-y divide-[#EEE9FA]">
            {(list || []).map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-2.5">
                <div className="flex-1 font-dm-sans">
                  <p className="text-deep-purple">{new Date(r.created_at.replace(' ', 'T')).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  <p className="text-sm text-text-secondary">Replaced by {r.saved_by || 'someone'}</p>
                </div>
                <button type="button" className={btnGhost} onClick={() => onRestore(r.data)}>Load this version</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
