# 🎬 Video Shoppe - Quick Start Guide

Get up and running in under 2 minutes!

## ⚡ Super Quick Start

```bash
git clone <your-repo-url>
cd Video_Shoppe
npm run setup
npm start
```

Visit **http://localhost:5173** 🎉

---

## 📋 Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

**Check your versions:**
```bash
node --version   # Should be v18+
npm --version    # Should be v9+
```

---

## 🔧 Detailed Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd Video_Shoppe
```

### Step 2: Install Dependencies

**Option A: Cross-Platform (Recommended)**
```bash
npm run setup
```

**Option B: Platform-Specific**

**Windows (PowerShell):**
```powershell
.\scripts\setup.ps1
```

**Linux/macOS (Bash):**
```bash
chmod +x scripts/*.sh
./scripts/setup.sh
# or
npm run setup:sh
```

### Step 3: Verify Installation

```bash
npm run verify
```

You should see all components marked with ✓

### Step 4: Start the Application

```bash
npm start
```

This starts both:
- **Frontend** on http://localhost:5173
- **Backend** on http://localhost:5000

---

## 🎮 Using the Application

### 1. Register an Account
1. Open http://localhost:5173
2. Click "Create Account" tab
3. Fill in your details
4. Click "Create Account"

### 2. Browse DVDs
- Click "DVD Catalog" in navigation
- Use search and filters
- Toggle between Rent/Buy mode

### 3. View DVD Details
- Click any DVD card
- See full information
- Check availability and pricing

### 4. Manage Your Account
- Click "Account" in navigation
- View profile and stats
- Track rentals (coming soon)

---

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Install all dependencies |
| `npm start` | Start both servers |
| `npm run frontend` | Start frontend only |
| `npm run backend` | Start backend only |
| `npm run verify` | Check installation |
| `npm run prisma:studio` | Open database GUI |

---

## 🌐 Platform-Specific Commands

### Windows
```bash
npm run setup          # Use Node.js script
.\scripts\setup.ps1    # Or use PowerShell directly
```

### Linux/macOS
```bash
npm run setup          # Use Node.js script
npm run setup:sh       # Or use bash script
chmod +x scripts/*.sh  # Make scripts executable
./scripts/setup.sh     # Run directly
```

---

## 🔍 Troubleshooting

### Port Already in Use

**Backend (5000):**
```bash
# Find and kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS:
lsof -ti:5000 | xargs kill -9
```

**Frontend (5173):**
```bash
# Find and kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/macOS:
lsof -ti:5173 | xargs kill -9
```

### Dependencies Won't Install

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules Frontend/React/node_modules Backend/node_modules

# Reinstall
npm run setup
```

### Database Connection Issues

```bash
# Regenerate Prisma client
cd Backend
npx prisma generate
npx prisma db push
```

### Script Permission Errors (Linux/macOS)

```bash
# Make all scripts executable
chmod +x scripts/*.sh

# Or individually
chmod +x scripts/setup.sh
chmod +x scripts/verify.sh
chmod +x scripts/start.sh
```

---

## 🚀 Next Steps

After successful setup:

1. ✅ **Explore the UI** - Browse the catalog and features
2. ✅ **Check the Code** - Review components and API routes
3. ✅ **Read the Docs** - See `/docs` folder for more guides
4. ✅ **Customize** - Modify styles, add features
5. ✅ **Deploy** - Ready for Vercel, Netlify, Railway

---

## 📚 Additional Resources

- [Project Structure](PROJECT_STRUCTURE.md) - Directory layout
- [Setup Guide](SETUP_GUIDE.md) - Detailed troubleshooting
- [Bash Scripts](BASH_SCRIPTS.md) - Shell script usage
- [Cross-Platform Guide](CROSS_PLATFORM.md) - Platform compatibility

---

## 💡 Tips

- Use `npm run verify` anytime to check your setup
- Both `.env` files are pre-configured and working
- Database is already set up on Prisma Cloud
- No additional configuration needed!

---

## 🆘 Still Having Issues?

1. **Check Node.js version**: `node --version` (need v18+)
2. **Run verification**: `npm run verify`
3. **Check for errors**: Look at terminal output
4. **Reinstall**: `npm run setup` again
5. **Check documentation**: See `docs/SETUP_GUIDE.md`

---

**Happy coding! 🎬**
