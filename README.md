# Truck

A small demo app showing what a truck-driver shift dashboard might look like.

A driver logs in, starts a shift, picks a truck, sees the transport jobs assigned to that truck, then marks each cargo item as collected and delivered. When the shift is finished, they log out.

The app is fully self-contained — there's nothing to install on a server, no database to set up, and no third-party account to sign up for. A tiny fake backend ships in this repo and runs alongside the app.

This document explains **everything** you need to know to get it running on your machine, even if you've never touched Angular or Node.js before.

---

## 1. What you need on your machine

You need three things:

1. **Node.js**, version 20 or newer.
   It includes `npm`, the package manager we use.
   Download it from <https://nodejs.org/> — pick the **LTS** version, run the installer, accept the defaults.

2. **A terminal** to type commands into.
   - Windows: **PowerShell** (already installed) or **Git Bash** (comes with Git).
   - Mac / Linux: any terminal app.

3. **A modern browser** (Chrome, Edge, Firefox, Safari).

To check that Node.js is installed, open a terminal and type:

```
node --version
npm --version
```

You should see two version numbers, e.g. `v22.15.1` and `10.9.2`. If you see "command not found", restart your terminal after installing Node.

You do **not** need: Docker, a database, a backend server, any cloud account, or any code editor.

---

## 2. Getting the code

If you already have this folder on disk, skip to step 3.

Otherwise, in your terminal:

```
git clone https://github.com/ArturYedigaryan/truck-demo.git
cd truck-demo
```

---

## 3. Installing the project's libraries

Make sure you're in the project folder (the one containing `package.json`), then run:

```
npm install
```

This downloads everything the project needs into a folder called `node_modules/`. It will take a minute or two the first time. You only have to do this once — or again whenever someone changes `package.json`.

You may see some yellow warnings during install; those are normal and safe to ignore.

---

## 4. Starting the app

Still in the project folder, run:

```
npm start
```

Two things start at the same time:

| Name | What it is | URL |
|---|---|---|
| **WEB** | The Angular app — the user interface | <http://localhost:4200> |
| **API** | A fake backend (Express) that serves data | <http://localhost:3000> |

When both have started, you'll see something like this in your terminal:

```
[WEB] Local:   http://localhost:4200/
[API] Mock API on http://localhost:3000
[API] Seeded users:
[API]   driver1@truck.local / password
[API]   driver2@truck.local / password
[API]   admin@truck.local / admin
```

The Angular server takes a few seconds to compile the first time. Subsequent reloads (after you edit a file) are instant.

---

## 5. Opening the app in your browser

Once both servers are up, open <http://localhost:4200> in your browser.

You should see a login screen. Use one of these seeded accounts:

| Email | Password |
|---|---|
| `driver1@truck.local` | `password` |
| `driver2@truck.local` | `password` |
| `admin@truck.local` | `admin` |

---

## 6. Using the app

After you log in:

1. **Start shift screen** — first time only. Click **Start shift** to begin your working day.
2. **Dashboard** — top bar shows your name, the selected truck's registration, and a running timer.
3. **Switch truck** — click the pencil icon next to the registration number to change vehicles. The jobs list updates to show only the jobs assigned to that truck.
4. **Job list** — each card shows the collection date, three cargo counters (not collected / collected / delivered) and a **Start** button.
5. **Start a job** — click **Start**, confirm the dialog. The Start button disappears.
6. **Expand a job** — click the arrow on the right of a card to see the cargo items.
7. **Collect a cargo** — for each item, click **Collect** and confirm. The item moves to "Collected".
8. **Deliver a cargo** — once collected, click **Deliver** and confirm.
9. **Finish shift** — top-right of the page. Confirm, and you'll be logged out and returned to the login screen.

Every action is sent to the fake backend and persisted in `mock-api/db.json`. If you close the browser and come back, your progress is still there.

---

## 7. Stopping the app

In the terminal where `npm start` is running, press **`Ctrl+C`**.

Both the Angular server and the mock API will stop together.

---

## 8. Resetting the data

