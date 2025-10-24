# Shiksha Sankalp 🎓

Shiksha Sankalp is a real-time, role-based collaboration platform designed for educational institutes, educators, and students. Inspired by platforms like Discord and Slack, it provides a secure and organized environment for classroom communication, built with the MERN stack and Socket.io.



---

## 🚀 Core Features

* **Secure Authentication:** Users can register and log in with a secure system that uses **password hashing** (via `bcryptjs`).
* **Role-Based Access Control (RBAC):** Granular permissions for three distinct roles:
    * **Institute:** The "super-admin" with full permissions, including the ability to create new classrooms.
    * **Educator:** Can create and manage channels within a classroom.
    * **Student:** Can join classrooms using a unique classroom code and participate in channels.
* **Real-Time Messaging:** A low-latency, bi-directional messaging system built with **Socket.io**, allowing for instant communication without page refreshes.
* **Rich Text Editor:** A modern, `Tiptap`-based text editor for formatting messages (e.g., bold, italics, links, and more).
* **Client-Side Validation:** Robust and user-friendly form validation using `Zod` and `react-hook-form`.

---

## 🎥 Feature Walkthroughs

Here are brief video demonstrations for each key feature:

### 1. Secure Authentication & Role-Based Access
This video shows the user registration and login flow, as well as the different permissions for the Institute, Educator, and Student roles.

`[Link to Video: User Registration, Login, and Role Permissions]`

### 2. Classroom & Channel Management
This video demonstrates how an Institute can create a new classroom and how an Educator can add text/voice channels. It also shows the student's perspective of joining a classroom with a unique code.

`[Link to Video: Classroom & Channel Management]`

### 3. Real-Time Chat
This video showcases the core real-time messaging feature, with two users communicating instantly across different browsers.

`[Link to Video: Real-Time Chat in Action]`

---

## 🛠️ Technology Stack

This project is a full-stack application, separated into a backend API and a frontend client.

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | **Node.js** | The JavaScript runtime environment. |
| | **Express.js** | The server framework for building the RESTful API. |
| **Frontend** | **React.js** | A declarative library for building the user interface. |
| | **React Router** | For client-side routing and navigation. |
| | **Vite** | A modern, high-performance build tool for the frontend. |
| **Database** | **MongoDB (Atlas)** | A NoSQL database for storing user, classroom, and message data. |
| | **Mongoose** | An Object Data Modeler (ODM) to interface with MongoDB. |
| **Networking** | **Socket.io** | For real-time, event-based, bi-directional communication (WebSockets). |
| | **Axios** | A promise-based HTTP client for API requests. |
| **Security** | **JSON Web Tokens (JWT)** | Securely transmits user information (like `userId` and `role`) for authentication. |
| | **bcryptjs** | For hashing and salting user passwords before storing them. |
| | **cookie-parser** | For managing secure `httpOnly` cookies (likely for storing the JWT). |
| **State** | **Zustand** | A lightweight, modern state management solution for React. |
| **Email** | **Mailtrap** | For testing email-sending functionality (e.g., for password resets or verification). |
| **UI** | **Tailwind CSS** | A utility-first CSS framework for rapid UI development. |
| | **Radix UI** | For accessible, unstyled UI components. |
| | **Tiptap** | A headless, framework-agnostic rich-text editor. |

---

## 🏛️ Architecture & Concepts

This project demonstrates several key software architecture concepts that are critical for a modern, scalable, and secure application.

### 1. RESTful API with a Monorepo Structure

The project uses a monorepo structure where the `client` and `server` live in the same repository but operate independently. The frontend (React) communicates with the backend (Express) via a **RESTful API** for all non-real-time actions, such as login, registration, and fetching classroom data.

### 2. Secure Authentication Flow (JWT & Hashing)

Security is handled via a token-based authentication flow, which can be inferred from the `bcryptjs`, `jsonwebtoken`, and `cookie-parser` packages.

1.  **Registration:** A user signs up. Their password is *never* stored as plaintext. Instead, it is **hashed and salted** using `bcryptjs` and then stored in MongoDB.
2.  **Login:** A user logs in. `bcryptjs` compares their provided password with the stored hash.
3.  **Token Generation:** If successful, the server generates a **JSON Web Token (JWT)**, signing it with a secret key. This token contains a payload with non-sensitive data, such as the `userId` and, most importantly, their `role` (Institute, Educator, or Student).
4.  **Session Management:** This JWT is then sent to the client and stored (likely in a secure `httpOnly` cookie, managed by `cookie-parser`) for authenticating all future API requests.

### 3. Real-Time Networking (WebSockets)

The real-time chat functionality is built on **WebSockets** via `socket.io`. This establishes a persistent, low-latency, bi-directional **TCP connection** between a specific client and the server.

* When a user sends a message, the client doesn't make an `axios` (HTTP) request. Instead, it **`emits` a `sendMessage` event** over its socket.
* The `socket.io` server receives this event, processes the message (e.g., saves it to the database), and then **broadcasts** that message to all other clients connected to that specific classroom or channel.
* This architecture is highly efficient and scalable, providing an instant, "live" feel to the application.

---

## 🔮 Future Work & In-Progress Features

This project is actively in development. The following features are currently being built:

* [ ] **Assignment Creation:** Allowing Educators to create and assign tasks.
* [ ] **File Uploads:** Ability for users to share files (e.g., PDFs, images) in channels.
* [ ] **Direct Messaging:** 1-on-1 private messaging between users.
* [ ] **"Forgot Password"** functionality (using the `mailtrap` email service).
