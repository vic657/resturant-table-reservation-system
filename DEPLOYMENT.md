# Render + Railway
The existing Laravel API and React application remain in this repository. Docker now builds the React source rather than serving the old checked-in bundle.

## Deploy
1. Keep your existing Render service connected to this repository and deploy the updated commit using the Docker runtime.
2. In Render's Environment settings, keep your Railway public connection values: DB_CONNECTION=mysql, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD. Do not put these credentials in Git.
3. Set APP_ENV=production, APP_DEBUG=false, APP_URL to your Render HTTPS URL, CACHE_STORE=file, SESSION_DRIVER=file, SESSION_SECURE_COOKIE=true, QUEUE_CONNECTION=sync.
4. Set APP_KEY in Render. The previous key was committed to render.yaml: generate a replacement with php artisan key:generate --show, and put it directly into Render. Changing the key invalidates encrypted cookies/data; this app's password hashes are unaffected. Do not commit the generated key.
5. The Docker frontend defaults to /api on the same Render host. If you also deploy the frontend to Netlify, use frontend as the base directory, npm run build, dist as the publish directory, and VITE_API_BASE_URL=https://YOUR-RENDER-HOST/api.
6. No database migrations are introduced by this UI/auth update. Startup does not run migrations by default. Only set RUN_MIGRATIONS=true for a deployment where you intend to apply pending migrations, then reset it to false.
7. Render's service health check uses /up. Open /health manually to check both Laravel and Railway: it returns 200 with status ok or 503 with status unavailable.

## Keep awake
A process inside a sleeping Render service cannot wake itself. The external GitHub Actions workflow in .github/workflows/keep-awake.yml requests /health every five minutes; that endpoint runs SELECT 1 against Railway and does not change data.

After pushing this file to the GitHub repository's default branch:
- Enable Actions for the repository.
- Set the repository Actions variable APP_HEALTH_URL to your deployed HTTPS /health URL. The default is the Render hostname already used in this project's CORS configuration; verify it is still your active service.
- Open Actions → Check app and database → Run workflow and confirm the request succeeds.
- Alternatively, use an external HTTP monitor requesting the same /health URL every five minutes.

The workflow is prepared locally, not activated on GitHub from this checkout. GitHub can delay scheduled runs and disables public-repository schedules after 60 days without repository activity. Render sleeps after 15 idle minutes and has monthly free usage limits. Railway staying awake consumes usage/credits. Pings do not guarantee continuous uptime or prevent a service stopping when its quota is exhausted.

Provider references:
- https://render.com/docs/free
- https://docs.railway.com/deployments/serverless
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows

## Local checks
- Backend: php artisan test (uses the in-memory SQLite database configured in phpunit.xml).
- Frontend: cd frontend, npm ci, npm run build.
- Local frontend: npm run dev -- --host 127.0.0.1. Vite proxies /api to Laravel at 127.0.0.1:8000.
- Local API: php artisan serve --host=127.0.0.1 --port=8000.
- Use an isolated local database for functional testing, never the production Railway database.

## Auth changes
Staff APIs require Sanctum tokens and server-side roles. Staff cannot create/delete accounts unless they are an admin. Waiters can read only their own assigned orders and mark only their assigned orders served. Login is limited to five attempts per minute per IP; tokens expire after 24 hours. Logout revokes the current token. The frontend also guards staff routes and handles expired authentication.

Accountant and security workspaces remain placeholders, now clearly labelled. This update does not implement reporting, payments, or guest check-in.

## Verification notes
The backend regression suite passes: 11 tests, 59 assertions. Laravel route caching succeeds. Local PHP 8.5 reports four pre-existing database-constant deprecations (Render uses PHP 8.2). The frontend production build passes. Visual verification was unavailable because both browser connections failed, and the Docker image was not run locally.

Compatible dependency security updates were applied without forced major upgrades. npm still reports 10 advisories (nine moderate, one high) in the tooling dependency tree, including glob/minimatch/brace-expansion. Resolving the remaining tree needs a separate dependency review; do not run npm audit fix --force blindly because its suggested Capacitor downgrade is breaking. Native Android/iOS builds were not tested.
