# ANT BYTE — Website

Premium marketing site for ANT BYTE. Pure **HTML5 + CSS3 + vanilla ES6 JavaScript**.
No frameworks, no build step, no npm. Upload and it runs.

## Structure

```
/
├── index.html          # Main page
├── 404.html            # Custom error page
├── robots.txt          # Crawler rules
├── sitemap.xml         # SEO sitemap
├── .htaccess           # Apache: HTTPS + security headers + caching
├── _headers            # Netlify / Cloudflare Pages: security headers
├── .gitignore
├── css/
│   ├── style.css       # Design system, tokens, components
│   ├── responsive.css  # Breakpoints (load after style.css)
│   └── animations.css  # Scroll reveal + reduced-motion
├── js/
│   ├── main.js         # Theme, nav, filters, FAQ, form validation
│   └── animations.js   # Reveal, counters, swarm canvas
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

## Deploy

**Any static host** — just upload the folder contents to the web root.

- **Netlify / Cloudflare Pages / Vercel:** drag-and-drop the folder. `_headers` applies security headers automatically.
- **Apache / cPanel shared hosting:** upload to `public_html/`. `.htaccess` forces HTTPS and sets security headers.
- **Nginx:** translate the headers in `_headers` into your `server {}` block.

After deploying, replace every `https://antbyte.example` with your real domain in
`index.html`, `robots.txt`, and `sitemap.xml`.

## Contact form

The form is **client-side validation only** — it does not send email on its own.
Wire it to a form service or backend, e.g. [Formspree](https://formspree.io):

```html
<form id="form" action="https://formspree.io/f/your-id" method="post">
```

Then remove the `e.preventDefault()` line in `js/main.js` (or let the service handle submit).

## Security notes

- Content-Security-Policy restricts scripts to same-origin (no inline JS).
- HSTS, X-Frame-Options (clickjacking), X-Content-Type-Options (MIME sniffing),
  Referrer-Policy and Permissions-Policy are all set.
- No third-party JS. Only Google Fonts CSS is loaded cross-origin (allow-listed in CSP).
- Dotfiles blocked from web access via `.htaccess`.

## Customise

Design tokens live at the top of `css/style.css` under `:root` — colors, spacing,
radius, shadows, fonts. Change them once and the whole site follows.
