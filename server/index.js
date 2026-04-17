import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';

/* ── Admin password ──────────────────────────────────────────────
   In production ADMIN_PASSWORD_HASH (scrypt) must be set. A helper
   script (`npm run hash:password`) is provided to generate one.
   In dev we fall back to ADMIN_PASSWORD plaintext for convenience. */
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

if (IS_PROD && !ADMIN_PASSWORD_HASH && !ADMIN_PASSWORD) {
  console.error('FATAL: ADMIN_PASSWORD_HASH (or ADMIN_PASSWORD) must be set in production.');
  process.exit(1);
}
if (!IS_PROD && !ADMIN_PASSWORD_HASH && !ADMIN_PASSWORD) {
  console.warn('⚠  No ADMIN_PASSWORD set — admin panel login will reject all attempts. Copy .env.example to .env and set one.');
}

/* ── CORS: restrict in production ────────────────────────────── */
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3001')
  .split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (!IS_PROD) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '64kb' }));

/* ── Security headers (helmet-lite, no dep) ──────────────────── */
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.setHeader('X-XSS-Protection', '0');
  if (IS_PROD) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ')
    );
  }
  next();
});

/* ── Rate limiter (in-memory, sliding window) ────────────────── */
function rateLimit({ windowMs, max, key = req => req.ip }) {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [k, list] of hits) {
      const kept = list.filter(t => now - t < windowMs);
      if (kept.length) hits.set(k, kept); else hits.delete(k);
    }
  }, windowMs).unref?.();
  return (req, res, next) => {
    const k = key(req);
    const now = Date.now();
    const list = (hits.get(k) || []).filter(t => now - t < windowMs);
    if (list.length >= max) {
      const retry = Math.ceil((windowMs - (now - list[0])) / 1000);
      res.setHeader('Retry-After', retry);
      return res.status(429).json({ error: 'Too many requests. Try again later.' });
    }
    list.push(now);
    hits.set(k, list);
    next();
  };
}

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const writeLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
const formLimiter = rateLimit({ windowMs: 60 * 1000, max: 5 });

/* ── Data store ──────────────────────────────────────────────── */
const DATA_FILE = path.join(__dirname, 'data', 'site-content.json');
await fs.mkdir(path.join(__dirname, 'data'), { recursive: true }).catch(() => {});

const DEFAULT_CONTENT = {
  seo: {
    title: 'Woo Tong | Digital Design Agency',
    description: 'We craft premium digital experiences that elevate brands and transform businesses.',
    ogUrl: 'https://wootong.com',
    ogType: 'website',
    keywords: 'design, digital agency, branding, web development, AI, UX',
  },
  nav: { brandName: 'WOO TONG', ctaText: "LET'S TALK" },
  hero: {
    line1: "I've created visual storytelling",
    line2: 'and interactive experiences',
    line3: 'that help',
    phrases: ['elevate brands', 'design futures', 'build products', 'create impact'],
  },
  clients: ['Finova', 'Luxe Retail', 'DataFlow', 'MedTech', 'TechVentures', 'NovaCorp', 'Altair', 'Meridian'],
  caseStudies: [
    { id: 'cs1', title: 'Redefining Digital Banking', client: 'Finova', category: 'Digital Products', year: '2024', colorFrom: '#4a7c9b', colorTo: '#6b9dc4' },
    { id: 'cs2', title: 'E-commerce Reimagined', client: 'Luxe Retail', category: 'Platforms', year: '2024', colorFrom: '#6b9dc4', colorTo: '#b5c6e0' },
    { id: 'cs3', title: 'AI-Powered Analytics', client: 'DataFlow', category: 'Applied AI', year: '2023', colorFrom: '#b5c6e0', colorTo: '#4a7c9b' },
    { id: 'cs4', title: 'Healthcare Innovation', client: 'MedTech', category: 'Digital Products', year: '2023', colorFrom: '#4a7c9b', colorTo: '#b5c6e0' },
  ],
  services: [
    { n: '01', title: 'Brand & Identity', desc: 'Distinctive identities that resonate and endure.' },
    { n: '02', title: 'Digital Products', desc: 'End-to-end design and development users love.' },
    { n: '03', title: 'Web Development', desc: 'Custom platforms built for performance and scale.' },
    { n: '04', title: 'Applied AI', desc: 'Intelligent solutions for personalized experiences.' },
  ],
  testimonial: {
    quote: 'Working with Woo Tong transformed our digital presence. Their attention to detail and strategic thinking delivered results beyond expectations.',
    name: 'Sarah Chen',
    role: 'CEO, TechVentures',
  },
  about: {
    heading: 'We believe in the power of thoughtful design',
    description: "Founded with a passion for exceptional digital experiences, we've grown into a team of designers, developers, and strategists who share a common goal: creating work that matters.",
    stats: [
      { value: '5+', label: 'Projects Delivered' },
      { value: '100%', label: 'Client Retention' },
    ],
  },
  contact: {
    heading: 'Ready to start your project?',
    description: "Let's discuss how we can help achieve your goals.",
    email: 'hello@wootong.com',
    buttonText: "LET'S TALK",
  },
  footer: {
    tagline: 'Crafting premium digital experiences that elevate brands.',
    companyLinks: [
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Work', href: '#work' },
    ],
    socialLinks: [
      { label: 'Twitter', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Dribbble', href: '#' },
    ],
  },
};

async function loadContent() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2));
    return DEFAULT_CONTENT;
  }
}

