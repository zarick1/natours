_Natours API_
Natours is a RESTful API for managing travel tours and user authentication, built with Node.js, Express, and MongoDB. It provides endpoints for creating, retrieving, updating, and deleting tours, as well as user signup, login, password management, and profile updates. The API includes advanced query features, security middlewares, and robust error handling.

_Features_
Tour Management: CRUD operations for tours with advanced filtering, sorting, pagination, and aggregation (e.g., tour statistics, monthly plans).
User Authentication: Secure signup, login, password reset, and role-based access control using JWT.
Security: Rate limiting, XSS protection, parameter pollution prevention, NoSQL injection sanitization, and secure HTTP headers.
Error Handling: Centralized error handling with custom error messages for development and production environments.
Email Notifications: Password reset emails sent via Nodemailer.
Advanced Querying: Custom utility for building complex Mongoose queries with filtering, sorting, field limiting, and pagination.

_Technologies Used_
Node.js: Server-side JavaScript runtime.
Express: Web framework for building the API.
MongoDB: NoSQL database for storing tours and users.
Mongoose: ODM for MongoDB schema and query management.
Nodemailer: Email sending for password resets.
JWT (jsonwebtoken): Token-based authentication.
Bcrypt: Password hashing.
Helmet: Security HTTP headers.
express-rate-limit: Rate limiting for API requests.
express-mongo-sanitize: Protection against NoSQL query injection.
xss-clean: Sanitization against XSS attacks.
hpp: Prevention of HTTP parameter pollution.
Slugify: URL-friendly slugs for tours.
Validator: Email validation.
dotenv: Environment variable management.

_Installation_

Clone the repository:
git clone https://github.com/your-username/natours-api.git
cd natours-api

Install dependencies:
npm install

Set up environment variables:Create a .env file in the root directory and add the following:
NODE_ENV=development
PORT=3000
DATABASE=mongodb://localhost:27017/natours
DATABASE_PASSWORD=your-mongodb-password
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_HOST=your-email-host
EMAIL_PORT=your-email-port
EMAIL_USERNAME=your-email-username
EMAIL_PASSWORD=your-email-password

Start MongoDB:Ensure MongoDB is running locally or provide a MongoDB Atlas connection string in .env.

Run the application:
npm start

The API will be available at http://localhost:3000.

_Usage_
API Endpoints

Tours

GET /api/v1/tours: Retrieve all tours with optional filtering, sorting, and pagination (e.g., ?price[gte]=500&sort=price&page=2).
GET /api/v1/tours/top-5-cheap: Get top 5 tours by ratings and price.
GET /api/v1/tours/tour-stats: Get tour statistics by difficulty.
GET /api/v1/tours/monthly-plan/:year: Get monthly tour distribution for a specific year.
GET /api/v1/tours/:id: Retrieve a single tour by ID.
POST /api/v1/tours: Create a new tour (requires authentication).
PATCH /api/v1/tours/:id: Update a tour by ID.
DELETE /api/v1/tours/:id: Delete a tour by ID (admin/lead-guide only).

Users

POST /api/v1/users/signup: Register a new user.
POST /api/v1/users/login: Log in and receive a JWT.
POST /api/v1/users/forgotPassword: Request a password reset email.
PATCH /api/v1/users/resetPassword/:token: Reset password using a token.
PATCH /api/v1/users/updateMyPassword: Update password (authenticated users).
PATCH /api/v1/users/updateMe: Update name or email (authenticated users).
DELETE /api/v1/users/deleteMe: Deactivate account (authenticated users).
GET /api/v1/users: Retrieve all users (placeholder, not implemented).
GET /api/v1/users/:id: Retrieve a user by ID (placeholder, not implemented).
POST /api/v1/users: Create a user (placeholder, not implemented).
PATCH /api/v1/users/:id: Update a user by ID (placeholder, not implemented).
DELETE /api/v1/users/:id: Delete a user by ID (placeholder, not implemented).

Example Request
Get all tours with filtering:
curl -X GET "http://localhost:3000/api/v1/tours?price[lte]=1000&difficulty=easy&sort=-ratingsAverage"

Sign up a new user:
curl -X POST http://localhost:3000/api/v1/users/signup \
-H "Content-Type: application/json" \
-d '{
"name": "John Doe",
"email": "john@example.com",
"password": "password123",
"passwordConfirm": "password123"
}'

_POSTMAN DOCUMENTATION_

https://documenter.getpostman.com/view/44688976/2sB2qZDhGJ
