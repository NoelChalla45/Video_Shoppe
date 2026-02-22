# 🎬 Video Shoppe

> A modern DVD rental and sales platform - **Ready to clone and run on Windows, macOS, or Linux!**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Cross-Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue.svg)](#)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

## 🚀 Quick Start

```bash
git clone <your-repo-url>
cd Video_Shoppe
npm run setup
npm start
```

**Linux/macOS users can also use bash scripts:**
```bash
chmod +x scripts/*.sh
npm run setup:sh
npm start:sh
```

**That's it!** Open http://localhost:5173 in your browser.

---

## ✨ Features

- 🔐 **User Authentication** - Secure login/register with JWT
- 📀 **DVD Catalog** - Browse 60+ movies with detailed info
- 🔍 **Advanced Filtering** - Search, category, price range, stock filters
- 💰 **Flexible Pricing** - Rent or buy options
- 👤 **User Accounts** - Profile management and rental tracking
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean Material Design inspired interface

---

## 📦 What's Included

### Frontend
- **React 18** - Modern UI library
- **Vite 6** - Lightning-fast build tool
- **React Router v7** - Client-side routing
- **CSS3** - Custom styling

### Backend
- **Express 4** - Web framework
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Production database (pre-configured!)
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Install all dependencies (first time) |
| `npm run setup:sh` | Same as above, using bash (Linux/macOS) |
| `npm start` | Start both frontend & backend |
| `npm run start:sh` | Same as above, using bash (Linux/macOS) |
| `npm run frontend` | Start only frontend dev server |
| `npm run backend` | Start only backend API server |
| `npm run verify` | Check if everything is set up correctly |
| `npm run verify:sh` | Same as above, using bash (Linux/macOS) |
| `npm run prisma:studio` | Open database GUI |

---

## 🗂️ Project Structure

```
Video_Shoppe/
├── Frontend/React/          # React application
│   ├── components/          # React components
│   ├── styles/              # CSS files
│   └── .env                 # Frontend config (included!)
├── Backend/                 # Express API
│   ├── src/routes/          # API endpoints
│   ├── prisma/              # Database schema
│   └── .env                 # Backend config (included!)
├── scripts/                 # Setup & automation scripts
│   ├── setup.js             # Node.js setup (cross-platform)
│   ├── setup.sh             # Bash setup (Linux/macOS)
│   ├── setup.ps1            # PowerShell setup (Windows)
│   ├── verify.js            # Verification script
│   └── start.sh             # Quick start script
├── docs/                    # Documentation
│   ├── QUICKSTART.md        # Quick start guide
│   ├── SETUP_GUIDE.md       # Detailed setup
│   ├── BASH_SCRIPTS.md      # Bash scripts guide
│   ├── CROSS_PLATFORM.md    # Platform compatibility
│   └── PROJECT_SUMMARY.md   # Project overview
├── Documents/               # Project planning docs
└── package.json             # Root scripts
```

---

## 🔧 Configuration

### ✅ Pre-Configured & Ready!

Both `.env` files are **already set up** with working credentials. No configuration needed!

- Frontend connects to backend at `http://localhost:5000`
- Backend connects to a **working PostgreSQL database** on Prisma Cloud
- JWT secrets are pre-configured for development

**Just clone and run!** 🎉

---

## 🎯 Usage

1. **Register/Login** - Create an account at http://localhost:5173
2. **Browse Catalog** - View DVDs with advanced filtering
3. **View Details** - Click any DVD for full information
4. **Manage Account** - Check rentals and update profile

---

## 🌐 Cross-Platform Support

This project works seamlessly on:
- ✅ **Windows** (PowerShell, CMD, Git Bash)
- ✅ **macOS** (Terminal, iTerm2)
- ✅ **Linux** (Bash, Zsh, Fish)

All scripts are written in Node.js for maximum compatibility.

---

## 🛠️ Development

### Frontend Development
```bash
cd Frontend/React
npm run dev
```
Runs at http://localhost:5173 with hot reload

### Backend Development
```bash
cd Backend
npm run dev
```
Runs at http://localhost:5000 with auto-restart
**[Quick Start Guide](docs/QUICKSTART.md)** - Detailed setup and features guide
- **[Setup Guide](docs/SETUP_GUIDE.md)** - Troubleshooting and tips
- **[Bash Scripts Guide](docs/BASH_SCRIPTS.md)** - Using shell scripts
- **[Cross-Platform Guide](docs/CROSS_PLATFORM.md)** - Platform compatibility notes
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Technical overview
- **[Implementation Details](docs/Implementation_V1.md)** - Origin
npm run prisma:studio  # Open database GUI
npm run prisma:push    # Apply schema changes
```

---

## 📚 Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** - Get started in 2 minutes
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Directory layout and architecture
- **[Organization Summary](docs/ORGANIZATION_SUMMARY.md)** - How the repo is organized

*Additional documentation available in the `/docs` folder*

---

## 🏗️ Architecture

- **Frontend**: React SPA with client-side routing
- **Backend**: RESTful API with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based stateless auth
- **Deployment Ready**: Can deploy to Vercel, Netlify, Railway, etc.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express, Prisma |
| Database | PostgreSQL (Prisma Cloud) |
| Auth | JWT, bcryptjs |
| Styling | CSS3, Custom themes |

---

## 🤝 Contributing

This is an educational project. Feel free to fork and customize!

---

## 📄 License

ISC - See [LICENSE](LICENSE) for details

---

## 🎓 Perfect For Learning

- React fundamentals and hooks
- RESTful API design
- Database modeling with Prisma
- JWT authentication
- Full-stack JavaScript development
- Deployment workflows

---

## 🆘 Need Help?

Run into issues? Try these:

```bash
# Verify your setup
npm run verify

# Reinstall dependencies
npm run setup

# Check Node.js version (need 18+)
node --versionour [Setup Guide](docs/
```

Still stuck? Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for troubleshooting.

---

**Made with ❤️ for education and learning**

🌟 If this helped you learn, consider starring the repo!
