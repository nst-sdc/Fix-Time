# ⏱️ FixTime – Queue-Free Booking Platform

**FixTime** is an open-source appointment booking platform built using the **MERN stack (MongoDB, Express, React, Node.js)**.

It helps eliminate long queues by allowing users to book time slots in advance — whether it's a hospital, clinic, salon, or any local service provider.

---

## 🧠 Problem

Everywhere you look, there are queues.  
About **99 million Indians** spend over **3 hours a day** standing in lines — leading to a productivity loss of nearly **297 lakh hours daily**.

Even in hospitals, people wait outside early in the morning just to get a token. And at local salons, customers often leave if they see 2–3 people waiting — leading to time waste on both sides.

---

## 💡 Our Solution: FixTime

FixTime is a **smart, real-time appointment scheduler** that:
- Lets users book slots online based on availability
- Helps service providers manage time efficiently
- Avoids crowding during peak hours
- Fills idle gaps during lean hours

Users save time.  
Providers get organized.  
Everyone wins.

---

## 🔧 Tech Stack

| Layer      | Technology            |
|------------|------------------------|
| Frontend   | React, React Router DOM, Axios |
| Backend    | Node.js, Express.js    |
| Database   | MongoDB, Mongoose      |
| Auth       | JWT (JSON Web Tokens), bcryptjs |
| Hosting    | *(Coming soon: Vercel + Render)* |

---

## 🚀 Getting Started (Local Setup)

### 🖥️ Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Git

---

### 📦 Installation

#### 1. Clone the repo
```bash
git clone https://github.com/nst-sdc/Fix-Time
cd Fix-Time
```

Set up the backend
```bash
cd server
npm install
touch .env
```

Add the following to .env
```
PORT=5001
MONGODB_URI=mongodb+srv://rudranshgupta:Rudra%40123@fix-time.uarfbdn.mongodb.net/?retryWrites=true&w=majority&appName=Fix-Time
JWT_SECRET=Hv6dQ6+s0f1+f62oJ27clu1nL0iMkYRwL0oi/6jXGfE=
```

Start the backend:
```bash
npm run dev
```
Server runs at: http://localhost:5001

Set up the frontend
```bash
cd ../client
npm install
npm install react-icons
npm start
```
Frontend runs at: http://localhost:3000



#### Ensure MongoDB is Running
Make sure MongoDB is installed and running on your local machine. On most systems, you can check with:
```bash
# Check if MongoDB is running
mongod --version
```

If not installed, follow these steps to install MongoDB:

##### macOS Installation
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

For other operating systems, follow the [official MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/).

#### Start the Applications
```bash
# Start the server (from server directory)
cd server
npm run dev

# Start the client (from client directory)
cd ../client
npm start
```

#### 5. Seed the Database with Demo Services
If you encounter the error **"No service ID available for booking"** when trying to book an appointment, you need to seed the database with services:

```bash
# Seed sample services (with server running)
curl -X POST http://localhost:5001/services/sample
```

This will create several sample services in different categories that you can use for testing appointment bookings.

---

🧪 API Endpoints
| Method | Route            | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register new user   |
| POST   | `/auth/login`    | Login existing user |
| GET    | `/`              | Test server route   |

📌 Project Structure
```bash
Fix-Time/
├── client/            # React frontend
│   ├── public/        # Public assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   │   ├── AppointmentBooking.jsx
│   │   │   ├── AppointmentDetails.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── pages/     # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── AppointmentPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── categories/  # Category-specific pages
│   │   │   └── ...
│   │   ├── utils/     # Utility functions
│   │   ├── App.js     # Main application component
│   │   └── index.js   # Entry point
│   └── package.json   # Frontend dependencies
├── server/                             # Backend - Express & MongoDB
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── appointmentController.js
│   │   │   ├── authController.js
│   │   │   ├── reviewController.js
│   │   │   ├── serviceController.js
│   │   │   ├── providerController.js     # NEW - For provider-specific logic
│   │   │   └── receiverController.js     # NEW - For receiver-specific logic
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── roleAuth.js               # NEW - Protect role-based routes
│   │   ├── models/
│   │   │   ├── Appointment.js
│   │   │   ├── Review.js
│   │   │   ├── Service.js
│   │   │   ├── User.js                   # Current user model
│   │   │   ├── Provider.js               # NEW - Will replace User
│   │   │   └── Receiver.js               # NEW - Will replace User
│   │   ├── routes/
│   │   │   ├── appointments.js
│   │   │   ├── auth.js
│   │   │   ├── reviews.js
│   │   │   ├── services.js
│   │   │   ├── providers.js              # NEW - Provider endpoints
│   │   │   └── receivers.js              # NEW - Receiver endpoints
│   │   ├── utils/
│   │   │   └── roleUtils.js              # NEW - Helpers for roles
│   │   ├── seedServices.js              # Seeder for dummy service data
│   │   └── index.js                     # Main server entry
│   ├── .env           # Environment variables (gitignored) Mongo URI, JWT secret, etc
│   ├── package.json
│   ├── package.json   # Backend dependencies
│   ├── .gitignore
│   └── README.md
├── Contribution.md           
└── README.md          # Project documentation
```

## 🤝 Contributing
Want to contribute to FixTime? Awesome!
We're just getting started, and we welcome contributions of all kinds:

•Code improvements

•UI design

•Bug fixes

•Feature suggestions

•Documentation


## 💡 To contribute:

1.Fork the repo

2.Create a new branch (```git checkout -b feature-name```)

3.Commit your changes

4.Push and make a PR

## 🔭 Roadmap (Planned Features)

 •Add time slot selection UI

 •Provider dashboard for availability

 •Booking confirmation via email/SMS

 •Analytics for providers

## 📃 License
This project is licensed under the MIT License.

### ⚡ If this repo helped you, consider giving it a ⭐ and sharing it with others!
