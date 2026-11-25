import { FiLinkedin, FiTwitter, FiFacebook, FiInstagram, FiYoutube, FiGlobe } from 'react-icons/fi'
import { FaDiscord } from 'react-icons/fa'

const ICONS = {
  discord: FaDiscord,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  x: FiTwitter,
  facebook: FiFacebook,
  instagram: FiInstagram,
  youtube: FiYoutube,
}

export default function SocialIcon({ network, ...props }) {
  const Icon = ICONS[network] || FiGlobe
  return <Icon aria-hidden="true" {...props} />
}

/** Discord (if set) followed by every social profile that has a link. */
export function socialProfiles(site) {
  const list = (site.social || []).filter((s) => s && s.url).map((s) => ({ ...s, label: s.label || s.network }))
  if (site.discord_url && !list.some((s) => s.network === 'discord')) {
    list.unshift({ network: 'discord', label: 'Discord', url: site.discord_url })
  }
  return list
}
