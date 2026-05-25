/* Mock backend for the Truck demo app.
 * Pure Express. No json-server, no Auth0, no SignalR.
 * - On boot: copies db.seed.json -> db.json if db.json is missing.
 * - Mutations: in-memory + debounced fs.writeFileSync to db.json.
 * - Auth: base64 token, no signature. 30-day TTL.
 *
 * DB schema (db.seed.json):
 *   users[]    : { driverId, email, password, name, locationId, shiftStart, shiftEnd }
 *   vehicles[] : { vehicleId, registration, locationId }
 *   jobs[]     : { jobId, date, notCollected, collected, delivered, started,
 *                  drivers: [{ assignmentId, driverId, vehicleId, status }],
 *                  cargos:  [{ cargoId, description, quantity, date, status, from, to }] }
 *
 * Server responses strip internal-only fields:
 *   user response  : { driverId, name, shiftStart, shiftEnd }   (no email/password/locationId)
 *   vehicle item   : { vehicleId, registration }                (no locationId)
 *   job.drivers[]  : { assignmentId, status }                   (no driverId/vehicleId)
 *   job.cargos[]   : unchanged (all fields are FE-relevant)
 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, 'db.seed.json');
const DB_PATH = path.join(__dirname, 'db.json');
const PORT = 3000;
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

if (!fs.existsSync(DB_PATH)) {
  fs.copyFileSync(SEED_PATH, DB_PATH);
}
let db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

let writeTimer = null;
const persist = () => {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  }, 200);
};

const encode = (payload) => Buffer.from(JSON.stringify(payload)).toString('base64');
const decode = (token) => {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
  } catch {
    return null;
  }
};

const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  const payload = decode(token);
  if (!payload || !payload.exp || payload.exp < Date.now()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = db.users.find((u) => u.driverId === payload.sub);
  if (!user) return res.status(401).json({ error: 'Unknown user' });
  req.user = user;
  next();
};

const publicUser = (u) => ({
  driverId: u.driverId,
  name: u.name,
  shiftStart: u.shiftStart,
  shiftEnd: u.shiftEnd,
});

const publicVehicle = (v) => ({ vehicleId: v.vehicleId, registration: v.registration });

const publicJob = (j) => ({
  jobId: j.jobId,
  date: j.date,
  notCollected: j.notCollected,
  collected: j.collected,
  delivered: j.delivered,
  started: j.started,
  drivers: j.drivers.map((d) => ({ assignmentId: d.assignmentId, status: d.status })),
  cargos: j.cargos.map((c) => ({ ...c })),
});

const app = express();
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json({ limit: '1mb', strict: false }));

app.use((req, _res, next) => {
  console.log(`[mock] ${req.method} ${req.url}`);
  next();
});

// =========================================================================
// Auth
// =========================================================================

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  const user = db.users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password,
  );
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const now = Date.now();
  const token = encode({ sub: user.driverId, iat: now, exp: now + TOKEN_TTL_MS });
  res.json({ token, user: publicUser(user) });
});

app.get('/auth/me', requireAuth, (req, res) => {
  res.json(publicUser(req.user));
});

app.post('/auth/logout', (_req, res) => {
  res.status(204).end();
});

// =========================================================================
// Driver
// =========================================================================

app.get('/api/driver/current-driver', requireAuth, (req, res) => {
  res.json(publicUser(req.user));
});

// =========================================================================
// Driver shifts (PUT body is a raw number: 0 = start, 1 = finish)
// =========================================================================

app.put('/api/drivershifts', requireAuth, (req, res) => {
  const status = req.body;
  const now = new Date().toISOString();
  if (status === 0) {
    req.user.shiftStart = now;
    req.user.shiftEnd = null;
  } else if (status === 1) {
    req.user.shiftStart = null;
    req.user.shiftEnd = now;
  } else {
    return res.status(400).json({ error: 'status must be 0 (start) or 1 (finish)' });
  }
  persist();
  res.json(true);
});

// =========================================================================
// Transport jobs
// =========================================================================

app.get('/api/transportJob/byDriverAndVehicle/:driverId/:vehicleId', requireAuth, (req, res) => {
  const { driverId, vehicleId } = req.params;
  const matched = db.jobs.filter((j) =>
    j.drivers.some((d) => d.driverId === driverId && d.vehicleId === vehicleId),
  );
  res.json(matched.map(publicJob));
});

// =========================================================================
// Vehicles
// =========================================================================

app.get('/api/vehicle/byDriver/:driverId', requireAuth, (req, res) => {
  const driver = db.users.find((u) => u.driverId === req.params.driverId);
  if (!driver) return res.json([]);
  const vehicles = db.vehicles.filter((v) => v.locationId === driver.locationId);
  res.json(vehicles.map(publicVehicle));
});

// =========================================================================
// Transport job driver status
// =========================================================================

app.put('/api/transportJobDriver/status/:jobId/:assignmentId', requireAuth, (req, res) => {
  const { jobId, assignmentId } = req.params;
  const newStatus = Number(req.body);
  const job = db.jobs.find((j) => j.jobId === jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  const assignment = job.drivers.find((d) => d.assignmentId === assignmentId);
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  assignment.status = newStatus;
  job.started = true;
  persist();
  res.status(200).end();
});

// =========================================================================
// Cargo collect / deliver
// =========================================================================

app.put('/api/transportJobCargo/collect/:cargoId', requireAuth, (req, res) => {
  const { cargoId } = req.params;
  for (const job of db.jobs) {
    const cargo = job.cargos.find((c) => c.cargoId === cargoId);
    if (cargo) {
      cargo.status = 1;
      job.collected = (job.collected || 0) + 1;
      job.notCollected = Math.max(0, (job.notCollected || 0) - 1);
      persist();
      return res.status(200).end();
    }
  }
  res.status(404).json({ error: 'Cargo not found' });
});

app.put('/api/transportJobCargo/deliver/:jobId/:cargoId', requireAuth, (req, res) => {
  const { jobId, cargoId } = req.params;
  const job = db.jobs.find((j) => j.jobId === jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  const cargo = job.cargos.find((c) => c.cargoId === cargoId);
  if (!cargo) return res.status(404).json({ error: 'Cargo not found' });
  cargo.status = 2;
  job.delivered = (job.delivered || 0) + 1;
  persist();
  res.status(200).end();
});

// =========================================================================
// Catch-all
// =========================================================================

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', method: req.method, url: req.url });
});

app.listen(PORT, () => {
  console.log(`Mock API on http://localhost:${PORT}`);
  console.log('Seeded users:');
  for (const u of db.users) console.log(`  ${u.email} / ${u.password}`);
});
