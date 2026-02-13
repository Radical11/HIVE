# Hive — The Command Center for Your Career

> The definitive social arena for developers. Track your coding streaks, share your engineering journey, and connect with serious builders.

## 🏗️ Architecture

| Layer | Tech | Directory |
|-------|------|-----------|
| **Frontend** | Next.js 16, React 19, Tailwind v4, Framer Motion | `web/` |
| **Backend** | Django 5, DRF, Firebase Admin SDK | `backend/` |
| **Auth** | Firebase Authentication (Google + GitHub OAuth) | Both |
| **Database** | SQLite (dev) → PostgreSQL (prod) | `backend/` |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Firebase project (with Google & GitHub auth providers enabled)

### Frontend

```bash
cd web
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API available at [http://localhost:8000](http://localhost:8000)

## 📁 Project Structure

```
web/
  src/
    app/
      page.tsx          # Landing page
      login/            # Firebase auth (Google + GitHub)
      register/         # Registration page
      feed/             # Pulse Feed — social activity stream
      arena/            # Arena — Codeforces integration + challenges
      forum/            # Neural Link — threaded discussions
      profile/          # Engineering profile
    contexts/
      AuthContext.tsx    # Firebase auth context provider
    lib/
      firebase.ts       # Firebase client SDK config
      api.ts            # API client with auto Bearer token

backend/
  config/               # Django settings, URLs
  users/                # User model, Firebase auth backend, profile API
  feed/                 # Posts, reactions, comments API
  arena/                # Codeforces integration, challenges, leaderboard
```

## 🔑 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/users/me/` | GET, PATCH | ✅ | Current user profile |
| `/api/users/<id>/` | GET | ❌ | Public profile |
| `/api/feed/` | GET, POST | ✅ | Post feed (paginated) |
| `/api/feed/<id>/react/` | POST | ✅ | Toggle reaction |
| `/api/feed/<id>/comment/` | POST | ✅ | Add comment |
| `/api/arena/link-codeforces/` | POST | ✅ | Link CF handle |
| `/api/arena/cf-profile/` | GET | ✅ | Get linked CF profile |
| `/api/arena/cf-sync/` | POST | ✅ | Refresh CF stats |
| `/api/arena/leaderboard/` | GET | ❌ | Ranked leaderboard |
| `/api/arena/challenges/` | GET | ❌ | Internal challenges |

## 🎨 Design System

**Neon-Noir** — Dark mode default with glassmorphism, cyan-purple gradients, and smooth Framer Motion animations.

## 📄 License

MIT
