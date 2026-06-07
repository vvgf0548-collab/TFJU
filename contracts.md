# API Contracts - Liwa Hamad Security Gate

## Auth (JWT)
- `POST /api/auth/login` - Smart login. Body: `{name, militaryNumber}`. Existing user → login. New → register as `pending`. Special: `00000` → admin. Returns `{access_token, user}`
- `GET /api/auth/me` - Current user (requires Bearer token)

## Users (admin only for management)
- `GET /api/users` - List all
- `GET /api/users/pending` - List pending approvals
- `POST /api/users/{id}/approve` - Approve user (admin)
- `POST /api/users/{id}/reject` - Reject/delete (admin)
- `PATCH /api/users/{id}` - Update user

## Resources (CRUD)
- `/api/announcements` GET, POST (admin)
- `/api/violations` GET, POST, PATCH (status)
- `/api/requests` GET (mine + admin all), POST, PATCH (approve/reject)
- `/api/reports` GET, POST
- `/api/operations` GET, POST
- `/api/attendance/checkin` POST - today's checkin for current user
- `/api/attendance/checkout` POST
- `/api/attendance/today` GET - today's records
- `/api/attendance/history` GET - aggregated stats per day
- `/api/promotions` GET
- `/api/medals` GET
- `/api/stats/dashboard` GET - aggregated stats
- `/api/support/ticket` POST

## Frontend Integration
- Created `src/api.js` with axios instance + Bearer token interceptor.
- `App.js` AuthContext fetches `/api/auth/me` on mount instead of localStorage user.
- All components replace `mock.js` imports with API hooks/calls.
- Seed admin user `12345` (Ahmed Otaibi) auto-created on backend startup.

## Mock Data → Backend
- `mockUsers` → `users` collection (with hashed records, admin seeded)
- `mockViolations` → `violations` collection
- `mockRequests` → `requests` collection
- `mockReports` → `reports` collection
- `mockOperations` → `operations` collection
- `mockAnnouncements` → `announcements` collection
- `mockMembers` → derived from `users` collection
- `mockAttendance` → `attendance` collection (aggregated)
- `mockPromotions`, `mockMedals` → seeded in DB
