import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'site-content.json');

// Ensure data directory exists
await fs.mkdir(path.join(__dirname, 'data'), { recursive: true }).catch(() => {});

// Default content
const DEFAULT_CONTENT = {
  seo: {
    title: "Woo Tong | Digital Design Agency",
    description: "We craft premium digital experiences that elevate brands and transform businesses.",
    ogUrl: "https://wootong.com",
    ogType: "website",
    keywords: "design, digital agency, branding, web development, AI, UX",
  },
  nav: { brandName: "WOO TONG", ctaText: "LET'S TALK" },
  hero: {
    line1: "I've created visual storytelling",
    line2: "and interactive experiences",
    line3: "that help",
    phrases: ["elevate brands", "design futures", "build products", "create impact"],
  },
  clients: ["Finova", "Luxe Retail", "DataFlow", "MedTech", "TechVentures", "NovaCorp", "Altair", "Meridian"],
  caseStudies: [
    { id: "cs1", title: "Redefining Digital Banking", client: "Finova", category: "Digital Products", year: "2024", colorFrom: "#4a7c9b", colorTo: "#6b9dc4" },
    { id: "cs2", title: "E-commerce Reimagined", client: "Luxe Retail", category: "Platforms", year: "2024", colorFrom: "#6b9dc4", colorTo: "#b5c6e0" },
    { id: "cs3", title: "AI-Powered Analytics", client: "DataFlow", category: "Applied AI", year: "2023", colorFrom: "#b5c6e0", colorTo: "#4a7c9b" },
    { id: "cs4", title: "Healthcare Innovation", client: "MedTech", category: "Digital Products", year: "2023", colorFrom: "#4a7c9b", colorTo: "#b5c6e0" },
  ],
  services: [
    { n: "01", title: "Brand & Identity", desc: "Distinctive identities that resonate and endure." },
    { n: "02", title: "Digital Products", desc: "End-to-end design and development users love." },
    { n: "03", title: "Web Development", desc: "Custom platforms built for performance and scale." },
    { n: "04", title: "Applied AI", desc: "Intelligent solutions for personalized experiences." },
  ],
  testimonial: {
    quote: "Working with Woo Tong transformed our digital presence. Their attention to detail and strategic thinking delivered results beyond expectations.",
    name: "Sarah Chen",
    role: "CEO, TechVentures",
  },
  about: {
    heading: "We believe in the power of thoughtful design",
    description: "Founded with a passion for exceptional digital experiences, we've grown into a team of designers, developers, and strategists who share a common goal: creating work that matters.",
    stats: [
      { value: "5+", label: "Projects Delivered" },
      { value: "100%", label: "Client Retention" },
    ],
  },
  contact: {
    heading: "Ready to start your project?",
    description: "Let's discuss how we can help achieve your goals.",
    email: "hello@wootong.com",
    buttonText: "LET'S TALK",
  },
  footer: {
    tagline: "Crafting premium digital experiences that elevate brands.",
    companyLinks: [
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Work", href: "#work" },
    ],
    socialLinks: [
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Dribbble", href: "#" },
    ],
  },
  adminPassword: "admin123",
};

// Load content from file or use default
async function loadContent() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Save default content if file doesn't exist
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2));
    return DEFAULT_CONTENT;
  }
}

// Save content to file
async function saveContent(content) {
  await fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2));
  return content;
}

// Simple session storage (in production, use Redis or database)
const sessions = new Map();

// Auth middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !sessions.get(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// API Routes

// Get site content (public)
app.get('/api/content', async (req, res) => {
  try {
    const content = await loadContent();
    // Don't expose admin password
    const { adminPassword, ...safeContent } = content;
    res.json(safeContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load content' });
  }
});

// Update site content (requires auth)
app.put('/api/content', requireAuth, async (req, res) => {
  try {
    const content = await saveContent(req.body);
    const { adminPassword, ...safeContent } = content;
    res.json(safeContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// Admin login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    const content = await loadContent();
    
    if (password === content.adminPassword) {
      const token = crypto.randomUUID();
      sessions.set(token, { authenticated: true, expires: Date.now() + 24 * 60 * 60 * 1000 });
      res.json({ token, success: true });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Verify auth token
app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({ valid: true });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    sessions.delete(token);
  }
  res.json({ success: true });
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // In production, send email or store in database
    console.log('Contact form submission:', { name, email, message });
    res.json({ success: true, message: 'Thank you for your message!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Newsletter subscription
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    // In production, add to mailing list
    console.log('Newsletter subscription:', email);
    res.json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
});
