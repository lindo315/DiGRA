// ─────────────────────────────────────────────────────────────────────────
// The content model for the whole site.
//
// Every page and every list on the website is described here. The admin
// dashboard builds its forms from this file, and the pages read the same
// keys. To make something new editable: add a field here, then read it in
// the page. Nothing else is needed (the database stores whatever is saved).
// ─────────────────────────────────────────────────────────────────────────

export const COLOURS = [
  { value: 'gold', label: 'Gold' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'violet', label: 'Violet' },
  { value: 'orange', label: 'Orange' },
]

export const SPRITES = ['book', 'gamepad', 'africa', 'community', 'globe', 'trophy', 'lightning', 'scroll', 'calendar', 'mail', 'star']
  .map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))

export const SOCIAL_NETWORKS = [
  { value: 'discord', label: 'Discord' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'website', label: 'Other website' },
]

// ── Field helpers ────────────────────────────────────────────────────────
const text = (key, label, help) => ({ key, label, type: 'text', help })
const area = (key, label, help) => ({ key, label, type: 'textarea', help })
const link = (key, label, help) => ({ key, label, type: 'link', help })
const links = (key, label, help) => ({ key, label, type: 'links', help })
const lines = (key, label, help) => ({ key, label, type: 'lines', help })
const colour = (key = 'colour', label = 'Colour') => ({ key, label, type: 'select', options: COLOURS })
const sprite = (key = 'sprite', label = 'Icon') => ({ key, label, type: 'select', options: SPRITES })
const list = (key, label, fields, opts = {}) => ({ key, label, type: 'list', fields, ...opts })
const num = (key, label, help) => ({ key, label, type: 'number', help })
const bool = (key, label, help) => ({ key, label, type: 'bool', help })

const PARA_HELP = 'Leave an empty line between paragraphs. **bold**, *italic* and [link text](https://…) work here.'
const heading = (eyebrowDefault) => [
  text('eyebrow', 'Small label above the heading', eyebrowDefault),
  text('title', 'Heading'),
]
const cta = { key: 'cta', label: 'Join banner at the bottom', fields: [text('title', 'Heading'), text('text', 'Text'), link('button', 'Button')] }

