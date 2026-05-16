# Mini Service Request Board - Complete Setup Guide

A full-stack service request management system with Node.js Express backend and Next.js frontend.

## 📁 Project Structure

```
globaltna-service-board/
├── backend/                    # Express REST API
│   ├── src/
│   │   ├── server.js          # Express app
│   │   ├── models/
│   │   │   └── JobRequest.js  # Mongoose schema
│   │   ├── controllers/
│   │   │   └── jobController.js
│   │   ├── routes/
│   │   │   └── jobRoutes.js
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── package.json
│   ├── .env.example
│   └── README.md              # Backend docs
│
└── frontend/                   # Next.js App Router
    ├── app/
    │   ├── layout.js          # Root layout
    │   ├── page.js            # Home page
    │   └── jobs/
    │       ├── new/page.js    # Create form
    │       └── [id]/page.js   # Detail page
    ├── components/
    │   ├── JobCard.js
    │   ├── StatusBadge.js
    │   └── JobForm.js
    ├── lib/
    │   └── api.js             # Axios wrapper
    ├── package.json
    ├── .env.local
    └── README.md              # Frontend docs
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 4.4+ (local or MongoDB Atlas)
- npm or yarn

### Step 1: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection
# MONGODB_URI=mongodb://localhost:27017/service-board
# NODE_ENV=development
# PORT=5000
```

**Start backend server:**

```bash
npm run dev
```

Expected output:

```
✓ Connected to MongoDB
✓ Server running on http://localhost:5000
```

### Step 2: Setup Frontend

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# .env.local is already configured
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Start frontend server:**

```bash
npm run dev
```

Expected output:

```
> frontend@0.1.0 dev
> next dev

  ▲ Next.js 16.2.6
  - Local:        http://localhost:3000
```

### Step 3: Access Application

Open browser and visit: **http://localhost:3000**

## 📋 Database Setup

### Local MongoDB

```bash
# If you have MongoDB installed locally
mongod

# Then run backend with MONGODB_URI=mongodb://localhost:27017/service-board
```

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` in backend:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/service-board
```

## 📚 API Endpoints

All endpoints return JSON with `{ success, data/error, count }` structure.

### Jobs

| Method | Endpoint        | Description                                |
| ------ | --------------- | ------------------------------------------ |
| GET    | `/api/jobs`     | List jobs (supports ?category=X &status=Y) |
| GET    | `/api/jobs/:id` | Get single job                             |
| POST   | `/api/jobs`     | Create job                                 |
| PATCH  | `/api/jobs/:id` | Update job status                          |
| DELETE | `/api/jobs/:id` | Delete job                                 |

### Example Requests

**List all open Plumbing jobs:**

```bash
curl "http://localhost:5000/api/jobs?category=Plumbing&status=Open"
```

**Create job:**

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix leaking tap",
    "description": "Bathroom tap is leaking and needs repair",
    "category": "Plumbing",
    "location": "Bathroom",
    "contactName": "John",
    "contactEmail": "john@example.com"
  }'
```

**Update status:**

```bash
curl -X PATCH http://localhost:5000/api/jobs/[JOB_ID] \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'
```

## 🎨 Frontend Features

### Home Page (`/`)

- View all service requests
- Filter by category and status
- Click card to view details
- Button to create new request
- Responsive grid layout

### New Request Page (`/jobs/new`)

- Form with validation
- Required fields: title, description, category
- Optional fields: location, contact name/email
- Email validation
- Success/error messages
- Auto-redirect after creation

### Detail Page (`/jobs/[id]`)

- Full job information
- Update status via dropdown
- Delete button with confirmation
- Created date display
- Contact email link

### Components

- **JobCard:** Clickable card with job summary
- **StatusBadge:** Color-coded status indicator
- **JobForm:** Reusable form component

## 🔒 Data Model

### JobRequest Schema

```javascript
{
  _id: ObjectId,
  title: String (required, 3-255 chars),
  description: String (required, 10+ chars),
  category: String (enum: Plumbing, Electrical, Painting, Joinery, Other),
  location: String,
  contactName: String,
  contactEmail: String (valid email),
  status: String (enum: Open, In Progress, Closed, default: Open),
  createdAt: Date (immutable),
  updatedAt: Date (auto)
}
```

## 🧪 Testing

### Manual Testing with Browser

1. Create a job
2. Verify it appears on home page
3. Filter by category/status
4. Click card to view details
5. Update status
6. Delete job

### Manual Testing with cURL

See API Endpoints section above for example commands.

### Browser DevTools

1. Open F12 Developer Tools
2. Go to Network tab
3. Perform actions and observe API calls
4. Check Console tab for errors

## 📦 Dependencies

### Backend

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin resource sharing
- `morgan` - HTTP request logger
- `dotenv` - Environment variables
- `nodemon` - Development auto-reload (dev)

### Frontend

- `next` - React framework
- `react` - UI library
- `tailwindcss` - CSS utility framework
- `axios` - HTTP client
- `typescript` - Type safety (dev)
- `eslint` - Code linting (dev)

## 🚨 Troubleshooting

### "Cannot connect to MongoDB"

- Check MongoDB is running: `mongod`
- Verify MONGODB_URI in `.env`
- Check connection string format

### "CORS error" in frontend

- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in `.env.local`
- Verify CORS middleware in backend/src/server.js

### "Module not found" errors

- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Restart dev server

### "Port 3000/5000 already in use"

```bash
# Kill process on port (Unix/Mac)
lsof -i :3000
kill -9 <PID>

# Or on Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### API calls return 404

- Verify backend routes are correct
- Check job IDs are valid ObjectIds
- Test with cURL first

## 🔄 Development Workflow

1. **Make backend changes:**
   - Nodemon auto-reloads (npm run dev)
   - Check console for errors

2. **Make frontend changes:**
   - Next.js auto-reloads (npm run dev)
   - Fast Refresh updates components

3. **Test:**
   - Open http://localhost:3000
   - Use DevTools Network tab
   - Check both console tabs (backend & frontend)

## 📝 Code Style

- **Backend:** CommonJS, modular structure, clear comments
- **Frontend:** React hooks, client-side rendering, Tailwind CSS
- **Both:** Consistent naming, error handling, responsive design

## 📖 Additional Documentation

- [Backend README](./backend/README.md) - API details, setup
- [Frontend README](./frontend/README.md) - UI details, setup
- [Frontend FRONTEND.md](./frontend/FRONTEND.md) - Component docs, styling

## 🎓 Learning Path

1. Start with backend API calls using cURL
2. Explore MongoDB collections
3. Visit frontend in browser
4. Read component code
5. Modify and test changes
6. Deploy to production

## 🐛 Debugging Tips

### Backend Debugging

```javascript
// Add logs to trace requests
console.log("Request received:", req.body);
console.log("Filtering by:", filter);
```

### Frontend Debugging

```javascript
// Check API calls
console.log("Fetching jobs with filters:", filters);
// Check component rendering
console.log("Jobs state:", jobs);
```

### Browser DevTools

- **Network tab:** See all API requests/responses
- **Console tab:** Check for errors
- **Debugger tab:** Set breakpoints

## 🚀 Production Deployment

### Backend (Example: Heroku)

```bash
# Create .env with production values
# Deploy with git
```

### Frontend (Example: Vercel)

```bash
# Connect GitHub repository
# Vercel auto-deploys on push
# Set environment variables in dashboard
```

## 📧 Support

For detailed documentation:

- Backend: See [backend/README.md](./backend/README.md)
- Frontend: See [frontend/README.md](./frontend/README.md)

---

**Built for technical assessments and learning. Clean, simple, production-ready.** ✨
