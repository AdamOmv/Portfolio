# Portfolio — Adam Omv

Personal portfolio website built with React and Node.js, featuring a public showcase and a private admin back-office to manage content dynamically.

**Live:** [adomv.com](https://adomv.com)

---

## Overview

The site is split into two parts:

- **Public front page** — presents projects, skills, and a contact section
- **Admin back-office** (`/admin`) — protected by JWT authentication, allows managing portfolio content without touching the code

A built-in timer page (`/minuteur`) is also included as a side utility.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, JWT auth |
| Database | MySQL |
| Infrastructure | Docker, Nginx reverse proxy |

---

## Architecture

```
adomv.com/          → React frontend (public portfolio + /admin)
adomv.com/api/      → Express REST API
adomv.com/uploads/  → Media files served by the backend
```

```
portfolio_adomv/
├── frontend/       # React app (public pages + admin dashboard)
├── backend/        # Express API + JWT auth + file uploads + MySQL migrations
├── deploy/         # Nginx host config (reverse proxy)
└── docker-compose.yml
```

---

## Running with Docker

```bash
# 1. Copy the example env file
cp .env.docker.example .env

# 2. Fill in the required values
#    DB_PASSWORD, DB_ROOT_PASSWORD, JWT_SECRET, ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD

# 3. Start the stack
docker compose up --build -d
```

Services started:
- Frontend → `http://localhost:8081`
- Backend → proxied through the frontend container
- MySQL → persistent Docker volume

Database migrations and the first admin account are created automatically on backend startup.

---

## Running without Docker

```bash
cd backend
npm install
npm run migrate
npm run create-admin -- admin admin@adomv.com your_password
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

---

## Useful commands

```bash
docker compose logs -f    # stream logs
docker compose ps         # check container status
docker compose down       # stop the stack
```

---

## License

This project is personal and not open for contributions, but feel free to browse the code for inspiration.
