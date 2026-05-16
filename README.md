# Mini Service Request Board

A complete full-stack application for managing service requests efficiently. Built with Express, MongoDB, Next.js, and Tailwind CSS.

## 🎯 Overview

This is a technical assessment project that demonstrates:

- RESTful API design with Node.js/Express
- Database modeling with MongoDB/Mongoose
- Modern frontend development with Next.js
- Form validation and error handling
- Responsive UI design with Tailwind CSS
- Clean, production-ready code

## 📦 Tech Stack

### Backend

- Node.js + Express
- MongoDB + Mongoose
- CORS, Morgan logging, dotenv

### Frontend

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Axios

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 4.4+ (local or Atlas)

### 1. Start Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Open Application

Visit **http://localhost:3000** in your browser

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend setup and usage
- **[frontend/FRONTEND.md](./frontend/FRONTEND.md)** - Frontend components and styling

## ✨ Features

### Home Page

- 📋 View all service requests
- 🔍 Filter by category and status
- 🎨 Responsive card layout
- ➕ Create new request button

### Create Request

- 📝 Form with validation
- ✅ Email validation
- 💬 Real-time error messages
- 🔄 Auto-redirect on success

### Request Details

- 📖 Full request information
- 🔄 Update status dropdown
- 🗑️ Delete with confirmation
- 📱 Responsive layout

## 📋 API Endpoints

```
GET    /api/jobs                 # List all jobs
GET    /api/jobs/:id            # Get single job
POST   /api/jobs                # Create job
PATCH  /api/jobs/:id            # Update status
DELETE /api/jobs/:id            # Delete job
```

Optional filters on GET /api/jobs:

- `?category=Plumbing`
- `?status=Open`

## 🗄️ Project Structure

```
globaltna-service-board/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── models/JobRequest.js
│   │   ├── controllers/jobController.js
│   │   ├── routes/jobRoutes.js
│   │   └── middleware/errorHandler.js
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── jobs/
│   │       ├── new/page.js
│   │       └── [id]/page.js
│   ├── components/
│   │   ├── JobCard.js
│   │   ├── StatusBadge.js
│   │   └── JobForm.js
│   ├── lib/api.js
│   ├── package.json
│   └── README.md
├── SETUP_GUIDE.md
└── README.md (this file)
```

## 🔧 Configuration

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-board
NODE_ENV=development
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Using Browser

1. Navigate to http://localhost:3000
2. Create, view, update, and delete requests
3. Test filters and sorting
4. Verify validation errors

### Using cURL

```bash
# List jobs
curl http://localhost:5000/api/jobs

# Create job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test description","category":"Plumbing"}'

# Get single job
curl http://localhost:5000/api/jobs/[JOB_ID]

# Update status
curl -X PATCH http://localhost:5000/api/jobs/[JOB_ID] \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}'

# Delete job
curl -X DELETE http://localhost:5000/api/jobs/[JOB_ID]
```

## 📊 Data Model

### JobRequest

| Field        | Type   | Validation                                                     |
| ------------ | ------ | -------------------------------------------------------------- |
| title        | String | Required, 3+ chars                                             |
| description  | String | Required, 10+ chars                                            |
| category     | String | Required, enum: Plumbing, Electrical, Painting, Joinery, Other |
| location     | String | Optional                                                       |
| contactName  | String | Optional                                                       |
| contactEmail | String | Optional, valid email                                          |
| status       | String | Enum: Open (default), In Progress, Closed                      |
| createdAt    | Date   | Auto-set, immutable                                            |
| updatedAt    | Date   | Auto-updated                                                   |

## 🎨 UI/UX

- **Responsive Design:** Mobile-first with breakpoints for tablets and desktops
- **Color Scheme:**
  - Primary: Blue (#2563eb)
  - Success: Green (#10b981)
  - Error: Red (#ef4444)
  - Neutral: Gray
- **Components:** Reusable, self-contained, easy to modify
- **Accessibility:** Proper labels, semantic HTML, keyboard navigation

## 🚨 Error Handling

### Backend

- HTTP status codes (200, 201, 400, 404, 409, 500)
- Mongoose validation errors
- Cast error handling
- Duplicate key detection

### Frontend

- Loading states with spinner
- Error alerts with messages
- Form validation with field-level errors
- Retry capability

## 📖 Code Quality

- ✓ Clean, readable code
- ✓ Proper error handling
- ✓ Responsive design
- ✓ Modular components
- ✓ Environment configuration
- ✓ Production-ready
- ✓ Beginner-friendly documentation

## 🐛 Troubleshooting

**MongoDB connection fails:**

- Ensure MongoDB is running
- Check MONGODB_URI in .env

**CORS errors:**

- Backend must be running on port 5000
- Check NEXT_PUBLIC_API_URL in frontend

**Port already in use:**

- Kill process or change PORT in .env

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting.

## 📚 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 🎓 For Interviewers

This project demonstrates:

- Full-stack development (frontend + backend)
- REST API design principles
- Database design and Mongoose modeling
- React component architecture
- Form validation and error handling
- Responsive UI design
- Clean code practices
- Production-ready setup

## 📄 License

ISC

---

**Ready to run. Clean code. Production-ready.** ✨

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
