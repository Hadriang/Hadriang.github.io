# GitHub Pages Deployment

This site is ready to deploy with GitHub Pages using the workflow in `.github/workflows/deploy.yml`.

## Recommended Setup

1. Push this project to a GitHub repository.
2. On GitHub, open the repository and go to `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to `main` or `master`, or run the `Deploy to GitHub Pages` workflow manually from the `Actions` tab.

## Base Path

This repo is intended for `https://github.com/Hadriang/Hadriang.github.io`, so the published site URL is `https://hadriang.github.io/`.

The workflow defaults `VITE_BASE_PATH` to `/`, which is correct for a user/organization Pages site such as `https://USERNAME.github.io/`.

If deploying as a project site at `https://USERNAME.github.io/REPO/`, add a repository variable:

- Name: `VITE_BASE_PATH`
- Value: `/REPO/`

The app strips that base path internally, so routes like `/REPO/privacy` and `/REPO/cs2/mouse` still work.

## Direct Links

GitHub Pages does not do server-side SPA rewrites. The `public/404.html` file redirects direct route hits back into the app using `gh_route`, so URLs like `/privacy`, `/cs2/mouse`, `/REPO/privacy`, and `/REPO/cs2/mouse` recover instead of showing GitHub's default 404 page.
