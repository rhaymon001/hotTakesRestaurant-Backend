# HotTakesBackend

HotTakesBackend is the API layer for the HotTakes restaurant platform. It provides the backend services for authentication, menu management, customer orders, payments, business profile configuration, and account recovery used by the frontend application.

## Overview

Built with Node.js, Express, and MongoDB, this service exposes a secure REST API for both customer-facing and admin workflows. The backend handles JWT authentication, authorization checks, email-based password recovery, media uploads, and order lifecycle management.

## Why this service exists

The frontend is intentionally lightweight and presentation-driven. HotTakesBackend manages all data, validation, and access control so the client app can remain focused on user experience and business workflows.

## Features

- User registration and login
- Secure access token and refresh token flow
- Role-based authorization for admin and superadmin users
- Menu management with create, read, update, and delete operations
- Business information management endpoints
- Order creation, retrieval, and status updates
- Payment processing integration
- Password reset and account recovery flow
- Cloudinary-powered image uploads
- CORS configuration for approved frontend origins
- Structured validation and controlled error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Express Validator and Zod
- Cloudinary and Multer
- Nodemailer
- Cookie parsing and CORS support
- dotenv for local configuration support

## Project Structure

```text
HotTakesBackend/
├── api/
├── config/
├── controllers/
├── middleware/
├── model/
├── routes/
├── utils/
├── validators/
├── server.js
├── local.js
├── package.json
├── vercel.json
└── README.md
```

## Prerequisites

Before running the API locally, make sure you have:

- Node.js 18 or newer
- npm installed
- A MongoDB instance or MongoDB Atlas connection
- Access to media storage and email delivery configuration from your hosting environment

## Installation

```bash
npm install
```

## Running the application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The backend listens on:

```text
http://localhost:3500
```

## API Overview

### Public routes

- `POST /register`
- `POST /login`
- `GET /refresh`
- `POST /logout`
- `POST /auth/request-password-reset`
- `POST /auth/reset-password/:token`
- `GET /foods`
- `GET /api/business-info`

### Protected routes

- `GET /api/orders`
- `GET /api/orders/user/:userId`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/status`
- `GET /api/users`
- `GET /api/settings`
- `POST /api/payment`
- `POST /foods`
- `PUT /foods/:id`
- `DELETE /foods/:id`

## Authentication and authorization

The API uses JWT access tokens and refresh tokens, with protected routes validating the token before fulfillment. Role-based access is enforced for administrative functions using the `user`, `admin`, and `superadmin` roles.

## Deployment notes

This service is designed for deployment in both traditional server environments and serverless-compatible hosting platforms. For production deployment, configure the required runtime settings in your hosting provider, keep your MongoDB connection secure, verify allowed origins, and ensure HTTPS and secure cookies are enabled.

## License

This project is licensed under the ISC license.

## Contributing

Contributions are welcome. Keep changes focused, document significant updates, and validate the API behavior before opening a pull request.
