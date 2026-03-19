# Songbook

A full-stack web application for music industry professionals to manage songs, collaborators, and royalty split sheets. Built as a portfolio project demonstrating real-world full-stack development with Go and React.

**Live Demo:** _coming soon_
**Demo account:** `demo@songbook.app` / `demo1234`

---

## Features

- **Authentication** — JWT-based register, login, and change password. All data is user-scoped.
- **Song Management** — Create, edit, and delete songs with metadata (genre, BPM, key, date written).
- **Collaborators** — Add and manage collaborators per song with PRO affiliation, IPI number, and publisher info.
- **Split Sheets** — Writer, publisher, and master royalty splits with real-time validation that totals must equal 100%.
- **Inline Split Editing** — Edit individual collaborator splits directly from the song detail page.
- **PDF Generation** — Generate modular split sheet PDFs with selectable sections (Writer / Publishing / Master).
- **Demo Account** — Pre-seeded account so anyone can explore the app without registering.

---

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite 8
- TanStack Query (server state management)
- React Router v7
- Tailwind CSS v4
- Axios
- @react-pdf/renderer (PDF generation)
- Sonner (toast notifications)

**Backend**
- Go 1.24 + Gin
- PostgreSQL (hosted on Neon)
- pgx v5 (database driver)
- golang-jwt/jwt v5
- bcrypt (password hashing)

---

## Project Structure

```
songbook-web-app/
├── backend/
│   ├── cmd/api/          # Entry point
│   └── internal/
│       ├── handlers/     # HTTP handlers
│       ├── services/     # Business logic
│       ├── repositories/ # Database queries
│       ├── models/       # Structs and DTOs
│       ├── middleware/   # JWT auth middleware
│       └── routes/       # Route registration
└── frontend/
    └── src/
        ├── api/          # Axios API layer
        ├── components/   # Reusable UI components
        ├── context/      # React context (Auth)
        ├── pages/        # Page components
        └── types/        # TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- [Go 1.21+](https://go.dev/dl/)
- [Node.js 18+](https://nodejs.org/)
- A [Neon](https://neon.tech) PostgreSQL database (or local PostgreSQL)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/songbook-web-app.git
cd songbook-web-app
```

### 2. Install dependencies

```bash
# Root (concurrently)
npm install

# Frontend
cd frontend && npm install && cd ..
```

### 3. Configure environment variables

**Backend** — create `backend/.env`:

```env
DATABASE_URL=your_postgres_connection_string
PORT=8080
JWT_SECRET=your_secret_key
```

**Frontend** — create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
```

### 4. Run the app

```bash
npm run dev
```

This starts both the Go backend (port 8080) and the Vite dev server (port 5173) concurrently.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login |
| PUT | `/auth/change-password` | Change password |
| GET | `/songs` | List user's songs |
| POST | `/songs` | Create song |
| GET | `/songs/id/:id` | Get song |
| PUT | `/songs/id/:id` | Update song |
| DELETE | `/songs/id/:id` | Delete song |
| GET | `/songs/:id/collaborators` | List collaborators |
| POST | `/songs/:id/collaborators` | Add collaborator |
| PUT | `/songs/:id/collaborators/:cid` | Update collaborator |
| DELETE | `/songs/:id/collaborators/:cid` | Remove collaborator |
| GET | `/songs/:id/splits/validate` | Validate split totals |
| GET | `/songs/:id/split-sheet` | Full split sheet data |

---

## Architecture Notes

- **Layered backend** — handlers → services → repositories. Business logic lives in the service layer; handlers only deal with HTTP concerns.
- **User-scoped data** — every database query filters by `user_id` extracted from the JWT. A user can never access another user's songs.
- **Split validation** — enforced in both the service layer (on write) and the frontend (on display). The backend validates that writer, publisher, and master splits each total exactly 100% across all collaborators.
- **Shared Axios client** — a single Axios instance with a request interceptor attaches the JWT to every outgoing request.
- **PDF generation** — handled entirely client-side using `@react-pdf/renderer`. The PDF page is rendered outside the main layout to allow full-screen display.
