import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load content from API
  const loadContent = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/content`);
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
      setError(null);
    } catch (err) {
      console.error('Error loading content:', err);
      setError(err.message);
      // Fallback to localStorage if API fails
      try {
        const local = localStorage.getItem('site-content');
        if (local) {
          setContent(JSON.parse(local));
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  }, []);

  // Save content via API
  const saveContent = useCallback(async (newContent, token) => {
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
      return { success: false, error: err.message };
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
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {}
    
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin-token');
  }, [token]);

  const verify = useCallback(async () => {
    if (!token) return false;
    
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
