import { FiLinkedin, FiTwitter, FiFacebook, FiInstagram, FiYoutube, FiGlobe } from 'react-icons/fi'

const ICONS = {
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  facebook: FiFacebook,
  instagram: FiInstagram,
  youtube: FiYoutube,
}

export default function SocialIcon({ network, ...props }) {
  const Icon = ICONS[network] || FiGlobe
  return <Icon aria-hidden="true" {...props} />
}
