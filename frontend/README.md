# Mini Service Request Board - Frontend

A modern Next.js frontend for the Mini Service Request Board service. Clean, responsive, and production-ready.

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:3000`

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Language:** JavaScript (ES6+)

## Features

- ✓ List all service requests with filtering
- ✓ Create new service requests with validation
- ✓ View detailed request information
- ✓ Update request status
- ✓ Delete requests
- ✓ Responsive mobile-first design
- ✓ Loading and error states
- ✓ Clean, beginner-friendly code

## Pages & Routes

| Route        | Description                       |
| ------------ | --------------------------------- |
| `/`          | Home - List all jobs with filters |
| `/jobs/new`  | Create new service request        |
| `/jobs/[id]` | View/edit/delete specific job     |

## Configuration

### Backend URL

Edit `.env.local` to point to your backend:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## Project Structure

```
app/
├── layout.js           # Root layout with navigation
├── page.js             # Home page
├── globals.css         # Global styles
└── jobs/
    ├── new/page.js     # New job form
    └── [id]/page.js    # Job detail page
components/
├── JobCard.js          # Job listing card
├── StatusBadge.js      # Status indicator
└── JobForm.js          # Create job form
lib/
└── api.js              # Axios API wrapper
```

## Components

- **JobCard:** Displays job summary as clickable card
- **StatusBadge:** Color-coded status indicator
- **JobForm:** Complete job creation form with validation

## API Integration

All backend endpoints are called via `lib/api.js`:

- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job
- `PATCH /api/jobs/:id` - Update job status
- `DELETE /api/jobs/:id` - Delete job

## For More Details

See [FRONTEND.md](./FRONTEND.md) for comprehensive documentation including:

- Component details
- API integration guide
- Styling conventions
- Troubleshooting tips
- Development best practices
