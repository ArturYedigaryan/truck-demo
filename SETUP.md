# Setup

How to get the app running on your machine. For what the app *is* and the design choices behind it, see `README.md`.

---

## 1. Prerequisites

- **Node.js 20+** (includes `npm`). Download from <https://nodejs.org/> — pick LTS.
- **A terminal** (PowerShell, Git Bash, or any Unix shell).
- **A modern browser** (Chrome, Edge, Firefox, Safari).

Verify:

```
node --version
npm --version
```

You do **not** need Docker, a database, a backend server, or any cloud account.

---

## 2. Install

From the project root (the folder containing `package.json`):

```
npm install
```

One-time, or whenever `package.json` changes. Yellow warnings during install are normal.

---

## 3. Run

```
npm start
```

Starts both the Angular dev server and the mock API together via `concurrently`:

| Name | What it is | URL |
|---|---|---|
| **WEB** | Angular app | <http://localhost:4200> |
| **API** | Mock Express backend | <http://localhost:3000> |

Expected output once both are up:

```
[WEB] Local:   http://localhost:4200/
[API] Mock API on http://localhost:3000
[API] Seeded users:
[API]   driver1@truck.local / password
[API]   driver2@truck.local / password
[API]   admin@truck.local / admin
```

Open <http://localhost:4200>.

---

## 4. Seed accounts

| Email | Password |
|---|---|
| `driver1@truck.local` | `password` |
| `driver2@truck.local` | `password` |
| `admin@truck.local` | `admin` |

---

## 5. Using the app

1. **Start shift** — first screen after login. Click *Start shift*.
2. **Dashboard** — top bar shows driver name, the selected truck's registration, and a running timer.
3. **Switch truck** — pencil icon next to the registration; the jobs list refreshes for the new vehicle.
4. **Start a job** — click *Start* on a job card, confirm.
5. **Expand a job** — arrow on the right opens its cargo items.
6. **Collect / Deliver** — per-item action buttons; each step needs confirmation.
7. **Finish shift** — top-right; logs you out.

Every action persists into `mock-api/db.json`. State survives a browser reload.

---

## 6. Stopping

`Ctrl+C` in the terminal where `npm start` is running. Stops both servers.

---

## 7. Resetting data

State lives in `mock-api/db.json`, created from `mock-api/db.seed.json` on first boot.

To wipe:

1. Stop the app.
2. Delete `mock-api/db.json`:
   - PowerShell: `Remove-Item mock-api/db.json`
   - cmd: `del mock-api\db.json`
   - bash: `rm mock-api/db.json`
3. `npm start` — the seed copies over again.

---

## 8. Editing seed data

Edit `mock-api/db.seed.json`, then reset (step 7).

Entity shapes:

```jsonc
// users — accounts that can log in
{
  "driverId": "drv-1",
  "email": "driver1@truck.local",
  "password": "password",
  "name": "Alex Driver",
  "locationId": "loc-1",
  "shiftStart": null,
  "shiftEnd": null
}

// vehicles — trucks available at a location
{
  "vehicleId": "veh-1",
  "registration": "AB12 CDE",
  "locationId": "loc-1"
}

// jobs — transport jobs with nested driver assignments + cargos
{
  "jobId": "job-1",
  "date": "2026-05-22T08:00:00Z",
  "notCollected": 2,
  "collected": 0,
  "delivered": 0,
  "started": false,
  "drivers": [
    { "assignmentId": "asn-1", "driverId": "drv-1", "vehicleId": "veh-1", "status": 0 }
  ],
  "cargos": [
    {
      "cargoId": "crg-1",
      "description": "Steel pipes",
      "quantity": 10,
      "date": "2026-05-22T09:00:00Z",
      "status": 0,
      "from": "Aberdeen Depot",
      "to": "Peterhead Port"
    }
  ]
}
```

Rules:
- A user sees only vehicles whose `locationId` matches theirs.
- A job appears for a user only if `drivers[]` contains a match on **both** their `driverId` and the selected vehicle's `vehicleId`.
- Cargo `status`: `0` = not collected, `1` = collected, `2` = delivered.
- Driver assignment `status`: `0` = not started, `1` = started.

---

## 9. Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies. |
| `npm start` | Run web + mock API together. Normal dev command. |
| `npm run start:web` | Angular dev server only (port 4200). |
| `npm run start:api` | Mock API only (port 3000). |
| `npm run build` | Production bundle into `dist/truck/`. |
| `npm test` | Karma + Jasmine unit tests. |

---

## 10. Troubleshooting

**`EADDRINUSE: address already in use :::3000`** — a leftover process holds port 3000.
- PowerShell: `Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess` → `Stop-Process -Id <PID> -Force`
- Unix: `lsof -i :3000` → `kill -9 <PID>`

**Port 4200 in use** — same idea on 4200.

**Blank page in browser** — check the terminal: both `[WEB]` and `[API]` must be up. If only `[WEB]`, every request fails because the BE isn't running.

**"Invalid credentials" on login** — emails are case-sensitive; passwords are exactly `password` / `admin`. If you edited the seed, delete `db.json` (step 7).

**Browser shows stale data after editing seed** — you only edited the seed (template). Delete `db.json` and restart.

**`npm install` fails** — Node older than 20. Upgrade and retry.

---

## Project layout

```
truck/
├── mock-api/                 Express mock backend
│   ├── server.js             Endpoints, token, business rules
│   ├── db.seed.json          Committed starting data
│   ├── db.json               Gitignored runtime DB
│   └── README.md             BE endpoint reference
│
├── src/app/
│   ├── public/               Login (anonymous routes)
│   ├── private/              Dashboard (authed routes)
│   ├── shared/               Services, guards, interceptors, components, styles
│   └── store/                NgRx (actions / effects / features / states)
│
├── package.json
├── README.md                 What the app is + design choices
└── SETUP.md                  This file
```
