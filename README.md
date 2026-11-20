# CampusPulse — College Event Management (MERN)

A starter MERN application with **three modules**:
1. **Event Management** — admins create, edit, delete and publish events.
2. **Event Registration** — users browse events and register; duplicate registrations are prevented.
3. **Announcements & Dashboard** — admins publish announcements; dashboards show event/registration stats.

Includes separate **User Login** and **Admin Login**, role-based API protection, and user registration with name, phone number, gender, Gmail/email and password.

## Requirements
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

## 1. Backend setup
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Edit `server/.env` and set `MONGO_URI` and a long `JWT_SECRET`.

Create the first admin account using:
```bash
npm run seed:admin
```
The default seed credentials are read from `.env`:
- `ADMIN_EMAIL` (default `admin@gmail.com`)
- `ADMIN_PASSWORD` (default `Admin@12345`)
- `ADMIN_NAME` (default `Campus Admin`)

Change these values before using the app. The seed script will not overwrite an existing account.

## 2. Frontend setup
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown (usually http://localhost:5173).

## 3. Login
- User: register from the User Login screen, then sign in.
- Admin: use the seeded admin credentials and choose Admin Login.

## API overview
- `POST /api/auth/register`
- `POST /api/auth/login` (body includes `role: "user"` or `"admin"`)
- `GET /api/events`
- `POST /api/events` (admin)
- `PUT /api/events/:id` (admin)
- `DELETE /api/events/:id` (admin)
- `POST /api/events/:id/register` (user)
- `GET /api/registrations/mine` (user)
- `GET /api/registrations` (admin)
- `GET /api/announcements`
- `POST /api/announcements` (admin)
- `DELETE /api/announcements/:id` (admin)
- `GET /api/dashboard/stats` (admin)

## Notes
- This is a learning/project starter, not a production-hardened deployment.
- Add HTTPS, rate limiting, email verification, password reset, input validation, logging and stronger operational controls before production.
- Passwords are hashed with bcrypt; JWT secrets are loaded from environment variables.
