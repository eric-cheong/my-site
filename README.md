# Woo Tong - Digital Design Agency Website

A modern, responsive website with a full-featured admin panel for content management.

## Features

### Frontend
- ✅ **React 18** with modern hooks
- ✅ **SEO Optimized** with meta tags, Open Graph, Twitter Cards, and structured data
- ✅ **Responsive Design** with mobile-first approach
- ✅ **Smooth Animations** using Intersection Observer
- ✅ **Component Architecture** with reusable shared components
- ✅ **Dynamic Content** via API or localStorage fallback

### Backend
- ✅ **Express.js REST API** for content management
- ✅ **Authentication** with token-based sessions
- ✅ **File-based Storage** (easily upgradable to database)
- ✅ **CORS enabled** for cross-origin requests
- ✅ **Contact Form API** endpoint
- ✅ **Health Check** endpoint

### Admin Panel
- ✅ **Secure Login** with password protection
- ✅ **Real-time Content Editing** for all site sections
- ✅ **SEO Management** with checklist
- ✅ **Visual Preview** of changes
- ✅ **Reset to Defaults** option

## Project Structure

```
/workspace
├── src/
│   ├── main.jsx              # Entry point with HelmetProvider
│   ├── App.jsx               # Main application component
│   ├── components/
│   │   ├── SEO.jsx           # SEO component with structured data
│   │   └── Shared.jsx        # Reusable UI components
│   └── context/
│       └── ContentContext.jsx # State management with API integration
├── server/
│   └── index.js              # Express.js backend API
├── index.html                # HTML template with SEO meta tags
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

Run both frontend and backend servers concurrently:

```bash
npm run dev
```

This starts:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Separate Servers

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Start production server (serves both API and static files)
npm start
```

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content` | Get site content |
| GET | `/api/health` | Health check |

### Protected Endpoints (require authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/content` | Update site content |
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/verify` | Verify auth token |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter` | Subscribe to newsletter |

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
PORT=3001
NODE_ENV=development
```

## Default Admin Credentials

- **Password**: `admin123`
- **Change this immediately** in the Security section of the admin panel!

## SEO Features

### Implemented
- ✅ Dynamic title and meta description
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card support
- ✅ Canonical URLs
- ✅ Robots meta tag
- ✅ Structured data (JSON-LD) for:
  - Professional Service
  - Local Business
- ✅ Semantic HTML structure
- ✅ Mobile-friendly design
- ✅ Fast loading with code splitting

### Customization

Edit SEO settings in the Admin Panel → SEO & Meta section, or modify `src/components/SEO.jsx`.

## Component Library

### Shared Components (`src/components/Shared.jsx`)

- `Arrow` - SVG arrow icon
- `useReveal` - Hook for scroll-triggered animations
- `Reveal` - Component for fade-in animations
- `sanitize` - XSS protection utility
- `LoadingSpinner` - Loading indicator
- `Button` - Styled button component
- `Card` - Card container component
- `Section` - Section wrapper with consistent spacing
- `Container` - Max-width content container

### SEO Component (`src/components/SEO.jsx`)

- `SEO` - Main SEO component with all meta tags
- `withSEO` - HOC for page-level SEO

## Deployment

### Vercel/Netlify (Frontend only)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for API URL

### Full Stack Deployment

For production deployment with the backend:

1. **Railway/Render/Heroku**: Deploy as a Node.js app
2. **Cloudflare Pages + Workers**: Use Workers for API
3. **VPS**: Run with PM2 or similar process manager

Example production server configuration:

```bash
# Install PM2
npm install -g pm2

# Start in production mode
NODE_ENV=production pm2 start server/index.js --name wootong-api
```

## Database Integration

Currently uses file-based storage. To upgrade to a database:

1. Install your preferred database client (e.g., `pg`, `mongodb`, etc.)
2. Modify `server/index.js` to use database queries instead of file operations
3. Add migration scripts for initial setup

## Security Considerations

- ✅ Input sanitization to prevent XSS
- ✅ Token-based authentication
- ✅ Password protection for admin panel
- ⚠️ For production: Move auth to server-side with JWT
- ⚠️ For production: Use HTTPS (provided by most hosting platforms)
- ⚠️ For production: Implement rate limiting
- ⚠️ For production: Add CSRF protection

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions, please open an issue on GitHub.
