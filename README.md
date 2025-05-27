## 🧱 Project Overview - Job Tracker App

### Purpose

Track your job applications, including the company, role, application status, and dates. Add filters and user authentication.

### Tech Stack

#### Frontend

- React.js - UI

- Tailwind CSS - Styling

- React-Qery and Axios - API calls

- React Router - Routing

- React Toastify - Notifications

- Vinejs - Form validation

- Zustand - State Management

#### Backend

- Node.js + Express.js - RESTful API

- MongoDB + Mongoose - Database

- JWT (JSON Web Token) - Authentication

- bcrypt.js - Password hashing

- CORS, dotenv, helmet, express-rate-limit - Security

- Coludinary and Multer - Store Assets

## 🔨 Key Features Frontend

### 🔐 Authentication

- Register/Login

- Secure JWT-based login

- Update User

- Logout

### 📋 Jobs CRUD

- Create job application

- View all jobs (pagination + sorting + filter)

- Edit/Delete jobs

### 🔍 Filters

- Filter by status: Applied, Interview, Rejected, Offer

- Search by company, position location

- Sort by newest/oldest

### 📈 Dashboard

- View job stats (total applied, interviews, offers)

- View charts (applications per month)

## 🔨 Key Features Backend

### Database Models

- User Model

- Job Models

### Routes:

#### 🔐 Auth Routes

- Post /api/v1/auth/register

- Post /api/v1/auth/login

- PUT /api/v1/auth/refresh-Token

- POST /api/v1/auth/logout

#### User Routes

- GET /api/v1/users/me (Get User)

- PUT /api/v1/users/me (Update User)

- PUT /api/v1/users/me/avatar (Update Avatar)

- DELETE /api/v1/users/me/avatar (Remove Avatar)

#### Jobs Routes

- POST /api/v1/applications (Create job)

- GET /api/v1/applications (List jobs)

- GET /api/v1/applications/:id (Get job)

- PUT /api/v1/applications/:id (Update job)

- DELETE /api/v1/appplications/:id (Delete job)

## Steps To Clone And Run

### Clone Repository

#### Run the following comman to clone repository

- clone both frontend and backend

```

#frontend
git@github.com:rajeshmurmu/job_tracker_frontend.git

#backend
git clone git@github.com:rajeshmurmu/job_tracker_backend.git

```

- check the env file and add your own

- install dependencies

```
# frontend
cd frontend

# install dependencies
npm install

# run the frontend app
npm run dev

# backend
cd backend

# install dependencies
npm install

# run the backend app
npm run dev
```
