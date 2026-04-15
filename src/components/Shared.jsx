import { useState, useRef, useEffect } from 'react';

const COLORS = {
  bg: "#ebf4f5", 
  fg: "#1a1a2e", 
  primary: "#4a7c9b", 
  accent: "#6b9dc4",
  secondary: "#b5c6e0", 
  muted: "#dde8ea", 
  mutedFg: "#5a6a7a", 
  border: "#c8d8e4",
};

export function Arrow({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="12" y2="4" />
      <polyline points="6,4 12,4 12,10" />
    </svg>
  );
}

export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold });
    
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  
  return [ref, visible];
}

export function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useReveal();
  
  return (
    <div 
      ref={ref} 
      className={className} 
      style={{ 
        ...style, 
        opacity: visible ? 1 : 0, 
        transform: visible ? "translateY(0)" : "translateY(24px)", 
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` 
      }}
    >
      {children}
    </div>
  );
}

export function sanitize(str) {
  if (typeof str !== "string") return str;
  const el = document.createElement("div");
  el.textContent = str;
  return el.innerHTML;
}

// Loading Spinner Component
export function LoadingSpinner({ size = 24, color = COLORS.primary }) {
  return (
    <div style={{ 
      width: size, 
      height: size, 
      border: `3px solid ${COLORS.border}`, 
      borderTopColor: color, 
      borderRadius: '50%', 
      animation: 'spin 0.7s linear infinite' 
    }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// Button Component
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled,
  className = '',
  style = {},
  ...props 
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    textDecoration: 'none',
  };
  
  const variants = {
    primary: { background: COLORS.fg, color: COLORS.bg },
    secondary: { background: COLORS.muted, color: COLORS.fg },
    outline: { background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.fg },
    ghost: { background: 'transparent', color: COLORS.mutedFg },
  };
  
  const sizes = {
    small: { padding: '8px 16px', fontSize: 12 },
    medium: { padding: '12px 24px', fontSize: 14 },
    large: { padding: '16px 32px', fontSize: 16 },
  };
  
  return (
    <button
      className={className}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ ...baseStyles, ...variants[variant], ...sizes[size], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}

// Card Component
export function Card({ children, className = '', style = {}, hover = false }) {
  return (
    <div 
      className={className}
      style={{
        background: '#fff',
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        padding: 24,
        transition: hover ? 'transform 0.3s, box-shadow 0.3s' : 'none',
        ...style,
      }}
      {...(hover ? {
        onMouseEnter: (e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        },
      } : {})}
    >
      {children}
    </div>
  );
}

// Section Component for consistent spacing
export function Section({ id, children, background = COLORS.bg, padding = '100px 0' }) {
  return (
    <section 
      id={id} 
      style={{ 
        background, 
        padding,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
    </section>
  );
}

// Container for max-width content
export function Container({ children, maxWidth = 1440, className = '', style = {} }) {
  return (
    <div 
      className={className}
      style={{ 
        maxWidth, 
        margin: '0 auto', 
        padding: '0 24px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
