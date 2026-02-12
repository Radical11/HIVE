# Hive - The Command Center for Your Career

Hive is a high-fidelity social arena for developers, combining professional networking, activity tracking, and collaborative tools into a single, gamified platform.

## Architecture

- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion
- **Backend**: Django, Django REST Framework, Channels
- **Database**: PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL

### Setup

1.  **Frontend**:
    ```bash
    cd web
    npm install
    npm run dev
    ```

2.  **Backend**:
    ```bash
    cd backend
    python -m venv venv
    .\venv\Scripts\Activate
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```

## Project Status

- [x] Initial Planning (PRD)
- [ ] Project Setup (In Progress)
- [ ] Core Features Implementation
