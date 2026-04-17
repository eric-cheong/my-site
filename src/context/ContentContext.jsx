import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

/* Use Vite's compile-time flag — NOT hostname heuristics. */
const IS_PROD = import.meta.env.PROD;
const API_URL = import.meta.env.VITE_API_URL || (IS_PROD ? '/api' : 'http://localhost:3001/api');

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

const LOCAL_KEY = 'site-content';
const TOKEN_KEY = 'admin-token';
const TOKEN_EXPIRY_KEY = 'admin-token-expiry';

const ContentContext = createContext(null);

async function apiGet(path, token) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
  return res.json();
}

async function apiSend(path, method, body, token) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);

  const loadContent = useCallback(async () => {
    try {
      const data = await apiGet('/content');
      setContent(data);
      setApiAvailable(true);
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch {}
    } catch {
      setApiAvailable(false);
      try {
        const local = localStorage.getItem(LOCAL_KEY);
        setContent(local ? JSON.parse(local) : DEFAULT_CONTENT);
      } catch {
        setContent(DEFAULT_CONTENT);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const saveContent = useCallback(async (newContent, token) => {
    if (!apiAvailable || !token) {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(newContent));
        setContent(newContent);
        return { success: true, local: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    try {
      const data = await apiSend('/content', 'PUT', newContent, token);
      setContent(data);
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch {}
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [apiAvailable]);

  useEffect(() => { loadContent(); }, [loadContent]);

  const value = useMemo(() => ({
    content, saveContent, reload: loadContent, apiAvailable,
  }), [content, saveContent, loadContent, apiAvailable]);

  if (loading || !content) {
    return (
      <div role="status" aria-live="polite" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#ebf4f5',
      }}>
        <div style={{
          width: 24, height: 24,
          border: '3px solid #c8d8e4', borderTopColor: '#4a7c9b',
          borderRadius: '50%', animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <span style={{ position: 'absolute', left: -9999 }}>Loading…</span>
      </div>
    );
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within a ContentProvider');
  return ctx;
}

/* ── Admin auth ────────────────────────────────────────────── */
function readStoredToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = Number(localStorage.getItem(TOKEN_EXPIRY_KEY) || 0);
    if (!token || !expiry || Date.now() > expiry) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      return null;
    }
    return token;
  } catch { return null; }
}

export function useAuth() {
  const [token, setToken] = useState(() => readStoredToken());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (password) => {
    setLoading(true);
    try {
      const data = await apiSend('/auth/login', 'POST', { password });
      const expiry = Date.now() + (data.expiresIn || 12 * 60 * 60 * 1000);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try { await apiSend('/auth/logout', 'POST', null, token); } catch {}
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setToken(null);
  }, [token]);

  const verify = useCallback(async () => {
    if (!token) return false;
    try {
      await apiGet('/auth/verify', token);
      return true;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      setToken(null);
      return false;
    }
  }, [token]);

  return { isAuthenticated: !!token, token, login, logout, verify, loading };
}
