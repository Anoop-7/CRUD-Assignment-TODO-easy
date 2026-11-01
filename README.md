# TODO REST API

A RESTful backend API for a TODO Management System built using Node.js, Express.js, MongoDB, Mongoose, and Zod[cite: 1].

---

## 1. Overview

This backend API manages task creation, reading, updating, and deleting with strict input validation and proper HTTP response codes[cite: 1]. It stores documents in MongoDB using Mongoose schemas and handles validation errors cleanly with Zod before database operations are invoked[cite: 1].

### Key Features
- **CRUD Endpoints**: Full lifecycle support (`POST`, `GET`, `PUT`, `PATCH`, `DELETE`)[cite: 1].
- **Request Validation**: Schema validation using Zod for request bodies, query strings, and 24-character hexadecimal MongoDB ObjectIds[cite: 1].
- **Automatic Timestamps**: Document timestamps (`createdAt` and `updatedAt`) managed automatically by Mongoose[cite: 1].
- **Bonus Query Support**: Filtering by completion status (`?completed=true|false`), searching titles with case-insensitive regex (`?search=...`), and pagination (`?page=1&limit=10`) sorted with newest tasks first[cite: 1].
- **Standardized Error Handling**: Uniform JSON error responses returning appropriate status codes (`200`, `201`, `400`, `404`, `500`)[cite: 1].

---

## 2. Tech Stack

- **Runtime Environment**: Node.js[cite: 1]
- **Web Framework**: Express.js[cite: 1]
- **Database**: MongoDB[cite: 1]
- **ODM**: Mongoose[cite: 1]
- **Validation**: Zod[cite: 1]
- **Environment Management**: Dotenv[cite: 1]

---

## 3. Project Structure

```text
todo-backend/
├── src/
│   ├── index.js             # Express application & server entry point[cite: 1]
│   ├── db.js                # MongoDB connection management[cite: 1]
│   ├── models/
│   │   └── todo.model.js    # Mongoose schema and model definition[cite: 1]
│   ├── routes/
│   │   └── todo.route.js    # Express route definitions and handlers[cite: 1]
│   └── schemas/
│       └── todo.schema.js   # Zod validation schemas[cite: 1]
├── postman/
│   └── TODO_assignment.postman_collection.json # Exported Postman test suite
├── .env.example             # Template for environment variables[cite: 1]
├── .gitignore               # Ignored files (node_modules, .env)[cite: 1]
├── package.json
└── README.md
```

---

## 4. Database Schema

Each task document inside the `todos` collection adheres to the following structure[cite: 1]:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto | MongoDB unique identifier[cite: 1] |
| `title` | String | Yes | Title of the task (minimum 3 characters, trimmed)[cite: 1] |
| `description` | String | No | Description of the task[cite: 1] |
| `completed` | Boolean | Yes | Default: `false`[cite: 1] |
| `createdAt` | Date | Auto | Automatically set on creation[cite: 1] |
| `updatedAt` | Date | Auto | Automatically updated on save[cite: 1] |

---

## 5. API Reference

All routes are mounted under the `/todos` prefix.

### 1. Create a TODO
- **Method**: `POST`[cite: 1]
- **Path**: `/todos`[cite: 1]
- **Request Body**:
  ```json
  {
    "title": "Learn MongoDB",
    "description": "Practice CRUD operations"
  }
  ```
- **Validation Rules**:
  - `title`: String, required, minimum 3 characters after trimming[cite: 1].
  - `description`: String, optional[cite: 1].
  - `completed`: Defaults to `false` and is not accepted from the request body[cite: 1].
- **Success Response (`201 Created`)**[cite: 1]:
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
- **Method**: `GET`[cite: 1]
- **Path**: `/todos`[cite: 1]
- **Optional Query Parameters**:
  - `completed`: Filter by status (`true` or `false`)[cite: 1].
  - `search`: Search within task titles using case-insensitive regex[cite: 1].
  - `page`: Page index (default: `1`)[cite: 1].
  - `limit`: Number of items per page (default: `10`)[cite: 1].
