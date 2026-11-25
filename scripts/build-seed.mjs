// One-off: converts the old hardcoded data files into the editable content seed.
// The old hand-edited data files live in scripts/legacy-data. They are no longer used by the site.
import { writeFileSync } from 'node:fs'
import { team } from './legacy-data/team.js'
import { news } from './legacy-data/news.js'
import { researchAreas, journals } from './legacy-data/research.js'
import * as ev from './legacy-data/events.js'

const rawEvents = ev.events

// ── News: convert body blocks to the editor format, apply removals ──
function convertBody(body) {
  const out = []
  for (const b of body) {
    if (typeof b === 'string') out.push({ type: 'p', text: b })
    else if (b.h) out.push({ type: 'h', text: b.h })
    else if (b.list) out.push({ type: 'list', text: b.list.join('\n') })
    else if (b.quote) out.push({ type: 'quote', text: b.quote })
    else if (b.note) out.push({ type: 'note', text: b.note })
  }
  return out
}

const isoFor = {
  'sacomm-2026-who-makes-the-rules': '2026-11-05',
  'board-call-for-nominations': '2026-11-01',
  'launch-panel': '2026-06-02',
  'digra-sa-soft-launch': '2026-05-26',
  'founding-members-announced': '2026-04-14',
  'announcing-digra-sa': '2025-02-01',
}

const newsItems = news.map((n) => {
  let body = convertBody(n.body)
  if (n.slug === 'board-call-for-nominations') {
    // Amanda, 10 Nov 2026: remove the "Suggested candidates" section.
    const i = body.findIndex((b) => b.type === 'h' && b.text === 'Suggested candidates')
    if (i >= 0) body.splice(i, 4)
  }
  return {
    title: n.title,
    slug: n.slug,
    category: n.category,
    publish_date: isoFor[n.slug] || '',
    date_label: n.date,
    author: n.author || '',
    image: n.image || '',
    image_alt: n.imageAlt || '',
    excerpt: n.excerpt,
    body,
  }
})

// ── Events ──
const eventItems = rawEvents.map((e) => ({
  title: e.title,
  type: e.type,
  start_date: e.startDate && e.id !== 5 ? e.startDate : '',
  end_date: e.endDate || '',
  date_label: e.date,
  location: e.location,
  location_url: e.locationUrl || '',
  image: '',
  description: e.description,
  links: e.links || [],
  news_slug: e.newsSlug || '',
  status: e.id === 4 ? 'upcoming' : e.id === 5 ? 'past' : 'auto',
})).sort((a, b) => (b.start_date || '').localeCompare(a.start_date || ''))

// ── Team ──
const teamItems = team.map((m) => ({
  name: m.name === 'Prof. Rachel van der Merwe' ? 'Dr Rachel van der Merwe' : m.name.replace(/^(Dr|Prof)\. /, '$1 '),
  role: m.role,
  institution: m.institution,
  photo: m.photo,
  bio: m.bio,
  featured: ['President', 'Vice President'].includes(m.role),
  vacant: false,
  vacancy_text: '',
  vacancy_link: '',
}))
const vacancy = (role) => ({
  name: '',
  role,
  institution: '',
  photo: '',
  bio: '',
  featured: false,
  vacant: true,
  vacancy_text: 'This seat is open. Nominations and self-nominations close on 31 January 2027.',
  vacancy_link: '/news/board-call-for-nominations',
})
teamItems.push(vacancy('Student Representative'), vacancy('Student Representative'), vacancy('Industry Representative'))


