# Task Management CRUD API
 
A backend REST API built with Node.js, Express, and MongoDB for managing tasks. This was built as part of a club selection assignment.
 
## Live Deployment
 
https://task-management-api-d8rp.onrender.com/
 
## Tech Stack
 
- Node.js
- Express.js
- MongoDB (Atlas) with Mongoose
- Postman for testing
## Features
 
The API supports full CRUD operations on tasks:
 
- Create a task with title, description, status, and due date
- Read all tasks or fetch a single task by ID or title
- Update an existing task's details or status
- Delete a task by ID
Each task has the following fields:
 
| Field | Type | Notes |
|---|---|---|
| title | String | Required |
| description | String | Optional |
| status | String | One of: pending, in-progress, completed. Defaults to pending |
| dueDate | Date | Required |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |
 
## Project Structure
 
```
task-api/
├── controllers/
│   └── taskController.js
├── models/
│   └── Task.js
├── routes/
│   └── taskRoutes.js
├── server.js
├── package.json
└── Task Management API.postman_collection.json
```
 
## Getting Started
 
### Prerequisites
 
- Node.js installed
- A MongoDB Atlas account (free tier works fine)
### Setup
 
1. Clone the repository
```
git clone <your-repo-url>
cd task-api
```
 
2. Install dependencies
```
npm install
```
 
3. Create a `.env` file in the root directory with the following:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
 
4. Run the server
```
npm run dev
```
 
If everything is set up correctly, you should see `MongoDB connected` and `Server running on port 5000` in the terminal.
 
## API Endpoints
 
Base URL: `http://localhost:5000/tasks`
 
| Method | Endpoint | Description |
|---|---|---|
| POST | /tasks | Create a new task |
| GET | /tasks | Get all tasks |
| GET | /tasks/:id | Get a single task by ID |
| GET | /tasks/title/:title | Get a single task by title |
| PUT | /tasks/:id | Update a task by ID |
| DELETE | /tasks/:id | Delete a task by ID |
 
### Example: Create a task
 
Request body:
```json
{
  "title": "Finish assignment",
  "description": "Complete the backend API",
  "dueDate": "2026-09-20"
}
```
 
Response (201 Created):
```json
{
  "success": true,
  "data": {
    "title": "Finish assignment",
    "description": "Complete the backend API",
    "status": "pending",
    "dueDate": "2026-09-20T00:00:00.000Z",
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```
 
## Testing
 
A Postman collection is included in the repo (`Task Management API.postman_collection.json`) with all 5 endpoints pre-configured. Import it into Postman to test the API directly without setting up requests manually.
 
To test locally:
1. Make sure the server is running (`npm run dev`)
2. Import the Postman collection
3. Run the requests in order: Create Task, GET All Tasks, Get Task By Id, UPDATE Task By Id, Delete Task by Id
## Notes
 
- Error handling is implemented for invalid IDs, missing required fields, and not-found resources, with appropriate HTTP status codes (400, 404, 500).
- Input validation is handled through the Mongoose schema (required fields, enum values for status).
- No frontend is included as it was listed as optional in the assignment requirements.