# DiGRA South Africa: website

The website of DiGRA South Africa, the South African chapter of the Digital Games Research Association. Live at **https://digrasa.co.za**, hosted on Axxess (cPanel).

**All content is edited in the admin dashboard at https://digrasa.co.za/admin.** That includes every heading, paragraph, button, menu link, event, news story, board member, photo and form option. A developer is only needed to change how the site *looks* or *works*, not what it *says*.

Made by Lindokuhle Dlamini (lindodlamini315@gmail.com) and Louis Monawe (l.k.monawe@gmail.com).

---

## For the keeper

Sign in at `/admin`. The **Keeper's guide** inside the admin explains everything in plain language. In short:

| To change… | Go to |
|---|---|
| Events (they move to Past by themselves after the end date) | Lists → Events |
| News stories (each gets its own page) | Lists → News |
| Board members, photos, vacant seats | Lists → Board and people |
| Research areas, journals, teaching resources | Lists → … |
| Any text on a page, and the order of its sections | Page text → that page |
| Menu, footer, Discord, social links, notice bar, form email | Page text → Menu / Footer / Site settings |
| Form messages | Messages |
| Who can sign in | People who can sign in (administrators only) |

Every save keeps the previous version (**Earlier versions**), and deleted items can be restored (**Recently deleted**). Download a **backup** every few months.

---

## How it works

- **Front end:** React 19, Vite 7, Tailwind CSS 4, Framer Motion, React Router 7. A single-page app.
- **Back end:** plain PHP 8 and MySQL in `public/api/`. It runs on standard cPanel hosting with nothing to install.
- **Content:** stored in MySQL. The site loads it from `/api/content.php`. If the database can't be reached, the site falls back to the copy bundled at build time (`src/content/seed.json`), so it never shows a blank page.
- **What can be edited:** `src/content/schema.js` describes every editable page and list. The admin builds its forms from that file. To make something new editable, add a field there and read it in the page component.

```
src/
  content/schema.js       every editable field (admin forms are generated from this)
  content/seed.json       starting content, loaded into the database by the installer
  content/ContentContext  loads content; usePage('home') gives a page's text and section order
  pages/                  public pages (each section reads from content)
  admin/                  the /admin dashboard (only downloaded when someone opens /admin)
public/api/
  install.php             one-time setup: creates tables, loads content, makes the first admin
  content.php             public read-only content
  auth.php                sign in, sign out, forgotten password
  admin.php               everything the dashboard does (requires sign-in + CSRF token)
  upload.php              photo and PDF uploads (photos resized to WebP)
  contact.php             Contact and Membership forms (emails + saves to Messages)
public/uploads/           uploaded files (survives redeploys; scripts can't run here)
```

**Security:** passwords are hashed (`password_hash`). Sessions use HttpOnly, SameSite=Strict cookies and an 8-hour idle timeout. Every change needs a CSRF token. Sign-in is rate-limited. Password reset links expire after one hour. Uploads are checked by content and re-encoded, and the uploads folder can't run code. Admin and API are excluded from search engines.

---

## First-time setup on Axxess

1. **Create the database.** cPanel → **MySQL Database Wizard**. Create a database (e.g. `digrasa`), a user with a strong password, and give the user **All Privileges**. Note the full names cPanel shows (they're prefixed, e.g. `cpanelname_digrasa`).
2. **Create the sending mailbox.** cPanel → **Email Accounts**: make sure `no-reply@digrasa.co.za` exists (a mailbox or forwarder). Website emails are sent from it.
3. **Upload the site.** See "Deploy" below.
4. **Run the installer.** Open `https://digrasa.co.za/api/install.php`, enter the database details and create the first administrator. It saves the database settings to `digrasa-config.php` one level *above* `public_html`, so redeploying never overwrites them. The installer locks itself afterwards.
5. Sign in at `/admin`, then add each keeper under **People who can sign in**.

## Deploy (after code changes)

```bash
npm install
npm run build      # copies seed.json into api/, then builds dist/
```

1. cPanel → **File Manager → public_html**. Turn on **Show Hidden Files**.
2. Delete the old `assets/` folder.
3. Upload the **contents** of `dist/` into `public_html`, overwriting. **Don't delete `uploads/`.** It holds every photo uploaded through the admin.
4. If you uploaded a zip to extract it on the server, **delete the zip afterwards**. Anything in `public_html` can be downloaded by the public.
5. Hard-refresh the site (Ctrl+F5) and check that `/about` and `/admin` load.

Content edits never need a redeploy. Only code changes do.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173. Uses the bundled content; forms and /admin need PHP.
```

To run the full thing locally with PHP and MySQL: build, serve `dist/` with `php -S localhost:8090 ../scripts/router.php` from inside `dist/` (a router that sends unknown paths to `index.html`), and open `/api/install.php`. In the generated config file, add `'mail_disabled' => true,` to skip sending real email.

`scripts/build-seed.mjs` converted the old hand-edited data files (kept in `scripts/legacy-data/` for reference) into `seed.json`. It isn't needed any more.