const L = (label, url) => ({ label, url })
const settings = {
  site: {
    name: 'DiGRA South Africa',
    short_name: 'DiGRA SA',
    description:
      'DiGRA South Africa is the official South African chapter of the Digital Games Research Association. Connecting game researchers, educators, students, and industry professionals.',
    contact_email: 'info@digrasa.co.za',
    form_recipient: 'info@digrasa.co.za',
    location_label: 'South Africa',
    discord_url: 'https://discord.gg/SCfwN9GS2',
    discord_label: 'Join our Discord',
    discord_text: 'Chat with members, hear about events first and find collaborators.',
    social: [
      { network: 'linkedin', label: 'LinkedIn', url: '' },
      { network: 'x', label: 'X (Twitter)', url: '' },
      { network: 'facebook', label: 'Facebook', url: '' },
      { network: 'instagram', label: 'Instagram', url: '' },
    ],
    announcement_show: true,
    announcement_text: 'Board nominations are open: two Student Representatives, an Industry Representative and a Secretary. Closes 31 January 2027.',
    announcement_link: L('Read the call', '/news/board-call-for-nominations'),
    digra_url: 'https://digra.org',
    library_url: 'https://dl.digra.org',
    credit_label: 'Website made by',
    credits: [
      { name: 'Lindokuhle Dlamini', email: 'lindodlamini315@gmail.com' },
      { name: 'Louis Monawe', email: 'l.k.monawe@gmail.com' },
    ],
  },
  nav: {
    items: [
      { label: 'Home', to: '/', sections: [] },
      { label: 'About', to: '/about', sections: [
        { label: 'Who We Are', hash: '#who' }, { label: 'Mission & Goals', hash: '#mission' }, { label: 'Our Aims', hash: '#aims' },
        { label: 'The Board', hash: '#board' }, { label: 'DiGRA International', hash: '#intl' } ] },
      { label: 'Events', to: '/events', sections: [
        { label: 'Upcoming Events', hash: '#upcoming' }, { label: 'Past Events', hash: '#past' }, { label: 'Host an Event', hash: '#host' } ] },
      { label: 'Research', to: '/research', sections: [
        { label: 'Game Studies in SA', hash: '#field' }, { label: 'Research Areas', hash: '#areas' }, { label: 'DiGRA Library', hash: '#library' },
        { label: 'Journals', hash: '#journals' }, { label: 'Teaching Resources', hash: '#teaching' } ] },
      { label: 'News', to: '/news', sections: [] },
      { label: 'Membership', to: '/membership', sections: [
        { label: 'Member Benefits', hash: '#benefits' }, { label: 'Who Can Join', hash: '#eligibility' }, { label: 'Membership Tiers', hash: '#tiers' },
        { label: 'How to Join', hash: '#steps' }, { label: 'Join Now', hash: '#form' } ] },
      { label: 'Contact', to: '/contact', sections: [{ label: 'Send a Message', hash: '#form' }] },
    ],
    join_label: 'Join Us',
    join_label_short: 'Join',
    join_to: '/membership#form',
  },
  footer: {
    title: 'DiGRA SA',
    subtitle: 'South Africa Chapter',
    blurb: 'The official South African chapter of the Digital Games Research Association.',
    join: L('Join the Chapter', '/membership#form'),
    columns: [
      { heading: 'Quick Links', links: [L('Home', '/'), L('About', '/about'), L('Events', '/events'), L('Research', '/research'), L('News', '/news'), L('Membership', '/membership'), L('Contact', '/contact')] },
      { heading: 'Resources', links: [L('DiGRA Digital Library', 'https://dl.digra.org'), L('ToDiGRA Journal', 'https://todigra.org'), L('Game Studies Journal', 'http://gamestudies.org'), L('DiGRA International', 'https://digra.org')] },
    ],
    contact_heading: 'Get in Touch',
    legal: 'DiGRA South Africa is an official regional chapter of the Digital Games Research Association.',
    admin_label: 'Admin login',
  },
  home: {
    _sections: ['paths', 'events', 'news', 'mission', 'about', 'people', 'gap', 'discord', 'cta'].map((key) => ({ key, show: true })),
    hero: {
      eyebrow: 'Official Regional Chapter · DiGRA International',
      title_1: 'Game Studies in Africa,',
      title_2: 'For Africa.',
      text: 'DiGRA South Africa is the official regional chapter of the Digital Games Research Association — connecting game researchers, educators, students, and industry across the continent.',
      primary: L('Join the Chapter', '/membership'),
      secondary: L('Learn More', '/about'),
      show_next: true,
      next_label: 'Next up',
      blocks: [
        { sprite: 'book', label: 'Research', tag: 'Scholarship', colour: 'gold' },
        { sprite: 'gamepad', label: 'Play', tag: 'African Games', colour: 'cyan' },
        { sprite: 'africa', label: 'Africa', tag: 'Pan-Continental', colour: 'red' },
      ],
      stats: [
        { label: 'Part of DiGRA International', value: 'Est. 2003' },
        { label: 'Pan-African Scope', value: 'Continent-wide reach' },
        { label: 'Open to All', value: 'Researchers · Students · Industry' },
      ],
    },
    paths: {
      eyebrow: 'New here?', title: 'Start Here',
      text: 'DiGRA South Africa brings together everyone who studies, teaches and makes games. Pick the path that fits you.',
      items: [
        { audience: 'Students', title: 'Find your research community', colour: 'cyan',
          text: 'Studying games, play or interactive media? Meet researchers, come to events and find a way into international game studies.',
          links: [L('See upcoming events', '/events#upcoming'), L('Stand for Student Rep', '/news/board-call-for-nominations'), L('Join as a student', '/membership#form')] },
        { audience: 'Researchers & Educators', title: 'Connect your work', colour: 'violet',
          text: 'Explore our research areas and teaching resources, share your work, and collaborate with game scholars across South Africa.',
          links: [L('Research areas', '/research#areas'), L('Teaching resources', '/research#teaching'), L('Join the chapter', '/membership#form')] },
        { audience: 'Industry & Developers', title: 'Bridge practice and research', colour: 'orange',
          text: 'Partner with us on talks, showcases and research. Come and meet us at Africa Games Week and Playtopia in Cape Town this December.',
          links: [L('Africa Games Week & Playtopia', '/events#upcoming'), L('Stand for Industry Rep', '/news/board-call-for-nominations'), L('Talk to us', '/contact#form')] },
      ],
    },
    events: { eyebrow: "What's On", title: 'Upcoming Events', link_label: 'All Events', count: 4, empty: 'No upcoming events right now. Check back soon.' },
    news: { eyebrow: 'Latest Updates', title: 'News & Updates', link_label: 'All Updates', count: 3 },
    mission: {
      eyebrow: 'Our Purpose', title: 'What We Stand For',
      items: [
        { sprite: 'book', title: 'Research', colour: 'red', text: 'Produce original research on African games — from cultural analysis to game design theory — and publish it internationally.' },
        { sprite: 'community', title: 'Community', colour: 'gold', text: 'Build a network of game scholars, students, educators, and developers across South Africa and the continent.' },
        { sprite: 'globe', title: 'Connection', colour: 'cyan', text: 'Get African work into international publications and connect local researchers with the global game studies community.' },
      ],
    },
    about: {
      eyebrow: 'Who We Are', title: 'About DiGRA South Africa',
      text: "DiGRA South Africa is the official South African chapter of the Digital Games Research Association — the world's largest academic organisation dedicated to the study of digital games.\n\nWe exist to grow game studies in Africa. That means building research capacity, connecting scholars across the continent, and making sure African perspectives reach international journals, conferences, and conversations.",
      link: L('Learn More About Us', '/about'),
      quote: '"I am because we are"', quote_source: '— Ubuntu Philosophy',
    },
    people: { eyebrow: 'The Team', title: "Who's Building This", link_label: 'Full Board', count: 4, include_vacant: false },
    gap: {
      eyebrow: "The Gap We're Filling", title: 'African Games. African Scholarship.',
      text: 'Global game studies has a blind spot. The canonical texts treat Western, Japanese, and North American game cultures as defaults — as if games exist outside of geography and history.\n\nSouth African game culture is distinct: shaped by post-apartheid demographics, mobile-first access patterns, a growing independent development industry, and rich indigenous play traditions that predate digital games entirely.',
      link: L('Explore our Research', '/research'),
      points: [
        { sprite: 'scroll', colour: 'gold', title: 'Publish', text: 'Peer-reviewed research in international game studies venues.' },
        { sprite: 'community', colour: 'cyan', title: 'Network', text: 'Connect scholars, students, and developers across the continent.' },
        { sprite: 'trophy', colour: 'green', title: 'Represent', text: 'Get African voices into global conferences and conversations.' },
        { sprite: 'lightning', colour: 'violet', title: 'Build', text: 'Grow the infrastructure for game studies to flourish in Africa.' },
      ],
    },
    discord: {
      eyebrow: 'Community', title: 'Join us on Discord',
      text: 'Our Discord server is where members meet between events: share research, find collaborators, ask questions and hear about events first.',
      button: 'Join the Discord server',
    },
    cta: { title: 'Join the chapter.', text: 'Be part of building African game studies from the ground up.', button: L('Become a Member', '/membership') },
  },
  about: {
    _sections: ['who', 'mission', 'board', 'intl', 'values', 'aims', 'cta'].map((key) => ({ key, show: key !== 'aims' })),
    hero: { title: 'About DiGRA South Africa', subtitle: "Who we are, what we're building, and why it matters.", breadcrumb: 'Home / About' },
    who: {
      eyebrow: 'Who We Are', title: 'The South African Chapter',
      text: "DiGRA South Africa is the official South African regional chapter of the Digital Games Research Association (DiGRA) International — the world's leading academic organisation dedicated to the study of digital games (founded 2003).\n\nDiGRA International has formally accepted the establishment of the DiGRA South Africa Chapter. As a regional chapter, DiGRA SA operates within DiGRA International's framework while addressing South African and African priorities in research, policy, industry partnerships, and community development.",
      facts_title: 'Key Facts',
      facts: [
        { label: 'Founded', value: '2026' }, { label: 'Region', value: 'South Africa' },
        { label: 'Parent Org', value: 'DiGRA International, Est. 2003' }, { label: 'Status', value: 'Officially Recognized' },
        { label: 'Scope', value: 'Pan-African' }, { label: 'Focus', value: 'Game Studies & Culture' },
      ],
    },
    mission: {
      title: 'Mission & Goals',
      text: 'To establish a sustainable, coherent, and collaborative national ecosystem for game studies, game research, and game-related academic activity across South Africa and the African continent.',
      goals: [
        { colour: 'gold', title: 'Build national academic legitimacy for game studies', text: 'Publish peer-reviewed research on African games — from cultural analysis to game design theory — in international venues.' },
        { colour: 'cyan', title: 'Strengthen local and regional research networks', text: 'Train the next generation of African game scholars through mentorship, workshops, and access to DiGRA International resources.' },
        { colour: 'green', title: 'Connect academia with industry and professional practice', text: 'Link game researchers across South Africa and the continent into a working network — not just a mailing list.' },
        { colour: 'red', title: 'Promote African scholarship in global DiGRA spaces', text: 'Get African voices into DiGRA International conferences, panels, and publications on an ongoing basis.' },
      ],
    },
    aims: {
      eyebrow: 'Our Aims', title: "What We're Here to Do",
      text: 'The chapter has a specific mandate: build the infrastructure for game studies to flourish in Africa. These are the concrete aims that guide everything we do.',
      items: ['Build national academic legitimacy for game studies', 'Strengthen local and regional research networks', 'Connect academia with industry and professional practice', 'Promote African scholarship in global DiGRA spaces'],
    },
    board: {
      eyebrow: 'The People', title: 'Founding Committee',
      note: 'All members formally accepted their roles at the 3 February 2026 meeting.',
      vacant_name: 'Vacant Seat', vacant_button: 'How to Stand →', profile_label: 'View Profile →', no_bio: 'Bio coming soon.',
    },
    intl: {
      eyebrow: 'Our Parent Organisation', title: 'DiGRA International',
      text: "DiGRA South Africa is an official regional chapter of DiGRA International — the Digital Games Research Association — established in 2003 as the world's leading academic organisation for game studies.\n\nChapter membership gives you access to DiGRA's global network, publications, and annual conferences.",
      card_label: 'Official Chapter', card_title: 'DiGRA International', card_text: 'Digital Games Research Association · Est. 2003',
      link: L('Visit DiGRA International ↗', 'https://digra.org'),
    },
    values: {
      items: [
        { label: 'Open Access', text: 'Knowledge for all', colour: 'gold' },
        { label: 'Ubuntu', text: '"I am because we are"', colour: 'cyan' },
        { label: 'Decolonial', text: 'Scholarship on our terms', colour: 'green' },
        { label: 'Pan-African', text: 'Beyond borders', colour: 'violet' },
      ],
    },
    cta: { title: 'Be part of building something new.', text: 'The chapter is in its founding phase. Now is the time.', button: L('Become a Member', '/membership') },
  },
  events_page: {
    _sections: ['upcoming', 'past', 'host', 'formats', 'cta'].map((key) => ({ key, show: true })),
    hero: { title: 'Events & Conferences', subtitle: 'Where the chapter gathers — online and in person.', breadcrumb: 'Home / Events' },
    upcoming: { eyebrow: "What's Next", title: 'Upcoming Events', pills: ['{count} planned', 'In-person & online'], featured_label: '◆ Featured', more_label: 'More about this event', empty: 'No upcoming events right now. Check back soon, or join our Discord to hear first.' },
    past: { eyebrow: 'Archive', title: 'Past Events', empty: 'No past events on record yet.', recap_label: 'Read the recap' },
    host: {
      eyebrow: 'Get Involved', title: 'Host an Event',
      text: 'DiGRA SA supports members who want to organise events — symposia, workshops, reading groups, or panel discussions at their institutions.\n\nWe can help with promotion, academic support, and connecting your event to the broader DiGRA network.',
      button: L('Get in Touch', '/contact'),
      formats: ['Symposium', 'Workshop', 'Seminar', 'Conference', 'Talk', 'Panel'],
      formats_note: 'All formats welcome',
    },
    formats: {
      eyebrow: 'What We Run', title: 'Event Formats',
      items: [
        { title: 'Research Symposia', colour: 'gold', text: 'Full-day academic gatherings for presenting and workshopping research in progress.' },
        { title: 'Reading Groups', colour: 'cyan', text: 'Informal, regular sessions where members work through game studies texts together.' },
        { title: 'Industry Panels', colour: 'green', text: 'Dialogues between researchers and South African game developers on shared concerns.' },
        { title: 'Workshops', colour: 'violet', text: 'Practical skill-building sessions on research methods, writing for journals, and more.' },
        { title: 'Keynote Talks', colour: 'red', text: 'Invited lectures from leading game scholars — local and international.' },
        { title: 'Online Events', colour: 'orange', text: 'Virtual-first events for members outside major cities, ensuring continental reach.' },
      ],
    },
    cta: { title: 'Never miss an event.', text: 'Become a member to get direct invitations and announcements.', button: L('Join the Chapter', '/membership') },
  },
  research_page: {
    _sections: ['field', 'areas', 'library', 'journals', 'teaching', 'contribute', 'cta'].map((key) => ({ key, show: true })),
    hero: { title: 'Research & Resources', subtitle: 'Scholarship on African games — produced here, read everywhere.', breadcrumb: 'Home / Research' },
    field: {
      eyebrow: 'The Field', title: 'Game Studies in South Africa',
      text: 'Game studies as a discipline has grown significantly since the early 2000s — but African contexts have been systematically underrepresented in international scholarship. Most canonical game studies texts treat Western, Japanese, and North American game cultures as the default.\n\nSouth African game culture is distinct: shaped by post-apartheid demographics, mobile-first access patterns, a small but active development industry, and rich indigenous game traditions that predate digital games entirely.\n\nDiGRA SA exists to produce, publish, and disseminate research that takes this context seriously.',
      asides: [
        { title: 'Did You Know?', colour: 'gold', text: 'South Africa has one of the most active independent game development scenes on the continent, with dedicated studios in Cape Town, Johannesburg, and Pretoria.' },
        { title: 'Our Approach', colour: 'cyan', text: 'We apply African philosophy, ubuntu principles, and decolonial methodology to game research — not as a critique of existing work, but as an expansion of it.' },
      ],
    },
    areas: { eyebrow: 'What We Study', title: 'Research Areas' },
    library: {
      eyebrow: 'Open Access', title: 'DiGRA Digital Library',
      text: "The DiGRA Digital Library hosts thousands of conference papers, journal articles, and proceedings — all freely accessible. It's one of the largest open-access repositories in game studies.\n\nAs a DiGRA SA member, you gain direct pathways to contribute to the library through DiGRA International conferences and publications.",
      link: L('Visit the Library ↗', 'https://dl.digra.org'),
      card_label: 'Open Access Repository',
      facts: [{ label: 'Papers', value: '5,000+' }, { label: 'Years', value: '2003–present' }, { label: 'Access', value: 'Free & Open' }, { label: 'Format', value: 'PDF / HTML' }],
    },
    journals: { eyebrow: 'Publish', title: 'Journals & Publications', link_label: 'Visit →' },
    teaching: { eyebrow: 'Teach', title: 'Teaching Resources', text: '' },
    contribute: {
      eyebrow: 'Get Involved', title: 'Contribute to DiGRA SA',
      items: [
        { title: 'Submit a Paper', colour: 'gold', text: "DiGRA SA members can submit to DiGRA International conferences and the chapter's own publications. We welcome empirical, critical, and creative work." },
        { title: 'Propose a Project', colour: 'cyan', text: 'Have a research idea rooted in African game culture? Pitch it to the board. We can help connect you with collaborators and resources.' },
        { title: 'Join a Reading Group', colour: 'green', text: 'We run informal reading groups for members to engage with game studies texts together. A good entry point for early-career researchers.' },
      ],
    },
    cta: { title: 'Contribute to the field.', text: 'Join DiGRA SA to access resources and publish through our network.', button: L('Join the Chapter', '/membership') },
  },
  news_page: {
    hero: { title: 'News & Updates', subtitle: 'Announcements, event recaps and calls from the chapter.', breadcrumb: 'Home / News' },
    list: { empty: 'No news yet. Check back soon.', read_more: 'Read the full story' },
    article: {
      back_label: 'All news', back_bottom: 'Back to all news', by_label: 'By',
      deadline_label: 'Closes', deadline_text: "Talk to any Board member, or email us and we'll put you in touch.", board_button: 'Meet the Board',
      join: L('Join the Chapter', '/membership'), more_title: 'More from DiGRA SA',
    },
  },
  membership_page: {
    _sections: ['benefits', 'eligibility', 'tiers', 'steps', 'form'].map((key) => ({ key, show: true })),
    hero: { title: 'Join DiGRA South Africa', subtitle: "Be part of the chapter that's building African game studies.", breadcrumb: 'Home / Membership' },
    benefits: {
      eyebrow: 'Why Join?', title: 'Member Benefits',
      items: [
        { sprite: 'community', title: 'Community Access', colour: 'gold', text: 'Join a network of game scholars, students, educators, and developers across South Africa.' },
        { sprite: 'book', title: 'DiGRA Resources', colour: 'cyan', text: 'Access DiGRA International publications, the digital library, and member-only materials.' },
        { sprite: 'calendar', title: 'Events & Conferences', colour: 'green', text: 'Invitations to DiGRA SA events, workshops, and the annual DiGRA International conference.' },
        { sprite: 'mail', title: 'Newsletter', colour: 'violet', text: 'Regular updates on African game studies research, calls for papers, and opportunities.' },
      ],
    },
    eligibility: {
      eyebrow: 'Eligibility', title: 'Who Can Join?',
      text: 'DiGRA SA is open to anyone with a genuine interest in games as a subject of serious study — regardless of your career stage, institutional affiliation, or background.',
      items: ['Academic researchers in game studies or related fields', 'Postgraduate students (Honours, Masters, PhD)', 'Undergraduate students with a research interest in games', 'Game educators at any level', 'Game developers with interest in research', 'Independent scholars and critics', 'Anyone interested in games as a serious field of study'],
    },
    tiers: {
      eyebrow: 'Pricing', title: 'Membership Tiers', note: 'Annual fees will be confirmed by the board.',
      items: [
        { name: 'Student', price: 'TBC / year', badge: '', features: ['Full chapter membership', 'Access to events', 'Newsletter', 'DiGRA library access'] },
        { name: 'Regular', price: 'TBC / year', badge: 'Most Common', features: ['Full chapter membership', 'Access to events', 'Newsletter', 'DiGRA library access', 'Voting rights', 'Eligibility for committee roles'] },
        { name: 'Institutional', price: 'TBC / year', badge: '', features: ['Institutional membership', 'Multiple member seats', 'All regular benefits', 'Institutional listing on site'] },
      ],
    },
    steps: {
      eyebrow: 'Process', title: 'How to Join',
      items: [
        { title: 'Fill in the Form', text: 'Complete the expression of interest form below.' },
        { title: 'We Follow Up', text: 'The committee reviews and reaches out within two weeks.' },
        { title: 'Confirm & Pay', text: 'Confirm your membership tier and pay the annual fee.' },
        { title: 'Welcome', text: "You're in. Get access to resources, events, and the community." },
      ],
    },
    form: {
      eyebrow: 'Expression of Interest', title: 'Join the Chapter',
      text: 'Fill in the form and the committee will be in touch within two weeks.\n\nQuestions before you join? Email [info@digrasa.co.za](mailto:info@digrasa.co.za).',
      next_steps: [],
      name_label: 'Full Name', name_placeholder: 'Dr. Jane Smith',
      email_label: 'Email', email_placeholder: 'jane@university.ac.za',
      institution_label: 'Institution / Affiliation', institution_placeholder: 'University of the Witwatersrand',
      role_label: 'Role', role_options: ['Academic / Researcher', 'Postgraduate Student', 'Undergraduate Student', 'Educator', 'Game Developer', 'Independent Scholar', 'Other'],
      interests_label: 'Research Interests', interests_placeholder: 'Tell us briefly about your interests in game studies...',
      heard_label: 'How did you hear about us?', heard_options: ['DiGRA International', 'Colleague / Word of mouth', 'Social media', 'Discord', 'Web search', 'Event / Conference', 'Other'],
      button: 'Submit Expression of Interest',
      success_title: 'Thanks, {name}!',
      success_text: "We've received your expression of interest. The committee will be in touch within two weeks.",
    },
  },
  contact_page: {
    _sections: ['quick', 'social'].map((key) => ({ key, show: true })),
    hero: { title: 'Get in Touch', subtitle: "We're a new chapter — questions and ideas are very welcome.", breadcrumb: 'Home / Contact' },
    notice: { text: "DiGRA SA is newly established — we're building something new and welcome all enquiries." },
    form: {
      eyebrow: 'Send a Message', title: 'Contact Us',
      name_label: 'Name', email_label: 'Email',
      subject_label: 'Subject', subject_options: ['Membership enquiry', 'Events & hosting', 'Research collaboration', 'Press & media', 'General enquiry'],
      message_label: 'Message', message_placeholder: "What's on your mind?",
      button: 'Send Message', success_title: 'Message Sent', success_text: "Thanks for reaching out. We'll get back to you as soon as we can.",
    },
    info: { title: 'Contact Info', follow_title: 'Follow Us' },
    quick: {
      items: [
        { title: 'Membership Enquiry', text: 'Questions about joining DiGRA SA?', link: L('View Membership →', '/membership'), colour: 'gold' },
        { title: 'Research Collaboration', text: 'Want to co-author or run a project?', link: L('View Research →', '/research'), colour: 'cyan' },
        { title: 'Host an Event', text: 'Interested in running something at your institution?', link: L('View Events →', '/events#host'), colour: 'green' },
      ],
    },
    social: { eyebrow: 'Follow Along', title: 'Stay Connected' },
  },
  not_found: {
    main: { title: 'Page not found', text: "The page you're looking for doesn't exist or has moved.", button: L('Back to Home', '/') },
  },
}

const seed = {
  version: 1,
  settings,
  collections: {
    team: teamItems,
    events: eventItems,
    news: newsItems,
    research_areas: researchAreas.map((a, i) => ({ title: a.title, description: a.description, tags: a.tags,
      icon: ['africa', 'book', 'gamepad', 'scroll', 'trophy', 'globe'][i] || 'book',
      colour: ['gold', 'red', 'cyan', 'gold', 'cyan', 'red'][i] || 'gold' })),
    journals: journals.map((j) => ({ name: j.name, url: j.url, description: j.description })),
    teaching: [
      { title: 'Course Syllabi', description: 'Sample syllabi for game studies courses designed for South African higher education contexts.', url: '', status: 'Coming soon' },
      { title: 'Introductory Texts', description: 'Curated reading lists for students entering game studies for the first time.', url: '', status: 'Coming soon' },
      { title: 'African Reading List', description: 'A focused collection of scholarship on games from and about the African continent.', url: '', status: 'Coming soon' },
    ],
  },
}

writeFileSync(new URL('../src/content/seed.json', import.meta.url), JSON.stringify(seed, null, 2))
console.log('team', teamItems.length, 'events', eventItems.length, 'news', newsItems.length)
