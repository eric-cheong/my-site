import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Detect if we're in production (Cloudflare Pages has no backend)
const IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Get API URL only in development
const API_URL = !IS_PRODUCTION 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:3001/api')
  : null;

// Default content as ultimate fallback
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
};

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load content from API or localStorage or default
  const loadContent = useCallback(async () => {
    try {
      // In production (Cloudflare Pages), skip API and use localStorage/default
      if (IS_PRODUCTION) {
        console.log('Production mode: using localStorage/default content');
        const local = localStorage.getItem('site-content');
        if (local) {
          setContent(JSON.parse(local));
        } else {
          setContent(DEFAULT_CONTENT);
        }
        setLoading(false);
        return;
      }
      
      // In development, try API first
      const response = await fetch(`${API_URL}/content`);
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
      setError(null);
    } catch (err) {
      console.warn('API not available, using fallback:', err.message);
      // Fallback to localStorage or default content
      try {
        const local = localStorage.getItem('site-content');
        if (local) {
          setContent(JSON.parse(local));
        } else {
          setContent(DEFAULT_CONTENT);
        }
      } catch {
        setContent(DEFAULT_CONTENT);
      }
      setError(null); // Don't show error, just use fallback silently
    } finally {
      setLoading(false);
    }
  }, []);

  // Save content (only works in development with backend)
  const saveContent = useCallback(async (newContent, token) => {
    // In production, just save to localStorage
    if (IS_PRODUCTION) {
      try {
        localStorage.setItem('site-content', JSON.stringify(newContent));
        setContent(newContent);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    
    // In development, try API first
    try {
      const response = await fetch(`${API_URL}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newContent),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save content');
      }
      
      const data = await response.json();
      setContent(data);
      
      // Also save to localStorage as backup
      try {
        localStorage.setItem('site-content', JSON.stringify(data));
      } catch {}
      
      return { success: true };
    } catch (err) {
      console.error('Error saving content:', err);
      // Fallback to localStorage
      try {
        localStorage.setItem('site-content', JSON.stringify(newContent));
        setContent(newContent);
        return { success: true };
      } catch {
        return { success: false, error: err.message };
      }
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#ebf4f5'
      }}>
        <div style={{ 
          width: 24, 
          height: 24, 
          border: '3px solid #c8d8e4', 
          borderTopColor: '#4a7c9b', 
          borderRadius: '50%', 
          animation: 'spin 0.7s linear infinite' 
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <ContentContext.Provider value={{ content, saveContent, reload: loadContent, error }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

// Auth hook for admin panel
export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('admin-token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (password) => {
    setLoading(true);
    try {
      // In production, use simple password check (no backend)
      if (IS_PRODUCTION) {
        // For production, you should implement proper auth
        // This is a simple placeholder - replace with your own logic
        if (password === 'admin123') {
          setToken('production-token');
          setIsAuthenticated(true);
          localStorage.setItem('admin-token', 'production-token');
          return { success: true };
        }
        return { success: false, error: 'Invalid password' };
      }
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem('admin-token', data.token);
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (!IS_PRODUCTION) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {}
    }
    
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin-token');
  }, [token]);

  const verify = useCallback(async () => {
    if (!token) return false;
    
    if (IS_PRODUCTION) {
      return token === 'production-token';
    }
    
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      return data.valid === true;
    } catch {
      return false;
    }
  }, [token]);

  return { isAuthenticated, login, logout, verify, loading, token };
}