// ── Pages (stored in the settings table, one record per page) ───────────
// Each page has groups. Groups with `movable: true` can be re-ordered or
// hidden from the admin ("Sections on this page").
// Storage: `flat` pages keep all fields at the top level; other pages keep
// one object per group, e.g. settings.home.hero.title, plus
// settings.home._sections = [{ key, show }] for the section order.
export const PAGES = [
  {
    key: 'site',
    flat: true,
    label: 'Site settings',
    description: 'Name, emails, Discord, social links, the notice bar and the website credit.',
    groups: [
      {
        key: 'identity', label: 'Name and description', fields: [
          text('name', 'Full name'),
          text('short_name', 'Short name'),
          area('description', 'Description for search engines and link previews'),
        ],
      },
      {
        key: 'contact', label: 'Contact', fields: [
          { key: 'contact_email', label: 'Public contact email', type: 'email', help: 'Shown on the Contact page and in the footer.' },
          { key: 'form_recipient', label: 'Send form messages to', type: 'email', help: 'Contact and membership forms are emailed here. A copy is always kept in Admin → Messages.' },
          text('location_label', 'Location shown on Contact page'),
        ],
      },
      {
        key: 'discord', label: 'Discord', fields: [
          { key: 'discord_url', label: 'Discord invite link', type: 'url', help: 'Leave empty to hide Discord everywhere.' },
          text('discord_label', 'Button text'),
          area('discord_text', 'Short description'),
        ],
      },
      {
        key: 'social', label: 'Social media', fields: [
          list('social', 'Profiles', [
            { key: 'network', label: 'Network', type: 'select', options: SOCIAL_NETWORKS },
            text('label', 'Name shown'),
            { key: 'url', label: 'Profile link', type: 'url', help: 'Profiles without a link are hidden.' },
          ], { itemLabel: (i) => i.label || i.network, addLabel: 'Add a profile' }),
        ],
      },
      {
        key: 'notice', label: 'Notice bar (top of every page)', fields: [
          bool('announcement_show', 'Show the notice bar'),
          area('announcement_text', 'Notice text'),
          link('announcement_link', 'Link'),
        ],
      },
      {
        key: 'links', label: 'DiGRA links', fields: [
          { key: 'digra_url', label: 'DiGRA International website', type: 'url' },
          { key: 'library_url', label: 'DiGRA Digital Library', type: 'url' },
        ],
      },
      {
        key: 'credit', label: 'Website credit (footer)', fields: [
          text('credit_label', 'Credit text'),
          list('credits', 'People', [text('name', 'Name'), { key: 'email', label: 'Email', type: 'email' }], { itemLabel: (i) => i.name, addLabel: 'Add a person' }),
        ],
      },
    ],
  },
  {
    key: 'nav',
    flat: true,
    label: 'Menu',
    description: 'The links in the top menu and their drop-downs.',
    groups: [
      {
        key: 'menu', label: 'Menu links', fields: [
          list('items', 'Links', [
            text('label', 'Label'),
            { key: 'to', label: 'Goes to', type: 'url', help: 'A page such as /events, or a full web address.' },
            list('sections', 'Drop-down links', [text('label', 'Label'), text('hash', 'Section on that page', 'For example #upcoming')], { itemLabel: (i) => i.label, addLabel: 'Add a drop-down link' }),
          ], { itemLabel: (i) => i.label, addLabel: 'Add a menu link' }),
        ],
      },
      { key: 'join', label: 'Join button', fields: [text('join_label', 'Button text'), text('join_label_short', 'Short text on phones'), { key: 'join_to', label: 'Goes to', type: 'url' }] },
    ],
  },
  {
    key: 'footer',
    flat: true,
    label: 'Footer',
    description: 'The bottom of every page.',
    groups: [
      { key: 'brand', label: 'About blurb', fields: [text('title', 'Name'), text('subtitle', 'Line under the name'), area('blurb', 'Short description'), link('join', 'Button')] },
      {
        key: 'columns', label: 'Link columns', fields: [
          list('columns', 'Columns', [text('heading', 'Column heading'), links('links', 'Links')], { itemLabel: (i) => i.heading, addLabel: 'Add a column' }),
        ],
      },
      { key: 'contact', label: 'Contact column', fields: [text('contact_heading', 'Heading')] },
      { key: 'legal', label: 'Bottom line', fields: [area('legal', 'Text'), text('admin_label', 'Admin login button', 'The button keepers use to reach /admin. Leave empty to hide it (the admin still works at digrasa.co.za/admin).')] },
    ],
  },
  {
    key: 'home',
    label: 'Home page',
    path: '/',
    groups: [
      {
        key: 'hero', label: 'Top banner', fields: [
          text('eyebrow', 'Small label'),
          text('title_1', 'Heading, first line'),
          text('title_2', 'Heading, second line (gold)'),
          area('text', 'Introduction'),
          link('primary', 'Main button'),
          link('secondary', 'Second button'),
          bool('show_next', 'Show the next upcoming event under the buttons'),
          text('next_label', 'Label before the next event'),
          list('blocks', 'Coloured blocks on the right', [sprite(), text('label', 'Word'), text('tag', 'Small text'), colour()], { itemLabel: (i) => i.label, max: 4 }),
          list('stats', 'Strip along the bottom', [text('label', 'Label'), text('value', 'Value')], { itemLabel: (i) => i.label, max: 4 }),
        ],
      },
      {
        key: 'paths', label: 'Start here', movable: true, fields: [
          ...heading(), area('text', 'Introduction'),
          list('items', 'Paths', [text('audience', 'Who it is for'), text('title', 'Heading'), area('text', 'Text'), colour(), links('links', 'Links')], { itemLabel: (i) => i.audience }),
        ],
      },
      { key: 'events', label: 'Upcoming events', movable: true, fields: [...heading(), text('link_label', 'Link to all events'), num('count', 'How many events to show'), area('empty', 'Text when there are no upcoming events')] },
      { key: 'news', label: 'Latest news', movable: true, fields: [...heading(), text('link_label', 'Link to all news'), num('count', 'How many stories to show (1 to 3)')] },
      {
        key: 'mission', label: 'What we stand for', movable: true, fields: [
          ...heading(),
          list('items', 'Points', [sprite(), text('title', 'Heading'), area('text', 'Text'), colour()], { itemLabel: (i) => i.title }),
        ],
      },
      { key: 'about', label: 'About teaser', movable: true, fields: [...heading(), area('text', 'Text', PARA_HELP), link('link', 'Link'), text('quote', 'Quote'), text('quote_source', 'Quote source')] },
      { key: 'people', label: 'People strip', movable: true, fields: [...heading(), text('link_label', 'Link to the board'), num('count', 'How many people to show'), bool('include_vacant', 'Include vacant seats')] },
      {
        key: 'gap', label: 'Why it matters', movable: true, fields: [
          ...heading(), area('text', 'Text', PARA_HELP), link('link', 'Link'),
          list('points', 'Points', [sprite(), text('title', 'Heading'), text('text', 'Text'), colour()], { itemLabel: (i) => i.title }),
        ],
      },
      { key: 'discord', label: 'Discord invitation', movable: true, fields: [...heading(), area('text', 'Text'), text('button', 'Button text')] },
      { ...cta, movable: true },
    ],
  },
  {
    key: 'about',
    label: 'About page',
    path: '/about',
    groups: [
      { key: 'hero', label: 'Page heading', fields: [text('title', 'Heading'), text('subtitle', 'Line under the heading'), text('breadcrumb', 'Breadcrumb')] },
      {
        key: 'who', label: 'Who we are', movable: true, fields: [
          ...heading(), area('text', 'Text', PARA_HELP), text('facts_title', 'Key facts heading'),
          list('facts', 'Key facts', [text('label', 'Label'), text('value', 'Value')], { itemLabel: (i) => i.label }),
        ],
      },
      {
        key: 'mission', label: 'Mission and goals', movable: true, fields: [
          text('title', 'Heading'), area('text', 'Mission statement'),
          list('goals', 'Goals', [text('title', 'Goal'), area('text', 'Description'), colour()], { itemLabel: (i) => i.title }),
        ],
      },
      { key: 'aims', label: 'Our aims', movable: true, fields: [...heading(), area('text', 'Introduction'), lines('items', 'Aims', 'One aim per line.')] },
      {
        key: 'board', label: 'The board', movable: true, fields: [
          ...heading(), area('note', 'Note under the heading'),
          text('vacant_name', 'Name shown on a vacant seat'), text('vacant_button', 'Button on a vacant seat'),
          text('profile_label', 'Link text on each card'), text('no_bio', 'Text when there is no bio yet'),
        ],
        help: 'The people themselves are edited under Board and people.',
      },
      { key: 'intl', label: 'DiGRA International', movable: true, fields: [...heading(), area('text', 'Text', PARA_HELP), text('card_label', 'Card label'), text('card_title', 'Card title'), text('card_text', 'Card text'), link('link', 'Button')] },
      { key: 'values', label: 'Values strip', movable: true, fields: [list('items', 'Values', [text('label', 'Value'), text('text', 'Short line'), colour()], { itemLabel: (i) => i.label, max: 4 })] },
      { ...cta, movable: true },
    ],
  },
  {
    key: 'events_page',
    label: 'Events page',
    path: '/events',
    groups: [
      { key: 'hero', label: 'Page heading', fields: [text('title', 'Heading'), text('subtitle', 'Line under the heading'), text('breadcrumb', 'Breadcrumb')] },
      { key: 'upcoming', label: 'Upcoming events', movable: true, fields: [...heading(), lines('pills', 'Small tags next to the heading', 'One per line. {count} is replaced with the number of events.'), text('featured_label', 'Label on the featured event'), text('more_label', 'Link to the event\'s article'), area('empty', 'Text when there are none')] },
      { key: 'past', label: 'Past events', movable: true, fields: [...heading(), area('empty', 'Text when there are none'), text('recap_label', 'Link to a recap article')] },
      { key: 'host', label: 'Host an event', movable: true, fields: [...heading(), area('text', 'Text', PARA_HELP), link('button', 'Button'), lines('formats', 'Tags in the purple box', 'One per line.'), text('formats_note', 'Line under the tags')] },
      { key: 'formats', label: 'Event formats', movable: true, fields: [...heading(), list('items', 'Formats', [text('title', 'Format'), area('text', 'Description'), colour()], { itemLabel: (i) => i.title })] },
      { ...cta, movable: true },
    ],
  },
  {
    key: 'research_page',
    label: 'Research page',
    path: '/research',
    groups: [
      { key: 'hero', label: 'Page heading', fields: [text('title', 'Heading'), text('subtitle', 'Line under the heading'), text('breadcrumb', 'Breadcrumb')] },
      { key: 'field', label: 'Game studies in SA', movable: true, fields: [...heading(), area('text', 'Text', PARA_HELP), list('asides', 'Side notes', [text('title', 'Heading'), area('text', 'Text'), colour()], { itemLabel: (i) => i.title })] },
      { key: 'areas', label: 'Research areas', movable: true, fields: heading(), help: 'The areas themselves are edited under Research areas.' },
      { key: 'library', label: 'DiGRA Digital Library', movable: true, fields: [...heading(), area('text', 'Text', PARA_HELP), link('link', 'Button'), text('card_label', 'Card label'), list('facts', 'Facts', [text('label', 'Label'), text('value', 'Value')], { itemLabel: (i) => i.label })] },
      { key: 'journals', label: 'Journals', movable: true, fields: [...heading(), text('link_label', 'Link text on each journal')], help: 'The journals themselves are edited under Journals.' },
      { key: 'teaching', label: 'Teaching resources', movable: true, fields: [...heading(), area('text', 'Introduction')], help: 'The resources are edited under Teaching resources.' },
      { key: 'contribute', label: 'Contribute', movable: true, fields: [...heading(), list('items', 'Ways to contribute', [text('title', 'Heading'), area('text', 'Text'), colour()], { itemLabel: (i) => i.title })] },
      { ...cta, movable: true },
    ],
  },
  {
    key: 'news_page',
    label: 'News page',
    path: '/news',
    groups: [
      { key: 'hero', label: 'Page heading', fields: [text('title', 'Heading'), text('subtitle', 'Line under the heading'), text('breadcrumb', 'Breadcrumb')] },
      { key: 'list', label: 'News list', fields: [area('empty', 'Text when there is no news'), text('read_more', 'Read more link')] },
      {
        key: 'article', label: 'Article pages', fields: [
          text('back_label', 'Back link at the top'), text('back_bottom', 'Back link at the bottom'), text('by_label', 'Word before the author'),
          text('deadline_label', 'Word before a deadline'), area('deadline_text', 'Text in the deadline box'), text('board_button', 'Board button in the deadline box'),
          link('join', 'Button at the end of each article'), text('more_title', 'Heading above other stories'),
        ],
      },
    ],
  },
  {
    key: 'membership_page',
    label: 'Membership page',
    path: '/membership',
    groups: [
      { key: 'hero', label: 'Page heading', fields: [text('title', 'Heading'), text('subtitle', 'Line under the heading'), text('breadcrumb', 'Breadcrumb')] },
      { key: 'benefits', label: 'Member benefits', movable: true, fields: [...heading(), list('items', 'Benefits', [sprite(), text('title', 'Heading'), area('text', 'Text'), colour()], { itemLabel: (i) => i.title })] },
      { key: 'eligibility', label: 'Who can join', movable: true, fields: [...heading(), area('text', 'Introduction'), lines('items', 'Who can join', 'One per line.')] },
      {
        key: 'tiers', label: 'Membership tiers', movable: true, fields: [
          ...heading(), area('note', 'Note under the tiers'),
          list('items', 'Tiers', [text('name', 'Name'), text('price', 'Price'), text('badge', 'Highlight label', 'Leave empty for no highlight.'), lines('features', 'What is included', 'One per line.')], { itemLabel: (i) => i.name }),
        ],
      },
      { key: 'steps', label: 'How to join', movable: true, fields: [...heading(), list('items', 'Steps', [text('title', 'Step'), area('text', 'Description')], { itemLabel: (i) => i.title })] },
      {
        key: 'form', label: 'Join form', movable: true, fields: [
          ...heading(), area('text', 'Text beside the form'), lines('next_steps', 'What happens next', 'One per line.'),
          text('name_label', 'Name label'), text('name_placeholder', 'Name example'),
          text('email_label', 'Email label'), text('email_placeholder', 'Email example'),
          text('institution_label', 'Institution label'), text('institution_placeholder', 'Institution example'),
          text('role_label', 'Role label'), lines('role_options', 'Role choices', 'One per line.'),
          text('interests_label', 'Interests label'), text('interests_placeholder', 'Interests example'),
          text('heard_label', '"How did you hear about us" label'), lines('heard_options', 'Choices', 'One per line.'),
          text('button', 'Send button'), text('success_title', 'Heading after sending', '{name} is replaced with their first name.'), area('success_text', 'Text after sending'),
        ],
      },
    ],
  },
  {
    key: 'contact_page',
    label: 'Contact page',
    path: '/contact',
    groups: [
      { key: 'hero', label: 'Page heading', fields: [text('title', 'Heading'), text('subtitle', 'Line under the heading'), text('breadcrumb', 'Breadcrumb')] },
      { key: 'notice', label: 'Notice', fields: [area('text', 'Notice text', 'Leave empty to hide.')] },
      {
        key: 'form', label: 'Message form', fields: [
          ...heading(),
          text('name_label', 'Name label'), text('email_label', 'Email label'),
          text('subject_label', 'Subject label'), lines('subject_options', 'Subject choices', 'One per line.'),
          text('message_label', 'Message label'), text('message_placeholder', 'Message example'),
          text('button', 'Send button'), text('success_title', 'Heading after sending'), area('success_text', 'Text after sending'),
        ],
      },
      { key: 'info', label: 'Contact details panel', fields: [text('title', 'Heading'), text('follow_title', 'Social heading')] },
      { key: 'quick', label: 'Quick links', movable: true, fields: [list('items', 'Links', [text('title', 'Heading'), text('text', 'Text'), link('link', 'Link'), colour()], { itemLabel: (i) => i.title })] },
      { key: 'social', label: 'Stay connected', movable: true, fields: [...heading()], help: 'Shows your Discord and social profiles from Site settings.' },
    ],
  },
  {
    key: 'not_found',
    label: 'Page not found',
    groups: [{ key: 'main', label: 'Message', fields: [text('title', 'Heading'), area('text', 'Text'), link('button', 'Button')] }],
  },
]

