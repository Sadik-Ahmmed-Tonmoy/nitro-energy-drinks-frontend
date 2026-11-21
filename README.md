# ⚡ Nitro Energy Drinks — Frontend

A high-performance, animated marketing & e-commerce frontend for **Nitro Energy Drink** — zero sugar, high intensity. Built with Next.js 16, React 19, Tailwind CSS v4, and Framer Motion.

---

## 🖥️ Live Demo

> Deployed on **Vercel**
> Project: `nitro-energy-drinks-frontend`

---

## ✨ Features

- **Dynamic Hero Section** — drag-to-swipe can carousel with pointer parallax, autoplay, and per-flavour accent colour theming
- **Animated About Section** — scroll-linked parallax image, staggered text reveal, and can slide-in
- **Shop Section** — flavour cards with pricing, animated entry, and "Add to Cart" flow
- **Gallery Section** — responsive image gallery
- **Accent Colour System** — `@property --accent` CSS custom property animates smoothly across the whole page when switching flavours
- **Authentication** — NextAuth.js with Google, Facebook, and Apple OAuth providers
- **Protected Dashboard** — route-grouped dashboard behind auth
- **JWT Auth** — access + refresh token flow with silent token refresh via RTK Query base query
- **Redux Toolkit + RTK Query** — global state management with `redux-persist` for session hydration
- **Fully Typed** — TypeScript throughout
- **Accessible** — ARIA labels, `role="tab"` flavour picker, `aria-live` announcements, `prefers-reduced-motion` support

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS |
| Animation | [Framer Motion 12](https://www.framer.com/motion/) |
| State Management | [Redux Toolkit](https://redux-toolkit.js.org/) + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) |
| Auth | [NextAuth.js v4](https://next-auth.js.org/) |
| Icons | [React Icons](https://react-icons.github.io/react-icons/) + [Lucide React](https://lucide.dev/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Alerts | [SweetAlert2](https://sweetalert2.github.io/) |
| Fonts | [Outfit](https://fonts.google.com/specimen/Outfit) (sans) · [Russo One](https://fonts.google.com/specimen/Russo+One) (display) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
nitro-energy-drinks-frontend/
├── app/
│   ├── layout.tsx              # Root layout — fonts, providers
│   ├── globals.css             # Tailwind v4 theme, accent system, global styles
│   ├── (common)/               # Public marketing routes
│   │   ├── layout.tsx          # Header + Footer wrapper
│   │   └── page.tsx            # Home page
│   ├── (auth)/                 # Auth routes (login, register)
│   ├── (dashboard)/            # Protected dashboard routes
│   └── api/auth/               # NextAuth.js API route
│
├── components/
│   ├── pages/home/
│   │   ├── Hero/               # Draggable can carousel, flavour switcher
│   │   ├── About/              # Scroll-parallax about section
│   │   ├── Shop/               # Product cards
│   │   ├── Gallery/            # Image gallery
│   │   └── HomeComponent.tsx   # Page composition
│   ├── shared/
│   │   ├── NavBar/Header.tsx   # Sticky navigation
│   │   └── Footer/Footer.tsx
│   ├── helper/
│   │   └── RotatedCan.tsx      # Shared animated can image component
│   └── ui-library/             # Primitive layout components (Box, Grid, Flex…)
│
├── lib/
│   ├── products.ts             # FLAVORS data & NAV config
│   ├── accent.ts               # Section accent colour helpers
│   ├── api.ts                  # Fetch utilities
│   └── MyContextProvider.tsx   # React context wrapper
│
├── redux/
│   ├── store.ts                # Redux store + redux-persist
│   ├── ReduxStoreProvider.tsx  # Client-side store provider
│   ├── api/baseApi.ts          # RTK Query base with refresh-token logic
│   └── features/
│       └── auth/               # authSlice (user, access_token, refresh_token)
│
├── nextAuth/
│   ├── authOptions.ts          # NextAuth providers (Google, Facebook, Apple)
│   └── SessionProviderForNextAuth.tsx
│
├── utils/
│   ├── tokenHandler.ts
│   ├── verifyToken.ts
│   ├── handleLogout.ts
│   ├── handleAsyncWithToast.ts
│   └── scrollToSectionById.ts
│
├── public/images/              # Can images (webp), logo, gallery assets
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** or **pnpm**

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nitro-energy-drinks-frontend.git
cd nitro-energy-drinks-frontend
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Backend API
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api/

# NextAuth
NEXT_PUBLIC_NEXT_AUTH_SECRET=your_nextauth_secret

# Google OAuth
NEXT_PUBLIC_GOOGLE_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_SECRET=your_google_client_secret

# Facebook OAuth
NEXT_PUBLIC_FACEBOOK_ID=your_facebook_app_id
NEXT_PUBLIC_FACEBOOK_SECRET=your_facebook_app_secret

# Apple OAuth
NEXT_PUBLIC_APPLE_ID=your_apple_client_id
NEXT_PUBLIC_APPLE_SECRET=your_apple_client_secret
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking (no emit) |

---

## 🎨 Design System

### Accent Colour

The entire UI is themed by a single CSS custom property `--accent` that changes with the active flavour and animates via `@property`:

```css
@property --accent { syntax: "<color>"; inherits: true; initial-value: #e0e600; }
html { transition: --accent 0.9s cubic-bezier(0.22, 1, 0.36, 1); }
```

### Flavours

| Flavour | Accent | Price |
|---|---|---|
| Nitro Green | `#E0E600` | \$12.00 |
| Nitro Red | `#FF2E3F` | \$11.00 |
| Nitro Sky | `#1FC8EE` | \$11.00 |
| Nitro Blue | `#5B5CFF` | \$10.58 |
| Nitro Gold | `#F6B21C` | \$10.58 |

### Typography

- **Sans (body):** Outfit 400 / 500 / 800 → `font-sans`
- **Display (headings):** Russo One 400 (stand-in for Sakana) → `.display` class

---

## 🔐 Authentication Flow

1. User signs in via Google / Facebook / Apple through **NextAuth.js**
2. On success, a JWT `access_token` + `refresh_token` are stored in Redux (persisted via `redux-persist`)
3. RTK Query's `baseQueryWithRefreshToken` intercepts `401` responses, silently calls `POST /refresh-token`, and retries the original request
4. On token refresh failure, the user is logged out and redirected

---

## 🌐 Deployment

The project is configured for **Vercel** deployment.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Environment variables must be added in the **Vercel Dashboard → Project Settings → Environment Variables**.

---

## 📄 License

This project is private. All rights reserved.
