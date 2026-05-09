# TASKFLOW - Team Task Manager

A full-stack task management web application where teams can create projects, assign tasks, track progress, and manage workflows with role-based access control.

---

## Features

- User Authentication (Signup/Login)
- JWT-based Authorization
- Role-Based Access Control (Admin/Member)
- Project Management
- Task Creation & Assignment
- Task Status Tracking
- Dashboard Analytics
- Protected Routes
- Responsive UI

---

## Roles

### Admin
- Create Projects
- Add Members
- Create Tasks
- Delete Tasks
- View All Project Tasks

### Member
- View Assigned Projects
- Update Task Status
- Track Progress

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

### Deployment
- Vercel (Frontend)
- Railway (Backend)

---

## Folder Structure

```bash
client/
server/

Installation & Setup
Clone Repository
git clone YOUR_GITHUB_REPO_LINK
Backend Setup
cd server
npm install
npm run dev

Backend runs on:

http://localhost:8000

Frontend Setup
cd client
npm install
npm run dev

Frontend runs on:

http://localhost:5173
