# GitHub Copilot / AI Agent Instructions for gym-frontend

This file gives actionable, project-specific guidance so an AI coding agent can be productive quickly.

**Project overview**
- **Type:** React single-page app using Vite (see `package.json` scripts: `dev`, `build`, `preview`).
- **Routing:** App routes are declared in `src/main.jsx` using `react-router-dom` (v7).
- **Pages/components:** Top-level views live in `src/pages/` and shared UI lives in `src/components/` (see `Navigation.jsx`, `UI/`, `components.css`).
- **Backend / Auth:** Uses Supabase. Client is created in `src/lib/supabaseClient.js`; auth helper functions are in `src/lib/auth.js`.

**Key files to inspect first**
- `src/main.jsx` — mounting point and route map (quick way to understand app flows).
- `src/lib/supabaseClient.js` — reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from env; all DB/auth calls go through `supabase`.
- `src/lib/auth.js` — signUp/login/reset/logout helpers; note `sendPasswordResetEmail` uses `redirectTo: 'http://localhost:3000/reset-password'` (verify environment/ports when testing).
- `src/pages/` — individual screens (Login, SignUp, Questionnaire, Agent, Demo, etc.).
- `src/components/BackendFunction/` — local editing helpers (`EditTableField.jsx`, `LocalEditField.jsx`) illustrate patterns for inline edits and optimistic UI.

**Environment & run commands**
- Local dev: `npm run dev` (Vite dev server, default port 5173).
- Build: `npm run build`.
- Preview production build: `npm run preview`.
- Lint: `npm run lint` (ESLint configured via `eslint.config.js`).
- Required env vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (used in `src/lib/supabaseClient.js`).

**Project-specific conventions & patterns**
- Routing-first structure: most feature discovery is done by reading `src/main.jsx` and the component referenced there.
- Supabase as single integration point: avoid creating alternate API clients; put new backend helpers under `src/lib/`.
- Inline-edit pattern: use components in `src/components/BackendFunction/` as examples for controlled inputs and local state updates before persisting to Supabase.
- Styling: app uses plain CSS files colocated with components (`App.css`, `page.css`, `components/components.css`). Keep CSS simple and colocated unless adding a new global utility.

**Common tasks & quick examples**
- Add a new route: register the route in `src/main.jsx` and create the corresponding file in `src/pages/`.
- Call Supabase: import `supabase` from `src/lib/supabaseClient.js` and follow patterns in `src/lib/auth.js` for error handling and return shapes.
- Password reset nuance: `sendPasswordResetEmail` redirects to `http://localhost:3000/reset-password` — update this URL to match dev (`5173`) or production as appropriate.

**Testing & debugging notes**
- There are no unit tests in the repo by default. Use the Vite dev server and browser devtools for component-level debugging.
- When debugging auth flows, confirm environment variables and the `redirectTo` URLs in `src/lib/auth.js` to avoid mismatched origins.

**ESLint & formatting**
- ESLint is configured (`eslint.config.js`) and can be run via `npm run lint`. Follow existing code patterns (functional components, hooks) and `eslint-plugin-react-hooks` rules.

**When to ask the repo owner**
- What is the intended production URL (so we can align `redirectTo` in password reset)?
- Any CI, deploy, or secret management conventions (where to store `VITE_SUPABASE_*` for preview/prod)?

If anything above is incomplete or you want the agent to follow stricter conventions (tests, commit message format, branch strategy), tell me and I'll merge that into this file.
