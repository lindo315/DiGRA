import { useContent } from '../content/ContentContext'
import { SmartLink, Inline } from '../lib/text'
import { FiArrowRight } from 'react-icons/fi'

/** Optional notice under the menu, switched on in Admin → Site settings. */
export default function NoticeBar() {
  const { site } = useContent()
  if (!site.announcement_show || !site.announcement_text) return null
  const l = site.announcement_link || {}
  return (
    <div className="bg-accent-gold text-deep-purple">
      <div className="container mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <p className="font-dm-sans text-sm sm:text-base font-medium"><Inline text={site.announcement_text} /></p>
        {l.label && l.url && (
          <SmartLink to={l.url} className="inline-flex items-center gap-1.5 font-rajdhani font-bold uppercase tracking-wider text-sm underline underline-offset-4 decoration-2 min-h-8">
            {l.label} <FiArrowRight aria-hidden="true" />
          </SmartLink>
        )}
      </div>
    </div>
  )
}
