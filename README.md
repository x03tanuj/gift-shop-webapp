# Local Indian Gift Shop (Phase 0)

This repository contains the Phase 0 foundational scaffolding for a local Indian gift shop web application. It consists of three independently runnable units:

- **`server/`**: Node.js + Express backend with MongoDB connection (via Mongoose), CORS, error handling, and health check route.
- **`client/`**: Customer-facing React storefront built with Vite and React Router.
- **`admin/`**: Store administration console built with Vite and React Router.

---

## Repository Structure

```
projectECommerce/
├── client/              # Customer React app (Vite) -> http://localhost:5173
├── admin/               # Admin React app (Vite)    -> http://localhost:5174
├── server/              # Express API server        -> http://localhost:5000
├── .gitignore           # Ignores node_modules, .env, dist/build, OS files
└── README.md            # Setup, execution instructions, and environment docs
```

---

## Port Allocation

| Application | Technology | Default Port | Local URL |
| :--- | :--- | :--- | :--- |
| **Server** | Node.js / Express | `5000` | `http://localhost:5000` |
| **Client** | React / Vite | `5173` | `http://localhost:5173` |
| **Admin** | React / Vite | `5174` | `http://localhost:5174` |

---

## Environment Variables Configuration

Do not commit real `.env` files to git. Each sub-project provides a `.env.example` template. Before starting each service, copy `.env.example` to `.env`.

### 1. Server Environment (`server/.env.example`)
```env
# Port on which the Express server listens
PORT=5000

# Environment mode ('development' enables morgan request logging)
NODE_ENV=development

# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/gift_shop

# CORS allowed frontend origins
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

> **Note on MongoDB**: If MongoDB is not running locally, the server logs a warning and continues running in database-offline mode. It will **not** crash or exit.

### 2. Client Environment (`client/.env.example`)
```env
# Port on which the Vite dev server listens
PORT=5173

# Base URL pointing to the Express backend API
VITE_API_URL=http://localhost:5000/api
```

### 3. Admin Environment (`admin/.env.example`)
```env
# Port on which the Vite dev server listens
PORT=5174

# Base URL pointing to the Express backend API
VITE_API_URL=http://localhost:5000/api
```

---

## Getting Started (Step-by-Step)

Prerequisites:
- [Node.js](https://nodejs.org/) (v18 or higher; v20+ recommended)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Start Order

Always start the backend server first so that both frontend apps can immediately verify health connectivity upon launch.

```
Order: 1. Server  ──>  2. Client  ──>  3. Admin
```

---

### Step 1: Start the Backend Server

Open a new terminal tab/window:

```bash
cd server
npm install
cp .env.example .env

# Run in development mode (with hot-reloading via nodemon):
npm run dev

# Or run standard start:
npm start
```

**Verification:**
Visit `http://localhost:5000/api/health` in your browser or run:
```bash
curl http://localhost:5000/api/health
# Expected output: {"status":"ok"}
```

---

### Step 2: Start the Customer Client App

Open a second terminal tab/window:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

**Verification:**
Open `http://localhost:5173` in your browser. You will see:
- Storefront header: `🏪 Indian Gift Shop — Customer App`
- Backend Health Check Status: `Backend Online (Status: ok)`
- Raw JSON response displayed in a code block.

---

### Step 3: Start the Admin App

Open a third terminal tab/window:

```bash
cd admin
npm install
cp .env.example .env
npm run dev
```

**Verification:**
Open `http://localhost:5174` in your browser. You will see:
- Admin header: `⚙️ Indian Gift Shop — Admin Console`
- Placeholder Sign In form
- Backend Health Check Status: `Server Online (Status: ok)`

---

## Tooling & Quality Checks

### Linting & Formatting
Both `client/` and `admin/` are configured with ESLint 9 (flat config) and Prettier:

```bash
# In client/ or admin/:
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
npm run build     # Validate production build
```

---

## Scope & Next Steps

This repository is strictly scaffolded for **Phase 0**.
- **Excluded**: Product, category, cart, order, and user models; authentication tokens/sessions; image storage; UI styling libraries.
- **Included**: Clean MVC backend skeleton (`src/models/`, `src/routes/`, `src/controllers/`, `src/middleware/`, `src/config/`, `src/utils/`), independent client & admin Vite projects, centralized error handling, and end-to-end health-check verification.
