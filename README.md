# Truck

A single-role driver shift dashboard: log in, start a shift, pick a truck, work through the assigned transport jobs (collect + deliver cargo per item), finish the shift.

Stack: Angular 20 · NgRx 20 (+ ngrx-immer) · PrimeNG 20 · Express 4 mock backend with a JSON file store. Single repo, single `npm start`.

---

## 1. Domain & Scope

**Domain.** A truck driver's shift: one driver, one assigned vehicle at a time, a list of jobs filtered by the (driver, vehicle) pair, and a per-cargo-item state machine (`not collected → collected → delivered`).

**Why this domain.** It's small enough to fit in one screen for one role, but it forces real decisions: a non-trivial filtering rule (`driverId` AND `vehicleId`), a per-row mutation flow that has to round-trip to a backend, two cross-cutting auth states (logged-in vs shift-active), and a shape where the UI list has to refresh after every mutation. That's enough surface to make the architectural choices matter.

**In scope:**
- Login + session restore from `localStorage`
- Shift lifecycle (start / finish)
- Vehicle switcher (per-driver)
- Per-cargo mutation flow with optimistic-feeling UX (action → effect → reload)
- Self-contained mock backend with seed/runtime DB split

**Out of scope (deliberate):**
- Multi-role UI (admin exists in the seed, no separate screen)
- Real auth (token is unsigned)
- Tests beyond Karma scaffold
- Offline / service worker
- i18n, theming switch, accessibility audit

---

## 2. Architecture

Two route trees lazy-loaded behind guards (`authGuard` for `private/`, `notAuthGuard` for `public/`). All state in NgRx feature slices (`auth`, `user`, `truck`). All HTTP goes through a 3-link functional interceptor chain. Mock BE runs in the same `npm start` via `concurrently`.

**Decisions made (and what was rejected):**

1. **Standalone components + functional providers**, no `NgModule`. Rejected NgModules — they add ceremony with zero payoff at this size and standalone is the Angular 20 default direction.
2. **NgRx feature state (`createFeature` + `ngrx-immer`)** per slice. Rejected Signals + plain services: the truck slice has a cross-effect flow (vehicles loaded → auto-select first → trigger jobs load → mutations trigger re-load) that's cleaner as a graph of effects than as imperative service calls. Rejected hand-rolled spread-based reducers: the truck state is nested enough that `immerOn` is shorter and harder to corrupt.
3. **Functional effects with `inject()`** (`{ functional: true }`). Rejected class-based effects — no DI win at this size, more boilerplate.
4. **Three-link interceptor chain** (`loader → apiRequest → auth`). Each does one thing: loader counts in-flight requests, apiRequest prepends the base URL, auth attaches `Authorization`. Rejected a single mega-interceptor and rejected per-service header logic.
5. **Two route trees behind guards instead of one tree with per-route guards.** Both register at `path: ''`. The guard picks which tree resolves. Rejected a flat route file: this keeps `public/` and `private/` cleanly partitioned and lazy-loaded independently.
6. **Mock Express + JSON file**, not `json-server`. Domain rules live on the BE (composite-key job filter, shift state, cargo status transitions). `json-server` is too generic to express those.
7. **Token: base64-encoded JSON with `exp`, no signature.** Rejected JWT-with-signature: a local mock has no verifying authority — the signature would be decoration. Kept `exp` because it's the only field the FE actually consults.
8. **`db.seed.json` (committed) vs `db.json` (gitignored runtime).** Rejected committing the live DB. Reviewers cloning the repo always get the same starting state; iteration doesn't pollute git.
9. **Custom PrimeNG preset (`MyPreset`)** instead of default theme. Tokens, spacing, and accent colors live in one place (`src/app/shared/styles/`).

**If this grew 10x.** Split `libs/` for state and shared UI (the truck slice would stop being the only consumer), replace the unsigned token with a real auth provider, push the (driver, vehicle, job, cargo) state-machine rules to a typed reducer-helper instead of leaving them implicit in effects, and add real tests.

---

## 3. Trade-offs and Cuts

**Not done, on purpose:**
- No unit / e2e tests beyond Karma scaffolding — coverage % is explicitly not the bar here.
- No `/auth/refresh` flow — the token lives 30 days, that's the refresh strategy.
- No optimistic UI — every mutation waits for the round-trip. The mock is local, so latency isn't a UX problem worth solving here.

**+1 day:** add a change-password page (the `ChangePassword` interface is already stubbed at `shared/interfaces/auth/change-password.interface.ts`), a couple of meaningful unit tests on the cross-effect flow (`loadVehiclesByDriverSuccess → vehicleSelected → loadTransportJobs`), and tighten the cargo-status transitions on the BE so invalid jumps return 409.

**+1 week:** swap the mock BE for a real one behind the same FE contract (the interceptor + service layer is already shaped for it), pull the truck slice into a `libs/state/truck` lib, and build out the admin side — an admin panel with cargo creation, a drivers tracking list, and a driver sign-up flow.

---

## 4. AI Usage

**Tool:** Claude Code.

**Posture:** AI was used as a productive assistant, not as the architect. It accelerated the work on layers where the decisions were already made; design, data shape, and state-machine work stayed hand-driven.

**Built with AI:**
- **BE-side logic** — `mock-api/server.js`: endpoints, token issuance, seed/runtime DB split, and the shift / job / cargo transition rules.
- **App styles** — the SCSS under `src/app/shared/styles/` plus the custom PrimeNG `MyPreset`: theme tokens, form / element / dialog / accordion overrides.
- **CSS folder structure** — the `_variables / _mixins / _reset / _forms / _elements` partitioning under `shared/styles/`.

**Driven by hand:** NgRx slices (actions / effects / reducers / states), routing + guards, the interceptor chain, services, dashboard component composition, the (driver, vehicle, job, cargo) data shape and rules.

**Why this split.** AI handled the layers with no novel decisions — file-backed CRUD, theme tokens, SCSS scaffolding. Human time went into the FE state machine and component composition, where the architectural choices actually matter.

---

## 5. What to Look At First

If you have 10 minutes:

1. **`src/app/app.config.ts`** — one screen, shows the whole shape: standalone bootstrap, three feature slices via `provideState`, strict NgRx runtime checks, the interceptor chain, the app initializer hook, the custom PrimeNG preset.
2. **`src/app/store/effects/truck.effects.ts`** — the only file where the application logic actually lives. Notice the cross-effect chain (`loadVehiclesByDriverSuccess → vehicleSelected → loadTransportJobs`) and the post-mutation reload pattern (`startJobSuccess | confirmCollectionSuccess | confirmDeliverySuccess → loadTransportJobs`). Everything else is wiring.
3. **`mock-api/server.js`** + **`mock-api/db.seed.json`** — the BE contract and the composite-key filter rule. Reading these makes the FE's vehicle-switcher behavior make sense.

---

## Running

```
npm install
npm start
```

Then open <http://localhost:4200>. Seed accounts: `driver1@truck.local` / `password` (also `driver2@truck.local`, `admin@truck.local` / `admin`).

To reset state: stop the app, delete `mock-api/db.json`, start again.
