import { useEffect } from 'react'
import { useContent } from '../content/ContentContext'

/** Sets the browser tab title: "Events — DiGRA South Africa". */
export default function usePageTitle(title) {
  const { site } = useContent()
  useEffect(() => {
    const name = site.name || 'DiGRA South Africa'
    document.title = title ? `${title} — ${name}` : `${name} — Digital Games Research Association`
  }, [title, site.name])
}
