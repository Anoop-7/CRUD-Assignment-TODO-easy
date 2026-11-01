# TODO REST API

A RESTful backend API for a TODO Management System built using Node.js, Express.js, MongoDB, Mongoose, and Zod.

---

## 1. Overview

This backend API manages task creation, reading, updating, and deleting with strict input validation and proper HTTP response codes. It stores documents in MongoDB using Mongoose schemas and handles validation errors cleanly with Zod before database operations are invoked.

### Key Features
- **CRUD Endpoints**: Full lifecycle support (`POST`, `GET`, `PUT`, `PATCH`, `DELETE`).
- **Request Validation**: Schema validation using Zod for request bodies, query strings, and 24-character hexadecimal MongoDB ObjectIds.
- **Automatic Timestamps**: Document timestamps (`createdAt` and `updatedAt`) managed automatically by Mongoose.
- **Bonus Query Support**: Filtering by completion status (`?completed=true|false`), searching titles with case-insensitive regex (`?search=...`), and pagination (`?page=1&limit=10`) sorted with newest tasks first.
- **Standardized Error Handling**: Uniform JSON error responses returning appropriate status codes (`200`, `201`, `400`, `404`, `500`).

---

## 2. Tech Stack

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Validation**: Zod
- **Environment Management**: Dotenv

---

## 3. Project Structure

```text
todo-backend/
├── src/
│   ├── index.js             # Express application & server entry point
│   ├── db.js                # MongoDB connection management
│   ├── models/
│   │   └── todo.model.js    # Mongoose schema and model definition
│   ├── routes/
│   │   └── todo.route.js    # Express route definitions and handlers
│   └── schemas/
│       └── todo.schema.js   # Zod validation schemas
├── postman/
│   └── TODO_assignment.postman_collection.json # Exported Postman test suite
├── .env.example             # Template for environment variables
├── .gitignore               # Ignored files (node_modules, .env)
├── package.json
└── README.md
```

---

## 4. Database Schema

Each task document inside the `todos` collection adheres to the following structure:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `title` | String | Yes | Title of the task (minimum 3 characters, trimmed) |
| `description` | String | No | Description of the task |
| `completed` | Boolean | Yes | Default: `false` |
| `createdAt` | Date | Auto | Automatically set on creation |
| `updatedAt` | Date | Auto | Automatically updated on save |

---

## 5. API Reference

All routes are mounted under the `/todos` prefix.

### 1. Create a TODO
- **Method**: `POST`
- **Path**: `/todos`
- **Request Body**:
  ```json
  {
    "title": "Learn MongoDB",
    "description": "Practice CRUD operations"
  }
  ```
- **Validation Rules**:
  - `title`: String, required, minimum 3 characters after trimming.
  - `description`: String, optional.
  - `completed`: Defaults to `false` and is not accepted from the request body.
- **Success Response (`201 Created`)**:
  ```json
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
  ```

---

### 2. Get All TODOs
- **Method**: `GET`
- **Path**: `/todos`
- **Optional Query Parameters**:
  - `completed`: Filter by status (`true` or `false`).
  - `search`: Search within task titles using case-insensitive regex.
  - `page`: Page index (default: `1`).
  - `limit`: Number of items per page (default: `10`).
- **Success Response (`200 OK`)**:
  ```json
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
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```

---

### 3. Get Single TODO
- **Method**: `GET`
- **Path**: `/todos/:id`
- **Success Response (`200 OK`)**:
  ```json
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
  ```
- **Error Responses**:
  - `400 Bad Request` if `:id` is not a valid 24-character hex ObjectId.
  - `404 Not Found` if no TODO matches the given ID.

---

### 4. Update a TODO
- **Method**: `PUT`
- **Path**: `/todos/:id`
- **Request Body**:
  ```json
  {
    "title": "Learn Express and MongoDB",
    "description": "Complete all CRUD API routes"
  }
  ```
- **Validation Rules**:
  - Both `title` (min 3 characters) and `description` are required.
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "TODO updated successfully",
    "todo": {
      "_id": "6718a12e73f1b12c34d56789",
      "title": "Learn Express and MongoDB",
      "description": "Complete all CRUD API routes",
      "completed": false,
      "createdAt": "2026-10-22T10:00:00.000Z",
      "updatedAt": "2026-10-22T10:05:00.000Z"
    }
  }
  ```

---

### 5. Toggle Completion Status
- **Method**: `PATCH`
- **Path**: `/todos/:id/toggle`
- **Request Body**: None required.
- **Behavior**: Flips `completed` from `false` to `true` or from `true` to `false`.
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "TODO status updated successfully",
    "todo": {
      "_id": "6718a12e73f1b12c34d56789",
      "title": "Learn Express and MongoDB",
      "description": "Complete all CRUD API routes",
      "completed": true,
      "createdAt": "2026-10-22T10:00:00.000Z",
      "updatedAt": "2026-10-22T10:10:00.000Z"
    }
  }
  ```

---

### 6. Delete a TODO
- **Method**: `DELETE`
- **Path**: `/todos/:id`
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "TODO deleted successfully"
  }
  ```
- **Error Response**:
  - `404 Not Found` if the resource does not exist.

---

## 6. HTTP Status Code Conventions

| Status Code | Description | Usage Scenario |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | `GET`, `PUT`, `PATCH`, `DELETE` operations |
| `201 Created` | Resource created | Successful `POST /todos` |
| `400 Bad Request` | Client validation failed | Malformed body, short title, invalid ObjectId |
| `404 Not Found` | Resource missing | TODO ID does not exist in database |
| `500 Server Error` | Unexpected failure | Database disconnection or unhandled internal errors |

---

## 7. Installation and Setup

### Prerequisites
- Node.js installed (v18+ recommended)
- A running MongoDB instance (local or MongoDB Atlas connection string)

### 1. Clone the Repository
```bash
git clone [https://github.com/Anoop-7/CRUD-Assignment-TODO-easy.git](https://github.com/Anoop-7/CRUD-Assignment-TODO-easy.git)
cd CRUD-Assignment-TODO-easy
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root based on `.env.example`:
```bash
cp .env.example .env
```

Add your environment variables:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_app
```

### 4. Run the Application
Start the server:
```bash
node src/index.js
```
The server will boot and connect to MongoDB, listening on `http://localhost:3000`.

---

## 8. Postman Testing Guide

An exported Postman collection is located in the repository under:
```text
postman/TODO_assignment.postman_collection.json
```

### Importing into Postman:
1. Open the Postman desktop application.
2. Click **Import** in the upper-left corner.
3. Select the `TODO_assignment.postman_collection.json` file.
4. Run requests in sequence against `http://localhost:3000` to verify each route:
   - `POST /todos` (Create a task)
   - `POST /todos` (Negative test with title length < 3)
   - `GET /todos` (Fetch all tasks)
   - `GET /todos?completed=false` (Filter bonus)
   - `GET /todos?search=Express` (Search bonus)
   - `GET /todos/:id` (Fetch task by ID)
   - `PUT /todos/:id` (Update task)
   - `PATCH /todos/:id/toggle` (Toggle complete status)
   - `DELETE /todos/:id` (Delete task)