// ── Lists (stored as items, one record each) ─────────────────────────────
export const COLLECTIONS = [
  {
    key: 'events',
    label: 'Events',
    singular: 'event',
    description: 'Events move from Upcoming to Past by themselves the day after their end date.',
    titleField: 'title',
    subtitle: (i) => [i.date_label || i.start_date, i.location].filter(Boolean).join(', '),
    sortHint: 'Upcoming events are shown soonest first and past events newest first, using their dates. The order here is only used for events without dates.',
    fields: [
      text('title', 'Event name'),
      { key: 'type', label: 'Type', type: 'text', suggestions: ['Symposium', 'Workshop', 'Seminar', 'Conference', 'Talk', 'Panel', 'Webinar', 'Game Jam', 'Launch Event', 'Industry Event', 'Founding Workshop'] },
      { key: 'start_date', label: 'Start date', type: 'date' },
      { key: 'end_date', label: 'End date', type: 'date', help: 'For a one-day event, use the same date as the start.' },
      text('date_label', 'Date as written on the site', 'For example "3–8 December 2026" or "18:00 SAST, 2 June 2026".'),
      text('location', 'Location'),
      { key: 'location_url', label: 'Map or venue link', type: 'url' },
      area('description', 'Description', PARA_HELP),
      links('links', 'Buttons (tickets, programme, registration…)'),
      { key: 'news_slug', label: 'Recap article', type: 'news' },
      { key: 'status', label: 'If there are no dates, show it under', type: 'select', options: [{ value: 'auto', label: 'Decide from the dates' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }] },
    ],
    blank: { title: '', type: 'Workshop', start_date: '', end_date: '', date_label: '', location: '', location_url: '', description: '', links: [], news_slug: '', status: 'auto' },
  },
  {
    key: 'news',
    label: 'News',
    singular: 'story',
    description: 'The newest story is featured on the Home page. Each story gets its own page at /news/its-web-address.',
    titleField: 'title',
    subtitle: (i) => [i.category, i.date_label].filter(Boolean).join(', '),
    sortBy: 'publish_date',
    fields: [
      text('title', 'Headline'),
      { key: 'slug', label: 'Web address', type: 'slug', from: 'title', help: 'The end of the link, e.g. board-call-for-nominations. Changing it breaks links people have already shared.' },
      { key: 'category', label: 'Category', type: 'select', options: ['Announcement', 'Event', 'Community', 'Research'].map((v) => ({ value: v, label: v })) },
      { key: 'publish_date', label: 'Date', type: 'date', help: 'Used to put the newest story first.' },
      text('date_label', 'Date as written on the site', 'Leave empty to use the date above.'),
      text('author', 'Author'),
      { key: 'image', label: 'Photo', type: 'image' },
      text('image_alt', 'Describe the photo', 'For people using screen readers.'),
      area('excerpt', 'Summary', 'Shown on cards and in link previews.'),
      text('deadline', 'Deadline (optional)', 'Shown as a highlighted line on the card.'),
      { key: 'body', label: 'Article', type: 'blocks' },
    ],
    blank: { title: '', slug: '', category: 'Announcement', publish_date: '', date_label: '', author: '', image: '', image_alt: '', excerpt: '', deadline: '', body: [{ type: 'p', text: '' }] },
  },
  {
    key: 'team',
    label: 'Board and people',
    singular: 'person',
    description: 'The board on the About page, in this order. Turn on "Vacant seat" for open positions.',
    titleField: 'name',
    itemTitle: (i) => (i.vacant ? `Vacant: ${i.role}` : i.name),
    subtitle: (i) => i.role,
    image: 'photo',
    fields: [
      bool('vacant', 'Vacant seat', 'Shows a "nominations open" card instead of a person.'),
      text('name', 'Name, with title', 'For example "Dr Rachel van der Merwe".'),
      text('role', 'Role on the board'),
      text('institution', 'Institution or organisation'),
      { key: 'photo', label: 'Photo', type: 'image', help: 'A portrait about 600 × 800 pixels works best.' },
      area('bio', 'Bio', PARA_HELP),
      bool('featured', 'Show larger (for President and Vice President)'),
      area('vacancy_text', 'Text on the vacant card'),
      { key: 'vacancy_link', label: 'Vacant card links to', type: 'url' },
    ],
    showIf: { name: (i) => !i.vacant, institution: (i) => !i.vacant, photo: (i) => !i.vacant, bio: (i) => !i.vacant, featured: (i) => !i.vacant, vacancy_text: (i) => i.vacant, vacancy_link: (i) => i.vacant },
    blank: { vacant: false, name: '', role: '', institution: '', photo: '', bio: '', featured: false, vacancy_text: '', vacancy_link: '/news/board-call-for-nominations' },
  },
  {
    key: 'research_areas',
    label: 'Research areas',
    singular: 'research area',
    titleField: 'title',
    fields: [text('title', 'Name'), area('description', 'Description'), lines('tags', 'Tags', 'One per line.'), sprite('icon', 'Icon'), colour()],
    blank: { title: '', description: '', tags: [], icon: 'book', colour: 'gold' },
  },
  {
    key: 'journals',
    label: 'Journals',
    singular: 'journal',
    titleField: 'name',
    fields: [text('name', 'Name'), { key: 'url', label: 'Website', type: 'url' }, area('description', 'Description')],
    blank: { name: '', url: '', description: '' },
  },
  {
    key: 'teaching',
    label: 'Teaching resources',
    singular: 'resource',
    titleField: 'title',
    subtitle: (i) => (i.url ? 'Available' : i.status),
    fields: [
      text('title', 'Name'),
      area('description', 'Description'),
      { key: 'url', label: 'Link or uploaded PDF', type: 'file', help: 'Leave empty while it is not ready yet.' },
      text('status', 'Label while there is no link', 'For example "Coming soon".'),
    ],
    blank: { title: '', description: '', url: '', status: 'Coming soon' },
  },
]

export const pageByKey = Object.fromEntries(PAGES.map((p) => [p.key, p]))
export const collectionByKey = Object.fromEntries(COLLECTIONS.map((c) => [c.key, c]))

/** Section order for a page: saved order first, then any sections added since. */
export function sectionOrder(pageKey, saved) {
  const movable = (pageByKey[pageKey]?.groups || []).filter((g) => g.movable).map((g) => g.key)
  const list = Array.isArray(saved) ? saved.filter((s) => movable.includes(s.key)) : []
  for (const k of movable) if (!list.find((s) => s.key === k)) list.push({ key: k, show: true })
  return list
}
