# Mini Service Request Board - Frontend

A modern, clean Next.js frontend for managing service requests. Built with React, Tailwind CSS, and Axios.

## Features

- ✓ Next.js 16 with App Router
- ✓ Clean, responsive Tailwind CSS UI
- ✓ Real-time filters by category and status
- ✓ Form validation with error messages
- ✓ Loading and error states
- ✓ Axios for API communication
- ✓ Mobile-first design
- ✓ Beginner-friendly code

## Prerequisites

- Node.js 18+
- Backend server running (see backend README)
- npm or yarn

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Environment Setup:**

The `.env.local` file is already configured:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Update if your backend runs on a different URL.

## Running the Frontend

### Development mode:

```bash
npm run dev
```

Frontend starts on `http://localhost:3000`

### Production build:

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.js              # Root layout with navbar
│   ├── page.js                # Home page - list jobs
│   ├── globals.css            # Global styles
│   └── jobs/
│       ├── new/
│       │   └── page.js        # Create job form
│       └── [id]/
│           └── page.js        # Job detail page
├── components/
│   ├── JobCard.js             # Job card component
│   ├── StatusBadge.js         # Status badge component
│   └── JobForm.js             # Job form component
├── lib/
│   └── api.js                 # Axios setup and API calls
├── package.json
├── .env.local                 # Environment variables
└── README.md
```

## Pages

### Home Page (`/`)

- **Display:** List all service requests as responsive cards
- **Features:**
  - Category filter dropdown
  - Status filter dropdown
  - Click any card to view details
  - "New Request" button to create jobs
  - Loading and empty states
  - Shows job count

### New Job Page (`/jobs/new`)

- **Form Fields:**
  - Title (required, min 3 chars)
  - Description (required, min 10 chars)
  - Category (required, enum)
  - Location (optional)
  - Contact Name (optional)
  - Contact Email (optional, email validation)

- **Validation:**
  - Client-side validation with error display
  - Email format validation
  - Error messages appear below fields
  - Submit button disabled while submitting

- **Behavior:**
  - Shows error/success messages
  - Redirects to home after successful creation
  - Cancel button returns to home

### Job Detail Page (`/jobs/[id]`)

- **Display:**
  - Full job details
  - Description with formatting
  - Category badge
  - Contact information with email link
  - Creation date

- **Actions:**
  - **Update Status:** Dropdown with Open, In Progress, Closed
  - **Delete:** Red button with confirmation
  - Back link to home page

## Components

### JobCard

Displays a job summary as a clickable card.

**Props:**

- `job` - Job object from API

**Features:**

- Links to detail page
- Shows status badge
- Truncates long text
- Category tag
- Creation date

```jsx
<JobCard job={job} />
```

### StatusBadge

Displays a colored badge for job status.

**Props:**

- `status` - Status value (Open, In Progress, Closed)

**Styles:**

- Open → Blue
- In Progress → Yellow
- Closed → Green

```jsx
<StatusBadge status="Open" />
```

### JobForm

Complete form for creating a new job.

**Features:**

- All required/optional fields
- Client-side validation
- Error display
- Success feedback
- Loading state
- Cancel button

```jsx
<JobForm />
```

## API Integration

All API calls are in `lib/api.js` using Axios.

```javascript
import { jobApi } from "@/lib/api";

// List jobs with filters
const result = await jobApi.getAllJobs({
  category: "Plumbing",
  status: "Open",
});

// Get single job
const result = await jobApi.getJobById(jobId);

// Create job
const result = await jobApi.createJob(jobData);

// Update status
const result = await jobApi.updateJobStatus(jobId, "In Progress");

// Delete job
const result = await jobApi.deleteJob(jobId);
```

All methods return `{ success: boolean, data?: any, error?: string }`.

## Styling

The project uses Tailwind CSS v4 with these conventions:

- **Colors:**
  - Primary: Blue (`bg-blue-600`)
  - Error: Red (`bg-red-600`)
  - Success: Green (`bg-green-600`)
  - Neutral: Gray (`bg-gray-*`)

- **Components:**
  - Buttons: `px-4 py-2 rounded-lg font-semibold transition`
  - Cards: `bg-white p-6 rounded-lg shadow`
  - Inputs: `px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500`

- **Responsive:**
  - Mobile-first approach
  - `md:` and `lg:` breakpoints
  - Grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## Loading and Error States

### Loading State

- Shows spinner while fetching
- Prevents interaction during requests
- Buttons show "Creating..." or "Deleting..."

### Error State

- Red alert box with error message
- Specific validation errors below form fields
- Non-blocking (user can retry)

### Empty State

- Shows when no jobs match filters
- Provides link to create first job

## Environment Variables

| Variable              | Description          | Example                     |
| --------------------- | -------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Development Tips

1. **Hot Reload:** Changes to files automatically reload during `npm run dev`
2. **Console Logs:** Check browser console (F12) for debugging
3. **Network Tab:** Inspect API calls in DevTools
4. **Mobile Testing:** Use DevTools device emulation or `localhost:3000` on phone

## Troubleshooting

### API calls fail with CORS error

- Ensure backend server is running on the correct port
- Check `NEXT_PUBLIC_API_URL` matches backend URL

### "Cannot find module" errors

- Run `npm install` again
- Delete `node_modules/.next` and restart dev server

### Form validation not working

- Check browser console for errors
- Verify email regex pattern is correct

## Code Style

- Functional components with hooks
- Component-based architecture
- Clear comments for complex logic
- Consistent naming conventions
- Responsive design first
- Accessible HTML (labels, aria-\*)

## Next Steps

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Open `http://localhost:3000`
4. Create, view, update, and delete service requests!
