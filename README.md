# AI Agent Frontend

A React + TypeScript + Vite application for managing personalized feeds and user profiles with Google OAuth authentication.

## Features

- Google OAuth authentication with popup-based flow
- User profile management
- Personalized feed display from multiple sources
- JWT token-based authentication
- Responsive UI with Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000`

## Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd Monday-Front
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory (optional):

```bash
VITE_API_URL=http://localhost:3000
```

If not set, the application defaults to using the Vite proxy configuration.

4. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/        # React components
│   ├── auth/         # Authentication components
│   └── Feed.tsx      # Feed display component
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── Login.tsx     # Login page
│   ├── AuthCallback.tsx  # OAuth callback handler
│   └── Profile.tsx   # User profile page
├── services/         # API services
│   ├── api.ts        # API client configuration
│   └── auth.ts       # Authentication utilities
├── types/            # TypeScript type definitions
└── config/           # Configuration files
```

## API Endpoints

The application connects to the following backend endpoints:

- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/feed` - Get feed items

## Authentication Flow

1. User clicks "Sign in with Google"
2. Application opens popup with Google OAuth consent screen
3. After successful authentication, callback sends token via postMessage
4. Token is stored in localStorage and used for subsequent API requests
5. Protected routes require valid JWT token

## Development Notes

- The application uses Vite proxy to avoid CORS issues in development
- All API requests are proxied through `/api` to `http://localhost:3000`
- JWT tokens are stored in localStorage with key `auth_token`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

---

## React + TypeScript + Vite Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
