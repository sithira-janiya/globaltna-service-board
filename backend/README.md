# Mini Service Request Board - Backend

A Node.js Express REST API for managing service requests. Built with Express, MongoDB, and Mongoose.

## Features

- ✓ Express.js REST API
- ✓ MongoDB with Mongoose ODM
- ✓ Comprehensive validation
- ✓ Error handling middleware
- ✓ CORS support
- ✓ Request logging with Morgan
- ✓ Environment configuration with dotenv

## Prerequisites

- Node.js 16+
- MongoDB 4.4+ (local or cloud instance)
- npm or yarn

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Create `.env` file:**

```bash
cp .env.example .env
```

Update `.env` with your MongoDB connection string:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-board
NODE_ENV=development
```

## Running the Server

### Development mode (with auto-reload):

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

Server starts on `http://localhost:5000` by default.

## API Endpoints

### List all jobs

```http
GET /api/jobs
```

Optional query parameters:

- `category` - Filter by category (Plumbing, Electrical, Painting, Joinery, Other)
- `status` - Filter by status (Open, In Progress, Closed)

**Example:**

```
GET /api/jobs?category=Plumbing&status=Open
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "title": "Fix kitchen sink",
      "description": "Leaking under the sink",
      "category": "Plumbing",
      "location": "Kitchen",
      "contactName": "John Smith",
      "contactEmail": "john@example.com",
      "status": "Open",
      "createdAt": "2026-05-16T10:30:00Z",
      "updatedAt": "2026-05-16T10:30:00Z"
    }
  ]
}
```

---

### Get single job

```http
GET /api/jobs/:id
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Fix kitchen sink",
    "description": "Leaking under the sink",
    "category": "Plumbing",
    "location": "Kitchen",
    "contactName": "John Smith",
    "contactEmail": "john@example.com",
    "status": "Open",
    "createdAt": "2026-05-16T10:30:00Z"
  }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Job request not found"
}
```

---

### Create job

```http
POST /api/jobs
Content-Type: application/json

{
  "title": "Fix kitchen sink",
  "description": "Leaking under the sink, needs urgent attention",
  "category": "Plumbing",
  "location": "Kitchen",
  "contactName": "John Smith",
  "contactEmail": "john@example.com"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Job request created successfully",
  "data": {
    "_id": "...",
    "title": "Fix kitchen sink",
    "description": "Leaking under the sink, needs urgent attention",
    "category": "Plumbing",
    "location": "Kitchen",
    "contactName": "John Smith",
    "contactEmail": "john@example.com",
    "status": "Open",
    "createdAt": "2026-05-16T10:30:00Z",
    "updatedAt": "2026-05-16T10:30:00Z"
  }
}
```

**Validation Errors (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Please provide a job title",
    "Please provide a valid email address"
  ]
}
```

---

### Update job status

```http
PATCH /api/jobs/:id
Content-Type: application/json

{
  "status": "In Progress"
}
```

Valid status values: `Open`, `In Progress`, `Closed`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Job status updated successfully",
  "data": {
    "_id": "...",
    "title": "Fix kitchen sink",
    "description": "Leaking under the sink, needs urgent attention",
    "category": "Plumbing",
    "location": "Kitchen",
    "contactName": "John Smith",
    "contactEmail": "john@example.com",
    "status": "In Progress",
    "createdAt": "2026-05-16T10:30:00Z",
    "updatedAt": "2026-05-16T10:35:00Z"
  }
}
```

---

### Delete job

```http
DELETE /api/jobs/:id
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Job request deleted successfully",
  "data": {
    "_id": "...",
    "title": "Fix kitchen sink",
    "description": "Leaking under the sink, needs urgent attention",
    "category": "Plumbing",
    "location": "Kitchen",
    "contactName": "John Smith",
    "contactEmail": "john@example.com",
    "status": "Open",
    "createdAt": "2026-05-16T10:30:00Z"
  }
}
```

---

## Error Handling

The API returns appropriate HTTP status codes:

| Code | Meaning                        |
| ---- | ------------------------------ |
| 200  | Success                        |
| 201  | Created                        |
| 400  | Bad Request (validation error) |
| 404  | Not Found                      |
| 409  | Conflict (duplicate entry)     |
| 500  | Server Error                   |

All error responses include a `success: false` flag and a `message` field.

## Project Structure

```
backend/
├── src/
│   ├── server.js              # Express app initialization
│   ├── controllers/
│   │   └── jobController.js   # CRUD logic
│   ├── models/
│   │   └── JobRequest.js      # Mongoose schema
│   ├── routes/
│   │   └── jobRoutes.js       # API routes
│   └── middleware/
│       └── errorHandler.js    # Global error handler
├── package.json
├── .env.example
└── README.md
```

## JobRequest Model

| Field        | Type   | Validation                                                     |
| ------------ | ------ | -------------------------------------------------------------- |
| title        | String | Required, min 3 chars                                          |
| description  | String | Required, min 10 chars                                         |
| category     | String | Required, enum: Plumbing, Electrical, Painting, Joinery, Other |
| location     | String | Optional                                                       |
| contactName  | String | Optional                                                       |
| contactEmail | String | Optional, must be valid email                                  |
| status       | String | Enum: Open (default), In Progress, Closed                      |
| createdAt    | Date   | Auto set, immutable                                            |
| updatedAt    | Date   | Auto updated                                                   |

## Testing with cURL

```bash
# List all jobs
curl http://localhost:5000/api/jobs

# Create a job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix tap","description":"Kitchen tap is leaking badly","category":"Plumbing","contactName":"Jane","contactEmail":"jane@example.com"}'

# Get single job
curl http://localhost:5000/api/jobs/[JOB_ID]

# Update job status
curl -X PATCH http://localhost:5000/api/jobs/[JOB_ID] \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}'

# Delete job
curl -X DELETE http://localhost:5000/api/jobs/[JOB_ID]
```

## Notes

- MongoDB collection name is `jobRequests`
- Timestamps are in ISO 8601 format (UTC)
- Email validation follows standard RFC pattern
- All request body fields are trimmed and validated
- Enum fields are case-sensitive
