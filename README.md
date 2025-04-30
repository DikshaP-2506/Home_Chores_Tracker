# Home_Chores_Tracker

A full-stack web application for tracking and managing family chores. Built with React, Node.js, Express, and PostgreSQL.

## Features

- User authentication and registration
- Add and manage family members
- Create, assign, and track chores
- Mark chores as completed
- Dashboard with chore completion statistics
- Mobile-responsive design

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- Bootstrap for styling
- Font Awesome for icons

### Backend
- Node.js
- Express.js
- PostgreSQL database
- bcryptjs for password hashing
- JSON Web Tokens for authentication

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- PostgreSQL database

### Database Setup
1. Create a PostgreSQL database named `chores_tracker`
2. Use the SQL script in `backend/database.sql` to create the required tables

### Backend Setup
1. Navigate to the backend directory: `cd chores-tracker/backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=chores_tracker
   JWT_SECRET=your_secret_key
   ```
4. Start the server: `npm start`

### Frontend Setup
1. Navigate to the frontend directory: `cd chores-tracker/frontend`
2. Install dependencies: `npm install`
3. Start the application: `npm start`
4. The app will be available at http://localhost:3000

## Project Structure

### Backend
- `server.js` - Express application setup and main entry point
- `db.js` - PostgreSQL database connection
- `middleware/auth.js` - Authentication middleware
- `routes/` - API routes for users, family members, and chores
- `database.sql` - SQL schema for database setup

### Frontend
- `src/App.js` - Main application component with routing
- `src/context/AuthContext.js` - Authentication context
- `src/components/auth/` - Authentication components (Login, Register)
- `src/components/family/` - Family members management
- `src/components/chores/` - Chores management
- `src/components/pages/` - Page components (Home, Dashboard)
- `src/components/layout/` - Layout components (Navbar)

