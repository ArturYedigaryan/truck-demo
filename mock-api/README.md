# Mock API

Local Express server backing the Truck demo app. No external services required.

## Run

```
npm run start:api      # just the mock API
npm start              # mock API + Angular dev server (concurrently)
```

Port: `3000`. CORS allowed for `http://localhost:4200`.

## Seed credentials

| Email | Password |
|---|---|
| `driver1@truck.local` | `password` |
| `driver2@truck.local` | `password` |
| `admin@truck.local` | `admin` |

## Data files

- `db.seed.json` — committed source-of-truth seed. **Edit this if you want different starting data.**
- `db.json` — gitignored runtime database. Copied from `db.seed.json` on first boot. All mutations write here.

To reset to seed:

```
del mock-api/db.json     # Windows
rm mock-api/db.json      # Unix
```

Then restart `npm run start:api`.

## Token

Base64-encoded JSON: `{ sub: driverId, email, iat, exp }`. No signature. 30-day TTL. Stored client-side in `localStorage.access_token`.

## Endpoints

### Auth

| Method | Path | Notes |
|---|---|---|
| POST | `/auth/login` | `{email, password}` → `{token, user}` |
| GET | `/auth/me` | Returns the authenticated user |
| POST | `/auth/logout` | 204 |

### Domain (all require `Authorization: Bearer <token>`)

| Method | Path |
|---|---|
| GET | `/api/driver/current-driver` |
| PUT | `/api/drivershifts` (body: `0` start, `1` finish) |
| GET | `/api/transportJob/byDriverAndVehicle/:driverId/:vehicleId` |
| GET | `/api/vehicle/byDriver/:driverId?truckVehicleId=...` |
| PUT | `/api/transportJobDriver/status/:jobId/:driverPk` |
| PUT | `/api/transportJobCargo/collect/:cargoId` |
| PUT | `/api/transportJobCargo/deliver/:jobId/:cargoId` |
