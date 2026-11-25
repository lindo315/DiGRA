// Site-wide settings.

export const CONTACT_EMAIL = 'info@digrasa.co.za'

// Paste the chapter's profile URLs here. A network only appears on the site
// once its url is filled in, so there are never dead social links.
export const SOCIAL_LINKS = [
  { network: 'linkedin', name: 'LinkedIn', handle: 'DiGRA South Africa', url: '', desc: 'Professional announcements and events.' },
  { network: 'twitter', name: 'X (Twitter)', handle: '@DiGRASA', url: '', desc: 'News, updates, and calls for papers.' },
  { network: 'facebook', name: 'Facebook', handle: 'DiGRA South Africa', url: '', desc: 'Community discussions and updates.' },
  { network: 'instagram', name: 'Instagram', handle: '@digrasa', url: '', desc: 'Photos from events and the community.' },
].filter((s) => s.url)