- **Success Response (`200 OK`)**[cite: 1]:
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
- **Method**: `GET`[cite: 1]
- **Path**: `/todos/:id`[cite: 1]
- **Success Response (`200 OK`)**[cite: 1]:
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
  - `400 Bad Request` if `:id` is not a valid 24-character hex ObjectId[cite: 1].
  - `404 Not Found` if no TODO matches the given ID[cite: 1].

---

### 4. Update a TODO
- **Method**: `PUT`[cite: 1]
- **Path**: `/todos/:id`[cite: 1]
- **Request Body**:
  ```json
  {
    "title": "Learn Express and MongoDB",
    "description": "Complete all CRUD API routes"
  }
  ```
- **Validation Rules**:
  - Both `title` (min 3 characters) and `description` are required[cite: 1].
- **Success Response (`200 OK`)**[cite: 1]:
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
- **Method**: `PATCH`[cite: 1]
- **Path**: `/todos/:id/toggle`[cite: 1]
- **Request Body**: None required[cite: 1].
- **Behavior**: Flips `completed` from `false` to `true` or from `true` to `false`[cite: 1].
- **Success Response (`200 OK`)**[cite: 1]:
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
- **Method**: `DELETE`[cite: 1]
- **Path**: `/todos/:id`[cite: 1]
- **Success Response (`200 OK`)**[cite: 1]:
  ```json
  {
    "message": "TODO deleted successfully"
  }
  ```
- **Error Response**:
  - `404 Not Found` if the resource does not exist[cite: 1].

---

## 6. HTTP Status Code Conventions

| Status Code | Description | Usage Scenario[cite: 1] |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | `GET`, `PUT`, `PATCH`, `DELETE` operations[cite: 1] |
| `201 Created` | Resource created | Successful `POST /todos`[cite: 1] |
| `400 Bad Request` | Client validation failed | Malformed body, short title, invalid ObjectId[cite: 1] |
| `404 Not Found` | Resource missing | TODO ID does not exist in database[cite: 1] |
| `500 Server Error` | Unexpected failure | Database disconnection or unhandled internal errors[cite: 1] |

---

## 7. Installation and Setup

### Prerequisites
- Node.js installed (v18+ recommended)
- A running MongoDB instance (local or MongoDB Atlas connection string)[cite: 1]

### 1. Clone the Repository
```bash
git clone [https://github.com/Anoop-7/CRUD-Assignment-TODO-easy.git](https://github.com/Anoop-7/CRUD-Assignment-TODO-easy.git)[cite: 7]
cd CRUD-Assignment-TODO-easy
```

### 2. Install Dependencies[cite: 1]
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root based on `.env.example`[cite: 1]:
```bash
cp .env.example .env
```

Add your environment variables[cite: 1]:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_app
```

### 4. Run the Application
Start the server[cite: 1]:
```bash
node src/index.js
```
The server will boot and connect to MongoDB, listening on `http://localhost:3000`[cite: 1].

---

## 8. Postman Testing Guide

An exported Postman collection is located in the repository under[cite: 1]:
```text
postman/TODO_assignment.postman_collection.json
```

### Importing into Postman:
1. Open the Postman desktop application.
2. Click **Import** in the upper-left corner.
3. Select the `TODO_assignment.postman_collection.json` file.
4. Run requests in sequence against `http://localhost:3000` to verify each route:
   - `POST /todos` (Create a task)[cite: 1]
   - `POST /todos` (Negative test with title length < 3)[cite: 1]
   - `GET /todos` (Fetch all tasks)[cite: 1]
   - `GET /todos?completed=false` (Filter bonus)[cite: 1]
   - `GET /todos?search=Express` (Search bonus)[cite: 1]
   - `GET /todos/:id` (Fetch task by ID)[cite: 1]
   - `PUT /todos/:id` (Update task)[cite: 1]
   - `PATCH /todos/:id/toggle` (Toggle complete status)[cite: 1]
   - `DELETE /todos/:id` (Delete task)[cite: 1]