# Mini Service Request Board

A small full-stack service request board built for the GlobalTNA Full-Stack Developer Intern technical assessment.

Homeowners can create service requests, and tradespeople can browse requests, view details, mark requests as in progress, and close assigned requests.

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing

## Features

### Core Features

- Home page with service request cards
- Category, status, location, and keyword filters
- New job request form
- Job detail page
- Create service request
- View single service request
- Update job status
- Delete own service request
- Backend validation
- Client-side form validation
- Global backend error handler
- 404 response for missing routes

### Bonus Features Added

- JWT-based authentication
- Role-based access for homeowners and tradespeople
- Keyword search across title, description, homeowner name, contact name, contact email, and location

## User Roles

### Homeowner

A homeowner can:

- Register and login
- Create a service request
- Delete only their own service requests
- View all requests and details

### Tradesperson

A tradesperson can:

- Register and login
- Browse service requests
- View request details
- Mark an open request as in progress
- Close a request assigned to them

## Data Model

MongoDB collection name:

```text
jobRequests