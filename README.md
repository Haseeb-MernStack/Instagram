# Instagram Full-Stack Project

This project is a full-stack implementation of an Instagram-like application. It includes both frontend and backend components, built with modern technologies.

## Project Structure

### Frontend

The frontend is built using React and Vite for fast development and performance. It includes the following key routes:

- **Home Page (`/`)**: Displays a feed of posts.
- **Login Page (`/login`)**: Allows users to log in.
- **Signup Page (`/signup`)**: Allows new users to register.
- **Profile Page (`/profile/:username`)**: Displays user-specific posts and profile information.

### Backend

The backend is built using Node.js and Express. It provides RESTful APIs for the following key routes:

- **Authentication Routes (`/api/auth`)**:
  - `POST /login`: Logs in a user.
  - `POST /signup`: Registers a new user.
- **User Routes (`/api/users`)**:
  - `GET /:id`: Fetches user details.
  - `PUT /:id`: Updates user information.
- **Post Routes (`/api/posts`)**:
  - `GET /`: Fetches all posts.
  - `POST /`: Creates a new post.
  - `DELETE /:id`: Deletes a post.

## Technologies Used

### Frontend

- React
- Vite
- CSS Modules

### Backend

- Node.js
- Express
- MongoDB (Database)

## How to Run the Project

### Prerequisites

- Node.js installed
- MongoDB instance running

### Steps

1. Clone the repository.
2. Navigate to the `frontend` folder and run:
   ```bash
   npm install
   npm run dev
   ```
