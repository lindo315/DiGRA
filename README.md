# DiGRA South Africa — website

The website of DiGRA South Africa, the South African chapter of the Digital Games Research Association. Live at **https://digrasa.co.za**.

Built with React 19, Vite 7, Tailwind CSS 4, Framer Motion and React Router 7.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Where to edit content

Most updates are made in a data file. You don't need to touch the page code.

| What | File |
|---|---|
| Events | `src/data/events.js` |
| News and announcements (each gets its own page at `/news/<slug>`) | `src/data/news.js` |
| Committee members and bios | `src/data/team.js` |
| Research areas and journals | `src/data/research.js` |
| Contact email and social media links | `src/data/site.js` |

**Events** move from Upcoming to Past automatically the day after their `endDate` (written as `YYYY-MM-DD`). The soonest upcoming event is featured at the top of the Events page. You can add `links: [{ label, url }]` for ticket or info buttons, and `newsSlug` to link a past event to its recap article.

**News:** put the newest item first, since the first item is featured on the Home page. `excerpt` is the short summary shown on cards. `body` is the full article: a plain string is a paragraph, `{ h: "…" }` is a sub-heading, `{ list: [...] }` is a bullet list, `{ quote: "…" }` is a highlighted line and `{ note: "…" }` is a small italic note. `image` is optional; put photos in `public/images/news/` as `.webp`, about 1400 px wide.

**Social links:** paste the profile URLs into `src/data/site.js`. Icons and the "Stay Connected" section only appear once a URL is filled in.

**Team photos:** `public/images/` as `.webp`, around 600×800 px and under about 80 KB.

**Colours:** the bright accents (gold, cyan, green and so on) are for the dark purple areas. For text on white or light backgrounds, use the `text-ink-*` classes or `ink(colour)` from `src/lib/theme.js`, so the text passes accessibility contrast (WCAG AA).

## Contact and Membership forms

Both forms post to `public/api/contact.php`, which emails each submission to **info@digrasa.co.za**, with Reply-To set to the sender. Spam protection includes a hidden honeypot field, a minimum time to fill in the form, and a limit of 5 submissions per IP every 10 minutes.

- In cPanel, make sure **no-reply@digrasa.co.za** exists as a mailbox or forwarder. It's the From address, and some mail servers reject mail from addresses that don't exist.
- After deploying, send a test message from the live Contact page and check that it arrives, including in the spam folder.
- The forms only work on the live server. `npm run dev` has no PHP, so the forms show an error message with a mailto link instead.

## Deploy to Axxess (cPanel)

1. Run `npm run build`. This creates `dist/`, which includes `.htaccess`, `robots.txt`, `sitemap.xml` and `api/contact.php`.
2. In cPanel, open **File Manager → public_html**.
3. Delete the old `assets/` folder so stale bundles don't build up.
4. Upload the **contents** of `dist/` (not the folder itself) into `public_html`, overwriting existing files.
   - Turn on "Show Hidden Files" so you can see that `.htaccess` was uploaded.
   - If you upload a zip to extract it on the server, **delete the zip afterwards**. Anything in `public_html` can be downloaded by the public.
5. Hard-refresh the live site (Ctrl+F5) and check that a deep link such as `/about` still loads.

`public/.htaccess` handles SPA routing (every path serves `index.html`), forces HTTPS, blocks archives and dotfiles, and sets compression and cache headers.

`vercel.json` is only used if the site is ever hosted on Vercel. Axxess ignores it.
