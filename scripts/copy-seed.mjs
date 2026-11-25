// The installer (public/api/install.php) loads the starting content from api/seed.json.
// It's the same file the site falls back to, so they never drift apart.
import { copyFileSync } from 'node:fs'
copyFileSync(new URL('../src/content/seed.json', import.meta.url), new URL('../public/api/seed.json', import.meta.url))
console.log('seed.json copied to public/api/')
