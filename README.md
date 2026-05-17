# Mini Service Request Board

A full-stack mini service request board built for the **GlobalTNA Full-Stack Developer Intern Technical Assessment**.

Homeowners can create service requests, while tradespeople can browse requests, view request details, mark requests as in progress, and close assigned requests.

---

## Live Demo

**Frontend:**  
https://globaltna-service-board-suzb.vercel.app

**Backend Health Check:**  
https://globaltna-service-board-i3cp.onrender.com/health

**Backend Base URL:**  
https://globaltna-service-board-i3cp.onrender.com

> Note: The backend is hosted on Render free tier, so the first request may take a short time to wake up.

---

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Vercel deployment

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT authentication
- bcrypt password hashing
- Jest
- Supertest
- MongoDB Memory Server
- Render deployment

---

## Features

### Core Assessment Features

- Home page listing service requests as cards
- New service request form
- Job request detail page
- Create service request
- View all service requests
- View a single service request
- Update request status
- Delete service request
- Category filter
- Status filter
- Backend input validation
- Client-side form validation
- Global backend error handler
- Clear 404 response for missing routes

### Bonus Features Implemented

- Keyword search across request title and description
- Extended keyword search across homeowner name, contact name, contact email, and location
- JWT-based authentication
- Role-based access for homeowners and tradespeople
- Seed script to insert sample service requests
- API tests for job creation and status update endpoints
- Frontend deployed to Vercel
- Backend deployed to Render

---

## User Roles

### Homeowner

A homeowner can:

- Register and login
- Create service requests
- View all requests
- View request details
- Delete only their own requests

### Tradesperson

A tradesperson can:

- Register and login
- Browse service requests
- View request details
- Mark an open request as in progress
- Close a request assigned to them

---

## Data Model

MongoDB collection name:

```text
jobRequests