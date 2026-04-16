# Bongi Workshop (Static Site)

This repo is a plain static website: `index.html` + `style.css` + `app.js` + `photos/`.

## One-click deployment setup

### Prerequisite: put the site on GitHub

Since your workspace isn’t a Git repo yet, you’ll need to initialize Git and push once:

1. `git init`
2. `git add .`
3. `git commit -m "Initial site"`
4. Create a GitHub repository (same name as desired) and push to `main`.

After it’s on GitHub, you can use the one-click flows below.

### Netlify

Netlify will publish the project root (configured by `netlify.toml`).

Use this link:

`https://app.netlify.com/start/deploy?repository=https://github.com/raufabdaal/Bongi-Workshop.git&branch=main`

### Vercel

Vercel will serve the project root without running a build (configured by `vercel.json`).

Use this link:

`https://vercel.com/new/clone?repository-url=https://github.com/raufabdaal/Bongi-Workshop.git`

### GitHub Pages

GitHub Pages uses the workflow in `.github/workflows/deploy-gh-pages.yml`.

Once you push to GitHub and open the Actions tab, run `Deploy to GitHub Pages` (or let the `main` push trigger it).

Expected URL (GitHub Pages repo site):

`https://raufabdaal.github.io/Bongi-Workshop/`

