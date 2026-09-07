# t4-portfolio

Personal portfolio site. Plain HTML, CSS and JavaScript, no build step.

Live at <https://timohm.github.io/t4-portfolio/>.

## Layout

Everything that gets published lives in `site/`. That directory is the
deploy root, so `README.md` and `LICENSE` are not served.

## Running it locally

Open `site/index.html` directly, or serve it if you need correct
relative paths:

    python3 -m http.server -d site 8000

Then visit <http://localhost:8000>.

## Deploying

Pushing to `main` triggers `.github/workflows/pages.yml`, which uploads
`site/` and publishes it to GitHub Pages. Day to day work happens on
`dev` and gets merged into `main`.

Note that this is a project page rather than a user page, so the site is
served from `/t4-portfolio/` and not the domain root. Keep asset paths
relative or they will 404.

## License

MIT, see [LICENSE](LICENSE).
