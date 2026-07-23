# 📓 Life Journal

> *Capture your day in less than five minutes.*

Life Journal is a modern full-stack journaling web application built to help users record their daily thoughts, moods, and experiences in a simple and organized way. The application focuses on a clean user experience while demonstrating real-world full-stack development using React, Node.js, Express, and DynamoDB.

This project is being built with a production-oriented approach, where every feature is designed, implemented, reviewed, and tested before moving to the next.

---

# 🚀 Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* HttpOnly Cookie Authentication
* Protected Routes
* Persistent Login
* Logout

> Future Enhancement

* Google OAuth
* GitHub OAuth

---

## Dashboard

* Welcome Message
* Writing Streak
* Total Journal Entries
* Today's Journal Status
* Recent Journal Entries

---

## Journal

* Create Journal Entry
* View Journal Entry
* Edit Journal Entry
* Delete Journal Entry

Each journal contains:

* Title
* Mood
* Tags
* Content
* Created Date
* Updated Date

---

## Timeline

* View All Journal Entries
* Search Entries
* Filter by Mood
* Filter by Tags
* Sort Entries

---

## Insights

* Writing Streak
* Mood Distribution
* Monthly Activity
* Most Used Tags
* Total Journals

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Database

* Amazon DynamoDB

## Authentication

* JWT
* bcrypt
* HttpOnly Cookies

## Deployment

* Frontend: Vercel
* Backend: AWS / Render
* Database: Amazon DynamoDB

---

# 📂 Project Structure

```text
life-journal/

├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# 🗄 Database Design

## Users

| Field        | Type   |
| ------------ | ------ |
| userId       | UUID   |
| name         | String |
| email        | String |
| passwordHash | String |
| createdAt    | Date   |

---

## Journals

| Field     | Type   |
| --------- | ------ |
| journalId | UUID   |
| userId    | UUID   |
| title     | String |
| content   | String |
| mood      | String |
| tags      | Array  |
| createdAt | Date   |
| updatedAt | Date   |

---

# 🌐 API Overview

## Authentication

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register user    |
| POST   | `/api/auth/login`    | Login            |
| POST   | `/api/auth/logout`   | Logout           |
| GET    | `/api/auth/me`       | Get current user |

---

## Journal

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| GET    | `/api/journals`     | Get all journals |
| GET    | `/api/journals/:id` | Get journal      |
| POST   | `/api/journals`     | Create journal   |
| PUT    | `/api/journals/:id` | Update journal   |
| DELETE | `/api/journals/:id` | Delete journal   |

---

## Dashboard

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/dashboard` | Dashboard summary |

---

# ✅ Development Checklist

## Planning

* [ ] Finalize requirements
* [ ] Finalize UI design
* [ ] Design database
* [ ] Design APIs

## Project Setup

* [ ] Initialize React project
* [ ] Initialize Express project
* [ ] Configure Tailwind CSS
* [ ] Configure environment variables
* [ ] Connect frontend and backend

## Database

* [ ] Configure DynamoDB
* [ ] Create Users table
* [ ] Create Journals table

## Authentication

* [ ] Register
* [ ] Login
* [ ] JWT Authentication
* [ ] Protected Routes
* [ ] Logout

## Dashboard

* [ ] Dashboard UI
* [ ] Dashboard API

## Journal

* [ ] Create Entry
* [ ] View Entry
* [ ] Edit Entry
* [ ] Delete Entry

## Timeline

* [ ] Search
* [ ] Filters
* [ ] Sorting

## Insights

* [ ] Mood Analytics
* [ ] Writing Streak
* [ ] Monthly Statistics

## Deployment

* [ ] Deploy Backend
* [ ] Deploy Frontend
* [ ] Configure Production Environment

## Future Enhancements

* [ ] Google OAuth
* [ ] GitHub OAuth
* [ ] Dark Mode
* [ ] Rich Text Editor
* [ ] Image Attachments
* [ ] Export Journal as PDF
* [ ] Email Reminders

---

# 🧑‍💻 Development Workflow

Every feature will follow the same implementation process:

1. Define the requirement
2. Design the UI
3. Design the API
4. Design the database changes
5. Implement the backend
6. Implement the frontend
7. Integrate both
8. Test the feature
9. Review and refactor
10. Commit with a meaningful Git message

---

# 🎯 Project Goal

The primary goal of Life Journal is to build a real-world full-stack application while learning:

* React
* Node.js
* Express
* DynamoDB
* REST API Design
* Authentication & Authorization
* Modern Frontend Architecture
* Backend Architecture
* Deployment
* Software Engineering Best Practices

By the end of the project, the application should be production-ready, responsive, secure, and easily extensible for future features such as OAuth authentication and additional integrations.
