# 📁 Project Structure

```
Video_Shoppe/
│
├── 📂 Backend/                      # Express.js API Server
│   ├── src/
│   │   ├── routes/
│   │   │   └── auth.js             # Authentication endpoints
│   │   └── index.js                # Server entry point
│   ├── prisma/
│   │   └── schema.prisma           # Database schema
│   ├── .env                        # Backend configuration ✅
│   ├── package.json                # Backend dependencies
│   └── README.md
│
├── 📂 Frontend/                     # React Application
│   └── React/
│       ├── components/             # React components
│       │   ├── Account.jsx
│       │   ├── Catalog.jsx
│       │   ├── DVDDetail.jsx
│       │   ├── Footer.jsx
│       │   ├── Hero.jsx
│       │   ├── Login.jsx
│       │   ├── Navbar.jsx
│       │   └── ProductList.jsx
│       ├── styles/                 # Component styles
│       │   ├── account.css
│       │   ├── catalog.css
│       │   ├── dvddetail.css
│       │   ├── footer.css
│       │   ├── hero.css
│       │   ├── login.css
│       │   └── navbar.css
│       ├── App.css
│       ├── App.jsx                 # Root component
│       ├── index.css
│       ├──  index.html
│       ├── main.jsx                # Entry point
│       ├── .env                    # Frontend configuration ✅
│       ├── package.json            # Frontend dependencies
│       ├── vite.config.js          # Vite configuration
│       └── README.md
│
├── 📂 scripts/                      # Automation Scripts
│   ├── setup.js                    # Node.js setup script (cross-platform)
│   ├── setup.sh                    # Bash setup script (Linux/macOS)
│   ├── setup.ps1                   # PowerShell setup script (Windows)
│   ├── verify.js                   # Node.js verification (cross-platform)
│   ├── verify.sh                   # Bash verification (Linux/macOS)
│   ├── verify.ps1                  # PowerShell verification (Windows)
│   └── start.sh                    # Quick start script (Linux/macOS)
│
├── 📂 docs/                         # Documentation
│   └── (Documentation files to be added)
│
├── 📂 Documents/                    # Project Planning Documents
│   ├── Requirements Document.docx
│   ├── Domain Analysis Document.docx
│   ├── Use Case Diagrams.pdf
│   ├── Sequence Diagrams.pdf
│   ├── Class Diagrams.pdf
│   └── ER Diagrams.pdf
│
├── 📂 node_modules/                 # Dependencies (auto-generated)
│
├── 📄 .gitignore                    # Git ignore rules
├── 📄 package.json                  # Root package configuration
├── 📄 package-lock.json             # Dependency lock file
└── 📄 README.md                     # Main documentation

```

## 📊 File Count by Type

| Category | Count | Description |
|----------|-------|-------------|
| **React Components** | 8 | UI components |
| **CSS Files** | 7 | Component styles |
| **API Routes** | 1 | Backend endpoints |
| **Setup Scripts** | 7 | Installation automation |
| **Config Files** | 5 | Environment & build configs |
| **Documentation** | 6+ | Project docs |

## 🎯 Key Directories

### `/Backend`
- Express.js server
- Prisma ORM setup
- JWT authentication
- RESTful API endpoints

### `/Frontend/React`
- Vite + React 18
- Client-side routing
- Component-based architecture
- Responsive CSS

### `/scripts`
- Cross-platform setup automation
- System verification
- Quick start helpers
- Platform-specific scripts (PS1, SH, JS)

### `/docs`
- Setup guides
- API documentation
- Architecture notes
- Troubleshooting

### `/Documents`
- Original project planning
- UML diagrams  
- Requirements docs
- Design specifications

## 📝 Important Files

| File | Purpose |
|------|---------|
| `package.json` | Root scripts and workspace config |
| `Frontend/React/.env` | API URL configuration |
| `Backend/.env` | Database & JWT configuration |
| `Backend/prisma/schema.prisma` | Database schema |
| `scripts/setup.js` | Main setup automation |
| `README.md` | Project overview |

## 🚀 Getting Started

1. **Clone the repository**
2. **Run setup**: `npm run setup`
3. **Start servers**: `npm start`
4. **Access app**: http://localhost:5173

## 📦 Dependencies Location

- **Root**: `concurrently` (for running multiple servers)
- **Frontend**: React, Vite, React Router
- **Backend**: Express, Prisma, JWT, bcryptjs

## 🔄 Workflow

```
User clones repo
      ↓
npm run setup (installs all dependencies)
      ↓
npm start (launches both servers)
      ↓
Frontend: localhost:5173
Backend: localhost:5000
```

## 🎨 Architecture Highlights

- **Separation of Concerns**: Frontend, Backend, Scripts, Docs
- **Cross-Platform**: Works on Windows, macOS, Linux
- **Pre-Configured**: Database and auth ready to use
- **Modern Stack**: Latest React, Vite, Express, Prisma
- **Clean Structure**: Organized folders and clear naming
