# CollabBoard API (Milestone 2 — Working REST API)

Express + JWT REST API for CollabBoard. Data is currently **in-memory**
(seeded with the same demo data the Stage 1 frontend used) — MongoDB via
Mongoose replaces this in Milestone 3 without changing the API shape.

## Run it

```bash
cd server
npm install
npm run dev        # nodemon, restarts on file changes
# or: npm start
```

Server listens on `http://localhost:4000` by default (see `.env`).

## Demo login

```
email: student@collabboard.com
password: password123
```

## API contract

All endpoints are prefixed with `/api`. Protected endpoints require:

```
Authorization: Bearer <token>
```

### Auth

| Method | Path | Body | Response | Notes |
|---|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | `201 { user, token }` | password ≥ 8 chars, email must be unique |
| POST | `/api/auth/login` | `{ email, password }` | `200 { user, token }` | `401` on bad credentials |
| GET | `/api/auth/me` | — | `200 { user }` | requires auth |

`user` shape: `{ id, name, email, bio, avatarUrl }` (password never returned).

### Boards (all require auth)

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/api/boards` | — | `200 { boards: [...] }` |
| POST | `/api/boards` | `{ title }` | `201 { board }` |
| PATCH | `/api/boards/:id` | `{ title }` | `200 { board }` |
| DELETE | `/api/boards/:id` | — | `204` |

`board` shape: `{ id, title }`.

### Tasks (all require auth)

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/api/tasks?boardId=b1` | — | `200 { tasks: [...] }` (omit `boardId` for all tasks) |
| POST | `/api/tasks` | `{ boardId, title, description, status, assignedTo }` | `201 { task }` |
| PATCH | `/api/tasks/:id` | any of `{ title, description, status, assignedTo }` | `200 { task }` |
| DELETE | `/api/tasks/:id` | — | `204` |

`task` shape: `{ id, boardId, title, description, status, assignedTo }`.
`status` must be one of `todo`, `doing`, `done`.

### Users (all require auth)

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/api/users/me` | — | `200 { user }` |
| PATCH | `/api/users/me` | any of `{ name, bio }` | `200 { user }` |
| POST | `/api/users/me/avatar` | multipart form, field `avatar` (PNG/JPEG/WEBP, ≤3MB) | `200 { user }` |

Uploaded avatars are saved to `server/uploads/avatars/` and served statically
at `/uploads/avatars/<filename>` (not under `/api`). `avatarUrl` on the user
is a relative path — the frontend resolves it against the API's origin.

### Errors

Errors return `{ message: string }` with an appropriate status code
(`400` validation, `401` unauthenticated, `404` not found, `409` conflict,
`500` server error).

## Project structure

```
server/
├── src/
│   ├── app.js              Express app (middleware, route mounting)
│   ├── server.js           Entry point
│   ├── routes/             authRoutes, boardRoutes, taskRoutes, userRoutes
│   ├── controllers/        request handling + validation
│   ├── middleware/         requireAuth (JWT verification), avatarUpload (multer)
│   ├── data/store.js       in-memory data (→ MongoDB in Milestone 3)
│   └── utils/               token.js (JWT), publicUser.js (safe user shape)
├── uploads/avatars/         uploaded profile photos, served statically
├── CollabBoard.postman_collection.json
└── .env                     PORT, JWT_SECRET, CLIENT_ORIGIN
```
