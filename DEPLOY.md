# Deploy Guide

Step-by-step instructions to take this codebase from your computer to a live website on your own domain, with HTTPS. Written assuming you've never deployed a website before.

The site is built with **Vercel** (a free hosting service built by the makers of Next.js, which this site uses). Everything below uses Vercel's free tier — no credit card required for what this site needs.

## What you'll need

- A free [GitHub](https://github.com) account (to store the code)
- A free [Vercel](https://vercel.com) account (to host the site) — you can sign up using your GitHub account, which skips a separate signup step
- A domain name, purchased from any registrar (Namecheap, GoDaddy, Google Domains, etc.) — you don't need this on day one; you can deploy first and connect the domain later (Step 5)

---

## Step 1: Push the code to GitHub

If the code isn't already on GitHub:

1. Go to [github.com/new](https://github.com/new) and create a new repository (private is fine).
2. In a terminal, inside this project folder, run:
   ```bash
   git remote add origin <the URL GitHub gave you>
   git push -u origin master
   ```

If it's already on GitHub (check by running `git remote -v`), skip to Step 2.

## Step 2: Import the project into Vercel

1. Log into [vercel.com](https://vercel.com).
2. Click **Add New → Project**.
3. Choose **Import Git Repository** and select this repository.
4. Vercel will auto-detect this as a Next.js project. Leave the build settings as detected:
   - **Build Command:** `npm run build`
   - **Output Directory:** `out` (this comes from `output: 'export'` in `next.config.js`, which makes Next.js produce a plain static site — no server required)
5. Click **Deploy**. The first build takes 1-2 minutes.

## Step 3: Check the first deploy

When it finishes, Vercel gives you a free URL like `your-project-name.vercel.app`. Open it and click through:

- Both languages (`/en/` and `/so/`) load
- The navigation menu, footer links, and language switcher work
- The Donate and Contact pages load (their placeholder text/numbers will still show `[TO BE CONFIRMED]` until you've followed `CONTENT-GUIDE.md` to fill those in)

This URL works immediately with free HTTPS — you can share it as-is if you want to preview the site before buying a domain.

## Step 4: Set up the contact form (Formspree)

The Contact page's form submits via [Formspree](https://formspree.io), a form-handling service — there is no server of our own involved.

1. Sign up for a free Formspree account.
2. Create a new form and copy the form ID it gives you (looks like `xyzabcde`).
3. In `content/en.json` and `content/so.json`, find `"formspreeEndpoint"` under `"contact"` and replace the placeholder with your real endpoint URL, e.g. `https://formspree.io/f/xyzabcde`.
4. Commit and push that change (see `CONTENT-GUIDE.md`'s "Publishing your changes" section) — Vercel redeploys automatically.
5. Submit a real test message through the live Contact page and confirm it arrives in your Formspree inbox/email.

## Step 5: Connect your real domain

Once you own a domain (e.g. `yourorganization.org`):

1. In the Vercel dashboard, open your project → **Settings → Domains**.
2. Type in your domain and click **Add**.
3. Vercel shows you one or two DNS records to add (usually an `A` record for the bare domain and a `CNAME` for `www`). Log into your domain registrar's DNS settings and add exactly what Vercel shows you.
4. DNS changes can take anywhere from a few minutes to a few hours to take effect. Vercel's dashboard shows a green checkmark once it detects the domain is correctly pointed at it, and automatically issues a free HTTPS certificate — no separate action needed for HTTPS.
5. Decide whether the bare domain (`yourorganization.org`) or the `www` version is the primary one, and set the other to redirect to it in the same Domains settings screen.

## Step 6: Point the site's own metadata at the real domain

Several files reference the site's own URL for search engines and social sharing (`sitemap.xml`, `robots.txt`, canonical links, Open Graph tags). All of them read from one place:

1. Open `lib/site-config.ts`.
2. Replace `https://example.org` with your real domain, e.g.:
   ```ts
   export const SITE_URL = 'https://yourorganization.org'
   ```
3. Commit and push. Vercel redeploys, and every canonical/sitemap/OG URL across the whole site becomes correct automatically — this is the only file that needs the domain typed in.

## Step 7: Post-deploy checks

Once the real domain is live:

- Visit `https://yourdomain.org/sitemap.xml` and `https://yourdomain.org/robots.txt` — both should load and show your real domain, not `example.org`.
- Check security headers at [securityheaders.com](https://securityheaders.com) — these come from `vercel.json` and should already show as configured (Content-Security-Policy, HSTS, X-Frame-Options, Referrer-Policy).
- Re-run the Lighthouse audit against the *live* domain, not just `localhost`. The scores recorded in `docs/superpowers/reports/2026-07-14-phase-7b-lighthouse-accessibility-audit.md` were measured against a local build — real network/CDN conditions can shift Performance in particular. Run `npm run audit:lighthouse` after temporarily pointing the script's `BASE_URL` at your live domain, or use Google's free [PageSpeed Insights](https://pagespeed.web.dev) tool against your live URL instead.
- Submit the real Contact form once more on the live domain (not just the preview URL) to confirm Formspree still receives it.

## Ongoing deploys

From here on, every `git push` to the branch Vercel is watching (`master`) automatically triggers a new build and deploy — there is no separate "publish" button to click. If a deploy ever looks wrong, the Vercel dashboard's **Deployments** tab lets you instantly roll back to any previous successful deploy with one click.
