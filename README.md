# Vibe Blink Factory

> 🚀 **Generate Zero-Code Solana Blinks** - Create interactive onchain actions without writing code

Vibe Blink Factory is a powerful platform that enables anyone to create, manage, and deploy Solana Blinks without coding. With an intuitive interface and smart automation, you can go from idea to production-ready Blinks in minutes.

![Solana](https://img.shields.io/badge/Solana-000000?style=for-the-badge&logo=solana&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Status:** ✨ Production Ready | **Version:** 0.1.0  
**[简体中文文档](./README_CN.md)** | **[Live Demo](https://vibecoding-hackathon2026-vibe-blink.vercel.app/)**

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Core Features
- **Zero-Code Blink Generation** - Create production-ready Blinks without writing any code
- **Smart Dashboard** - Comprehensive overview of all your Blinks and performance metrics
- **Community Showcase** - Discover and explore Blinks created by community members
- **Real-time Stats** - Track volume, transactions, and Vibe scores
- **Multi-language Support** - English and Simplified Chinese interface

### Developer Features
- **RESTful API v1** - Well-designed versioned API for programmatic Blink management
- **Vercel Postgres** - Reliable, managed database persistence
- **TypeScript First** - Full type safety across the entire codebase
- **Modular Architecture** - Clean component structure for easy maintenance and scaling
- **Flexible Configuration** - Environment variables for different deployment environments

### Advanced Features
- **Auto-initialized Database** - Self-healing setup on first deployment
- **Smart Connection Pooling** - Automatic detection and configuration of database connections
- **Comprehensive Error Handling** - Detailed error messages for easier debugging
- **Built-in CORS Support** - Ready for third-party integrations

---

## 📁 Project Structure

```
vibe-blink/
├── app/                              # Next.js app directory
│   ├── api/
│   │   ├── v1/projects/             # ✨ Versioned API endpoints (recommended)
│   │   ├── projects/                # Legacy endpoint (backward compatibility)
│   │   ├── actions/                 # Solana Actions endpoint
│   │   └── env-check/               # Environment diagnostics
│   ├── create/                       # Blink creation page
│   ├── showcase/                     # Community Blink showcase
│   ├── DashboardClient.tsx           # Dashboard UI component
│   ├── RootLayoutClient.tsx          # Root layout with i18n support
│   ├── Sidebar.tsx                   # Navigation sidebar
│   ├── layout.tsx                    # Server-side root layout
│   ├── page.tsx                      # Dashboard home page
│   └── globals.css                   # Global styles with CSS variables
│
├── components/                       # Reusable React components
│   ├── ui/                           # ✨ Atomic UI components
│   │   ├── Navigation.tsx            # Navigation component
│   │   ├── DataCard.tsx              # Data display card
│   │   └── QuickActionCard.tsx       # Quick action card component
│   ├── layout/                       # ✨ Layout-specific components
│   │   ├── SidebarLayout.tsx         # Reusable sidebar layout
│   │   └── PageHeader.tsx            # Page header component
│   ├── LanguageSwitcher.tsx          # i18n language switcher
│   └── Sidebar.tsx                   # Legacy sidebar (use SidebarLayout)
│
├── lib/                              # Core business logic
│   ├── db.ts                         # Database operations & initialization
│   ├── i18n.ts                       # i18n translations & utilities
│   ├── i18nContext.tsx               # i18n React context provider
│   └── init.ts                       # Initialization utilities
│
├── types/                            # ✨ TypeScript type definitions
│   └── index.ts                      # Project, API response, i18n types
│
├── utils/                            # ✨ Utility functions
│   ├── constants.ts                  # Routes, endpoints, theme colors
│   ├── api-client.ts                 # API client with error handling
│   └── [other utilities]             # Helper functions
│
├── hooks/                            # ✨ Custom React hooks (future)
├── public/                           # Static assets
│   └── *.svg                         # SVG icons and images
├── data/                             # Data files (if needed)
│
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.js                # Tailwind CSS styling
├── next.config.ts                    # Next.js configuration
└── README.md                         # This file
```

**Key Optimizations (marked with ✨):**
- **types/** - Centralized type definitions
- **utils/** - Reusable utilities and constants  
- **components/ui/** - Atomic, composable UI components
- **components/layout/** - Layout-specific components
- **hooks/** - Custom hooks directory for future expansion
- **app/api/v1/** - Versioned API endpoints

---

## 🛠 Technology Stack

### Frontend
- **React 19.2.3** - UI library
- **Next.js 16.1.6** - React framework with server components
- **TypeScript 5** - Static type checking
- **Tailwind CSS 4** - Utility-first CSS framework

### Backend & Data
- **Next.js Server Components** - Server-side rendering
- **Vercel Postgres** - Managed PostgreSQL database
- **@vercel/postgres** - TypeScript database client

### Blockchain
- **@solana/web3.js 1.98.4** - Solana blockchain interaction
- **@solana/actions 1.6.6** - Solana Blinks/Actions support

### Development Tools
- **ESLint 9** - Code linting
- **TypeScript 5** - Type safety

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ with npm
- Vercel account (for PostgreSQL)
- Git

### Installation

1. **Clone repository**
```bash
git clone https://github.com/teng-tt/vibecoding-hackathon2026-vibe-blink.git
cd vibe-blink
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**

Create `.env.local`:
```bash
# From Vercel Postgres Database
POSTGRES_URL=postgresql://user:password@host:6543/database?poolingMode=transaction
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/database
PRISMA_DATABASE_URL=postgresql://...
DATABASE_URL=postgresql://...
```

Get credentials from Vercel Dashboard → Storage → PostgreSQL → `.env.local`

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

5. **Build for production**
```bash
npm run build
npm start
```

---

## 📡 API Documentation

### Base URLs
- Development: `http://localhost:3000/api/v1`
- Production: `https://vibe-blink.vercel.app/api/v1`

### Projects Endpoints

#### Get All Projects
```bash
GET /api/v1/projects
```

Response (200 OK):
```json
[
  {
    "id": "project-1706403000000",
    "name": "My First Blink",
    "description": "Amazing Solana action",
    "wallet": "SOL1...xyz",
    "link": "https://example.com/blink",
    "volume": 1234.56,
    "txs": 42,
    "created_at": "2024-01-27T10:30:00Z",
    "updated_at": "2024-01-27T10:30:00Z"
  }
]
```

#### Get Single Project
```bash
GET /api/v1/projects?id=project-1706403000000
```

#### Create Project
```bash
POST /api/v1/projects
Content-Type: application/json

{
  "name": "New Blink",
  "description": "Description",
  "wallet": "SOL1...xyz",
  "link": "https://example.com",
  "volume": 0,
  "txs": 0
}
```

Response (201 Created): Project object

#### Update Project
```bash
PUT /api/v1/projects
Content-Type: application/json

{
  "id": "project-id",
  "name": "Updated Name",
  "volume": 5000
}
```

#### Delete Project
```bash
DELETE /api/v1/projects?id=project-id
```

Response: `{ "success": true }`

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Optimize: update project structure"
git push origin main
```

2. **Connect Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select project root
   - Click "Deploy"

3. **Configure Environment Variables**
   - Go to Settings → Environment Variables
   - Add Postgres credentials:
     - `POSTGRES_URL` (pooled)
     - `POSTGRES_URL_NON_POOLING` (direct)
     - `PRISMA_DATABASE_URL` (alias)
     - `DATABASE_URL` (alias)

4. **Verify Deployment**
```bash
curl https://your-domain.vercel.app/api/v1/projects
# Should return: []
```

---

## 🔧 Troubleshooting

### Database Errors

**Error: "invalid_connection_string"**
- Means POSTGRES_URL is non-pooling
- Fix: Verify ports (6543 = pooling, 5432 = direct)
- Re-deploy after correction

**Error: "missing_connection_string"**
- POSTGRES_URL env var not found
- Check: Vercel Settings → Environment Variables
- Ensure variables set for Production environment

### Build Issues

**Clear and rebuild:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Port already in use:**
```bash
npm run dev -- -p 3001
```

### Development Tips

- First API call triggers database initialization
- Check server logs for init messages
- Environment variables required for database features

---

## 🤝 Contributing

Contributions welcome! How to help:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes following project structure
4. Commit: `git commit -m "feat: add amazing feature"`
5. Push: `git push origin feature/amazing-feature`
6. Open Pull Request

**Commit Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code restructuring
- `style:` Code style
- `test:` Tests
- `chore:` Maintenance

---

## 📄 License

Vibe Coding Hackathon 2026 Entry

---

## 🙋 Support

- 📖 [Full Documentation](#deployment)
- 🐛 [Issues](https://github.com/teng-tt/vibecoding-hackathon2026-vibe-blink/issues)
- 💬 [Discussions](https://github.com/teng-tt/vibecoding-hackathon2026-vibe-blink/discussions)

---

Built with ⚡️ by Vibe Coding Team
- npm / yarn / pnpm
- Solana Wallet (Phantom recommended)
- Vercel Account (optional, for database)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/teng-tt/vibecoding-hackathon2026-vibe-blink
cd vibe-blink

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.local.example .env.local

# 4. Configure Postgres in .env.local
# POSTGRES_URL=postgresql://user:password@host:5432/database
# POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/database

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🏗 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes, Solana Web3.js, Solana Actions
- **Database**: Vercel Postgres
- **Network**: Solana Devnet
- **Deployment**: Vercel

---

## 📂 Project Structure

```
vibe-blink/
├── app/                              # Next.js app directory
│   ├── create/                       # Blinks generation factory
│   ├── showcase/                     # Community ecosystem showcase
│   ├── api/
│   │   ├── actions/multitool/       # Solana Actions handler
│   │   └── projects/                # Project management API
│   └── page.tsx                      # Dashboard
├── lib/
│   ├── db.ts                        # Database operations
│   ├── i18n.ts                      # i18n translations
│   └── i18nContext.tsx              # i18n context provider
├── components/                       # Reusable components
└── public/                          # Static assets
```

---

## 🔗 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Project management hub |
| Factory | `/create` | Generate new Blinks |
| Showcase | `/showcase` | Browse community projects |

---

## 🌐 API Endpoints

### `GET/POST /api/projects`
Manage projects in database

### `GET /api/actions/multitool`
Get Solana Actions metadata

### `POST /api/actions/multitool`
Execute transaction operations (rating, tipping, predictions)

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Visit vercel.com and connect your repository
# 3. Configure environment variables:
#    POSTGRES_URL
#    POSTGRES_URL_NON_POOLING
# 4. Deploy with one click!
```

---

## 🌍 Internationalization

The project supports complete **English & Chinese** interface:

- 🇺🇸 English
- 🇨🇳 Simplified Chinese

All translations are in [lib/i18n.ts](lib/i18n.ts)

---

## 📝 Environment Variables

```env
# Required: Vercel Postgres connection string
POSTGRES_URL=postgresql://user:password@host:5432/database
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/database

# Optional: Application configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_APP_NAME="Vibe Blink Factory"
```

---

## 📖 Documentation

- **Full Documentation**: [README_CN.md](./README_CN.md) (Chinese)
- **Solana Actions**: [https://solana.com/developers/guides/solana-actions](https://solana.com/developers/guides/solana-actions)
- **Vercel Postgres**: [https://vercel.com/docs/storage/vercel-postgres](https://vercel.com/docs/storage/vercel-postgres)

---

## 🐛 Troubleshooting

### Database Connection Error
- Check `.env.local` connection string
- Ensure Vercel Postgres database is online
- Try using non-pooling connection string

### Solana Actions Link Issues
- Ensure app runs on HTTPS (required by Solana Actions)
- Verify URL parameter encoding
- Test manually in Dialect

### Transaction Failed
- Ensure wallet has enough SOL on Devnet
- Check backend logs for detailed error
- Verify transaction instruction building

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **Solana Labs** — For Solana Actions standard and ecosystem
- **Vercel** — For Next.js and database services
- **Dialect** — For Actions execution engine
- **2026 Solana Vibe Coding Hackathon** — Official event support
- **Solana Community** — For continuous support

---

## 📧 Contact & Links

- 🐦 Twitter: [@YourHandle](https://x.com/ttt81082918)
- 💻 GitHub: [YourRepo](https://github.com/teng-tt/vibecoding-hackathon2026-vibe-blink)
- 🔗 Live Demo: [https://vibecoding-hackathon2026-vibe-blink.vercel.app//](https://vibecoding-hackathon2026-vibe-blink.vercel.app//)

---

⚡️ **Vibe Coding Challenge 2026** | #Solana #VibeCoding #Blinks #BuildInPublic

**Made with ❤️ for the Solana ecosystem**