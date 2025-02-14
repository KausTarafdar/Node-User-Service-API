# User Registration and Authentication API

## Overview
This is a Node.js and Express.js based API for user authentication and search functionality. It uses MongoDB as the database, JWT for authentication, and Hapi for request validation. The API allows users to register, log in, authenticate using JWT, and search for other users based on their email or username.

## Features
- User Registration with input validation and password hashing.
- User Login with JWT token generation.
- Protected Routes requiring authentication.
- Search Users by email or username.
- Logging using Winston and Morgan.

## Technologies Used
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- Joi for Request validation
- Winston & Morgan for logging

## Installation
1. Clone repository:
```bash
git clone https://github.com/KausTarafdar/Node-User-Service-API.git
cd Node-User-Service-API
```
2. Install dependencies:
```bash
npm install
```
3. Set up the environment variables: Create a `.env` file in the root directory and add the following values
```js
PORT={{5000}}
MONGO_URI={{mongodb+srv://your_db_url}}
JWT_SECRET={{your_secret_key}}
```
4. Start the server:
    For starting development server
    ```bash
    npm run start:dev
    ```
    For starting production server
    ```bash
    npm run start:prod
    ```

## API Endpoints
#### 1. User Registration

**POST** `/api/auth/register`

Request Body:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Secure@123",
  "gender": "Male",
  "dateOfBirth": "2000-05-15",
  "country": "USA"
}
```
Response Body:
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": "67aee35b834f985c4c394446",
        "username": "testuser",
        "email": "test@example.com",
        "gender": "Male",
        "dateOfBirth": "2000-05-15T00:00:00.000Z",
        "country": "USA",
        "createdAt": "2025-02-14T06:31:55.139Z"
    }
}
```

#### 2. User Login

**POST** `/api/auth/login`
Request Body:
```json
{
    "email": "testEmail@gmail.com",
    "password": "123456"
}
```
Response Body:
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "userId": "67aee35b834f985c4c394446",
        "username": "Test User",
        "email": "testEmail@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FlZTM1YjgzNGY5ODVjNGMzOTQ0NDYiLCJlbWFpbCI6InRlc3RFbWFpbEBnbWFpbC5jb20iLCJpYXQiOjE3Mzk1MTQ3MzUsImV4cCI6MTczOTUxODMzNX0.VnJJI7rZBJSw5Hgh_QIgCh9CkogeAuCt9HTu1-VQRVk"
    }
}
```

#### 3. Search User Profile (Protected Route)

**GET** `/api/users/search?< email = >or< username= >`

Headers:
```json
Authorization: Bearer <JWT_Token>
```

Response Body:
```json
{
    "success": true,
    "message": "User found",
    "data": {
        "id": "67aeda8ac50c4354de64aa9a",
        "username": "John Doe",
        "email": "example2342@gmail.com",
        "gender": "Male",
        "dateOfBirth": "2000-12-01T00:00:00.000Z",
        "country": "USA",
        "createdAt": "2025-02-14T05:54:18.226Z"
    }
}
```