async function saveContentToDisk(content) {
  const tmp = DATA_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(content, null, 2));
  await fs.rename(tmp, DATA_FILE);
  return content;
}

/* ── Content validation ──────────────────────────────────────── */
function isPlainObject(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }

function validateContentShape(c) {
  if (!isPlainObject(c)) return 'Content must be an object';
  const required = ['seo', 'nav', 'hero', 'clients', 'caseStudies', 'services', 'testimonial', 'about', 'contact', 'footer'];
  for (const k of required) if (!(k in c)) return `Missing field: ${k}`;
  if (!Array.isArray(c.clients)) return 'clients must be an array';
  if (!Array.isArray(c.caseStudies)) return 'caseStudies must be an array';
  if (!Array.isArray(c.services)) return 'services must be an array';
  const size = Buffer.byteLength(JSON.stringify(c), 'utf8');
  if (size > 50_000) return 'Content too large (max 50KB)';
  return null;
}

/* ── Sessions (in-memory, with TTL + cleanup) ────────────────── */
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h
const sessions = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [t, s] of sessions) if (s.expires < now) sessions.delete(t);
}, 60_000).unref?.();

function createSession() {
  const token = crypto.randomBytes(32).toString('base64url');
  sessions.set(token, { expires: Date.now() + SESSION_TTL_MS });
  return token;
}

function verifySession(token) {
  if (!token) return false;
  const s = sessions.get(token);
  if (!s) return false;
  if (s.expires < Date.now()) { sessions.delete(token); return false; }
  return true;
}

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer /i, '');
  if (!verifySession(token)) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

/* ── Password verification (timing-safe) ─────────────────────── */
function verifyPassword(candidate) {
  if (typeof candidate !== 'string' || candidate.length === 0 || candidate.length > 256) return false;
  if (ADMIN_PASSWORD_HASH) {
    // Format: scrypt$<saltHex>$<hashHex>
    const parts = ADMIN_PASSWORD_HASH.split('$');
    if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
    const salt = Buffer.from(parts[1], 'hex');
    const expected = Buffer.from(parts[2], 'hex');
    let actual;
    try { actual = crypto.scryptSync(candidate, salt, expected.length); }
    catch { return false; }
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  }
  if (ADMIN_PASSWORD) {
    const a = Buffer.from(candidate);
    const b = Buffer.from(ADMIN_PASSWORD);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }
  return false;
}

/* ── Input validators ────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isStr = (v, min = 1, max = 5000) => typeof v === 'string' && v.trim().length >= min && v.length <= max;

/* ═══════════ API Routes ═══════════ */

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/content', async (req, res) => {
  try {
    const content = await loadContent();
    res.json(content);
  } catch {
    res.status(500).json({ error: 'Failed to load content' });
  }
});

app.put('/api/content', requireAuth, writeLimiter, async (req, res) => {
  try {
    const err = validateContentShape(req.body);
    if (err) return res.status(400).json({ error: err });
    const saved = await saveContentToDisk(req.body);
    res.json(saved);
  } catch {
    res.status(500).json({ error: 'Failed to save content' });
  }
});

app.post('/api/auth/login', authLimiter, (req, res) => {
  try {
    const { password } = req.body || {};
    if (!verifyPassword(password)) {
      // Uniform response time to blunt timing leaks
      return setTimeout(() => res.status(401).json({ error: 'Invalid password' }), 150);
    }
    const token = createSession();
    res.json({ token, expiresIn: SESSION_TTL_MS });
  } catch {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({ valid: true });
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer /i, '');
  if (token) sessions.delete(token);
  res.json({ success: true });
});

app.post('/api/contact', formLimiter, (req, res) => {
  const { name, email, message } = req.body || {};
  if (!isStr(name, 1, 100)) return res.status(400).json({ error: 'Invalid name' });
  if (!isStr(email, 3, 254) || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (!isStr(message, 1, 4000)) return res.status(400).json({ error: 'Invalid message' });
  console.log('[contact]', { name, email, length: message.length });
  res.json({ success: true, message: 'Thank you for your message!' });
});

app.post('/api/newsletter', formLimiter, (req, res) => {
  const { email } = req.body || {};
  if (!isStr(email, 3, 254) || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email' });
  console.log('[newsletter]', { email });
  res.json({ success: true, message: 'Successfully subscribed!' });
});

/* ── Static file serving in production ───────────────────────── */
if (IS_PROD) {
  app.use(express.static(path.join(__dirname, '../dist'), {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    },
  }));
  // SPA fallback: any non-API GET serves index.html
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} (${NODE_ENV})`);
});
