# Student Grievance Management System

A full-stack MERN application that allows students to submit, manage, and track their grievances online. The system provides secure authentication and complete grievance management through a clean, responsive interface.

## Features

* Student registration and login using JWT authentication
* Create new grievances with relevant details
* View all submitted grievances
* View a single grievance by ID
* Update grievance information
* Delete grievances
* Protected API routes for authenticated users
* Responsive frontend built with React
* MongoDB database integration

## Tech Stack

### Frontend

* React
* Vite
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* bcrypt.js
* dotenv

## Project Structure

```text
student-grievance-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/student-grievance-system.git
cd student-grievance-system
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| POST   | `/api/register` | Register a new user    |
| POST   | `/api/login`    | Login an existing user |

### Grievances

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | `/api/grievances`     | Create a new grievance |
| GET    | `/api/grievances`     | Get all grievances     |
| GET    | `/api/grievances/:id` | Get a grievance by ID  |
| PUT    | `/api/grievances/:id` | Update a grievance     |
| DELETE | `/api/grievances/:id` | Delete a grievance     |

## Example Request Body

### Register User

```json
{
  "name": "Aryan Singh",
  "email": "example@email.com",
  "password": "yourpassword"
}
```

### Login User

```json
{
  "email": "example@email.com",
  "password": "yourpassword"
}
```

### Create Grievance

```json
{
  "title": "Issue with library facilities",
  "description": "The library computers are not functioning properly.",
  "category": "Infrastructure"
}
```

## Authentication

After successful login, the server returns a JWT token. This token must be sent in the request headers for protected grievance routes.

```text
Authorization: Bearer your_jwt_token
```

## Deployment

* Frontend deployed using **Vercel**
* Backend deployed using **Render**
* Database hosted using **MongoDB Atlas**

Before deployment, make sure to add all environment variables in the deployment platform settings.

## Future Improvements

* Add student and admin roles
* Add grievance status tracking such as Pending, In Progress, and Resolved
* Add file upload support for grievance evidence
* Add email notifications for grievance updates
* Add admin dashboard with analytics
* Add filtering and search functionality
* Add complaint priority levels

## Author

**Aryan Singh**
B.Tech CSE (AI & ML)
KIET Group of Institutions

## License

This project is created for educational and learning purposes.

