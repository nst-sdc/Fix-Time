# ⏱️ FixTime – Queue-Free Booking Platform

**FixTime** is an open-source appointment booking platform built using the **MERN stack (MongoDB, Express, React, Node.js)**.

It helps eliminate long queues by allowing users to book time slots in advance — whether it’s a hospital, clinic, salon, or any local service provider.

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
MONGODB_URI=mongodb://localhost:27017/fixtime
JWT_SECRET=thisissecretkey
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

🧪 API Endpoints
| Method | Route            | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register new user   |
| POST   | `/auth/login`    | Login existing user |
| GET    | `/`              | Test server route   |

📌 Project Structure
```bash
Fix-Time/
├── client/     # React frontend
├── server/     # Express backend
│   ├── src/
│   │   ├── models/   # Mongoose schemas
│   │   ├── routes/   # API routes
│   │   └── index.js  # Main server file
├── .env
├── README.md
└── .gitignore
```

## 🤝 Contributing
Want to contribute to FixTime? Awesome!
We’re just getting started, and we welcome contributions of all kinds:

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
