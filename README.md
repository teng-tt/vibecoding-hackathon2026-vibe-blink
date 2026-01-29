# 🚀 Vibe Blink Factory

**No-Code Solana Blinks Generation Platform** — Create interactive rating, tipping, and prediction components for your Solana projects in just 10 seconds, then share directly on Twitter!

![Solana](https://img.shields.io/badge/Solana-000000?style=for-the-badge&logo=solana&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**[简体中文文档](./README_CN.md)** | **English** | **[Vibe Blink Factory Demo](https://vibecoding-hackathon2026-vibe-blink-hp8y6yxxb-tengtts-projects.vercel.app//)**

---

## ✨ Core Features

### ✅ No-Code
- Fill out a simple form to generate instantly
- No programming knowledge required
- Bilingual interface (English & Chinese)

### ✅ Dynamic
- **Rating System** — Users rate projects (1-5 stars)
- **Tipping System** — SOL transfer for tips
- **Prediction Market** — On-chain data-based predictions
- Single API handles all logic

### ✅ Persistence
- Reliable data storage with **Vercel Postgres**
- Real-time project synchronization
- Complete historical data tracking

### ✅ Shareable
- One-click Solana Actions link generation
- Direct interaction via **Dialect**
- Perfect for Twitter / X

---

## 🎯 Hackathon Track

- **Track**: Consumer & Entertainment / Alpha Tools
- **Network**: Solana Devnet (please switch wallet for testing)
- **Event**: 2025 Solana Hackathon Official Entry

---

## 📚 Quick Start

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm
- Solana Wallet (Phantom recommended)
- Vercel Account (optional, for database)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/vibe-blink
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
- **2025 Solana Hackathon** — Official event support
- **Solana Community** — For continuous support

---

## 📧 Contact & Links

- 🐦 Twitter: [@YourHandle](https://x.com/ttt81082918)
- 💻 GitHub: [YourRepo](https://github.com/teng-tt/vibecoding-hackathon2026-vibe-blink)
- 🔗 Live Demo: [https://vibecoding-hackathon2026-vibe-blink-hp8y6yxxb-tengtts-projects.vercel.app/](https://vibecoding-hackathon2026-vibe-blink-hp8y6yxxb-tengtts-projects.vercel.app/)

---

⚡️ **Vibe Coding Challenge 2026** | #Solana #VibeCoding #Blinks #BuildInPublic

**Made with ❤️ for the Solana ecosystem**