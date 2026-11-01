TODO Management REST API - (CRUD Assignment - beginner)

A backend RESTful API for managing tasks, built using Node.js, Express, MongoDB, Mongoose, and Zod.

Features

Full CRUD Operations: Create, read, update, and delete TODO items.

Data Validation: Strict input validation using Zod for request bodies, path parameters, and query strings.

MongoDB Persistence: Schema definitions and audit timestamps (createdAt, updatedAt) managed with Mongoose.

Bonus Capabilities:

Filter by completion status (?completed=true / ?completed=false).

Search by keyword in title (?search=keyword).

Automatic sorting by creation date (createdAt: -1).

Configurable pagination (?page=1&limit=10).

Tech Stack

Runtime: Node.js (CommonJS)

Framework: Express.js

Database: MongoDB & Mongoose

Validation: Zod

Environment Management: Dotenv

Project Structure

todo-backend/
├── src/
│   ├── index.js
│   ├── db.js
│   ├── models/
│   │   └── todo.model.js
│   ├── routes/
│   │   └── todo.routes.js
│   └── schemas/
│       └── todo.schema.js
├── postman/
│   └── Todo_API.postman_collection.json
├── .env.example
├── .gitignore
├── package.json
└── README.md


Getting Started

1. Prerequisites

Node.js (v16 or higher)

MongoDB running locally or a MongoDB Atlas connection string.

2. Installation

Clone the repository and install dependencies:

git clone <YOUR_GITHUB_REPO_URL>
cd todo-backend
npm install


3. Environment Variables

Create a .env file in the root directory by copying the example file:

cp .env.example .env


Ensure your .env configuration points to your MongoDB instance:

PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_app


4. Running the Server

Start the application:

npm start


Or run with Node directly:

node src/index.js


The server should start and display:

MongoDB connected: 127.0.0.1
Server running on port 3000


API Endpoints

Method

Endpoint

Description

POST

/todos

Create a new TODO

GET

/todos

Fetch all TODOs (supports pagination, filtering, search)

GET

/todos/:id

Fetch a single TODO by its 24-character hex ID

PUT

/todos/:id

Update both title and description

PATCH

/todos/:id/toggle

Toggle completed status (false $\leftrightarrow$ true)

DELETE

/todos/:id

Permanently delete a TODO

Request & Response Examples

1. Create a TODO

POST /todos

Body:

{
  "title": "Learn MongoDB",
  "description": "Practice CRUD operations"
}


Response (201 Created):

{
  "message": "TODO created successfully",
  "todo": {
    "_id": "6718a12e73f1b12c34d56789",
    "title": "Learn MongoDB",
    "description": "Practice CRUD operations",
    "completed": false,
    "createdAt": "2026-10-22T10:00:00.000Z",
    "updatedAt": "2026-10-22T10:00:00.000Z"
  }
}


2. Get All TODOs (With Bonus Features)

GET /todos?search=mongo&completed=false&page=1&limit=10

Response (200 OK):

{
  "todos": [
    {
      "_id": "6718a12e73f1b12c34d56789",
      "title": "Learn MongoDB",
      "description": "Practice CRUD operations",
      "completed": false,
      "createdAt": "2026-10-22T10:00:00.000Z",
      "updatedAt": "2026-10-22T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}


3. Get TODO by ID

GET /todos/6718a12e73f1b12c34d56789

Response (200 OK):

{
  "todo": {
    "_id": "6718a12e73f1b12c34d56789",
    "title": "Learn MongoDB",
    "description": "Practice CRUD operations",
    "completed": false,
    "createdAt": "2026-10-22T10:00:00.000Z",
    "updatedAt": "2026-10-22T10:00:00.000Z"
  }
}


4. Update a TODO

PUT /todos/6718a12e73f1b12c34d56789

Body:

{
  "title": "Learn Express and MongoDB",
  "description": "Complete all CRUD API routes"
}


Response (200 OK):

{
  "message": "TODO updated successfully",
  "todo": {
    "_id": "6718a12e73f1b12c34d56789",
    "title": "Learn Express and MongoDB",
    "description": "Complete all CRUD API routes",
    "completed": false
  }
}


5. Toggle Status

PATCH /todos/6718a12e73f1b12c34d56789/toggle

Response (200 OK):

{
  "message": "TODO status updated successfully",
  "todo": {
    "_id": "6718a12e73f1b12c34d56789",
    "title": "Learn Express and MongoDB",
    "description": "Complete all CRUD API routes",
    "completed": true
  }
}


6. Delete a TODO

DELETE /todos/6718a12e73f1b12c34d56789

Response (200 OK):

{
  "message": "TODO deleted successfully"
}


Error Handling

Standard HTTP status codes are returned:

400 Bad Request: Validation failure (short title, missing fields, or invalid MongoDB ObjectId).

404 Not Found: Target TODO ID does not exist in the database.

500 Internal Server Error: Server or database connection faults.