The fake backend keeps its state in `mock-api/db.json`. That file is created automatically the first time the mock API starts, by copying `mock-api/db.seed.json`. All your changes (shifts started, cargo collected, etc.) are saved into `db.json` — never into the seed file.

To wipe everything and start fresh:

1. Stop the app (`Ctrl+C`).
2. Delete `mock-api/db.json`:
   - Windows (PowerShell): `Remove-Item mock-api/db.json`
   - Windows (cmd): `del mock-api\db.json`
   - Mac / Linux / Git Bash: `rm mock-api/db.json`
3. Run `npm start` again.

The mock API will recreate `db.json` from the seed.

---

## 9. Editing the seed data

If you want different drivers, vehicles, or jobs in the demo, edit `mock-api/db.seed.json`, then reset the data (step 8).

The shape of each entity is:

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

// vehicles — trucks available at each location
{
  "vehicleId": "veh-1",
  "registration": "AB12 CDE",
  "locationId": "loc-1"
}

// jobs — transport jobs with nested drivers + cargos
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

A few rules to keep in mind:

- A user only sees vehicles whose `locationId` matches their own.
- A job shows up for a user only if one of its `drivers` matches both the user's `driverId` **and** the selected vehicle's `vehicleId`.
- Cargo `status`: `0` = not collected, `1` = collected, `2` = delivered.
- Driver assignment `status`: `0` = not started, `1` = started.

---

## 10. Common problems

**`EADDRINUSE: address already in use :::3000`**
Something else (often a leftover `node` process from a previous run) is using port 3000.

Find and stop it:

- Windows (PowerShell):
  ```
  Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
  Stop-Process -Id <the-PID> -Force
  ```
- Mac / Linux:
  ```
  lsof -i :3000
  kill -9 <PID>
  ```

Then run `npm start` again.

**Port 4200 in use**
Same idea but with port 4200.

**Blank page in browser**
Check the terminal: both `[WEB]` and `[API]` lines must appear. If only `[WEB]` is up, the UI loads but every request fails because the fake backend isn't running.

**"Invalid credentials" on login**
Emails are case-sensitive. The passwords are exactly `password` (for drivers) and `admin` (for admin). If you changed `db.seed.json` and want those changes to apply, you also have to delete `db.json` (see step 8).

**Browser still shows old data after editing the seed**
You only edited the seed (template). Delete `mock-api/db.json` and restart.

**`npm install` fails**
You probably have a Node version older than 20. Check with `node --version` and upgrade.

---

## 11. Project layout

```
truck/
├── mock-api/                 The fake backend
│   ├── server.js             Express app: handles login + all data endpoints
│   ├── db.seed.json          Starting data (committed to git)
│   ├── db.json               Live data (created at runtime, gitignored)
│   └── README.md             Endpoint reference for developers
│
├── src/
│   └── app/
│       ├── public/           Pages anyone can visit (login)
│       ├── private/          Pages that need a logged-in user (dashboard)
│       ├── shared/           Reusable bits: services, guards, components
│       └── store/            App state (using NgRx)
│
├── package.json              Scripts and dependency list
└── README.md                 This file
```

---

## 12. Tech stack

| Layer | Tools |
|---|---|
| UI | Angular 20.2, TypeScript 5.9 |
| State | NgRx 20 (store + effects), ngrx-immer |
| Components | PrimeNG 20 (`@primeuix/themes`) |
| Backend (fake) | Express 4 |
| Dev runner | `concurrently` (runs both servers in one terminal) |

---

## 13. All available commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies. Run this once after cloning, or when `package.json` changes. |
| `npm start` | Start both the Angular dev server and the mock API together. **This is the normal command for development.** |
| `npm run start:web` | Start only the Angular dev server (port 4200). Useful if the mock API is already running. |
| `npm run start:api` | Start only the mock API (port 3000). |
| `npm run build` | Build a production bundle into `dist/truck/`. |
| `npm test` | Run unit tests (karma + jasmine). |

---

That's all. If you got this far, you're up and running. Have fun.
