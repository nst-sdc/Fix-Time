# ⏱️ FixTime - Queue-Free Booking Platform

A full-stack web application where customers can seamlessly book appointments and service providers can efficiently manage their schedules.

Built as a **real-world open-source project** under the mentorship of faculty and the Software Development Club at Newton School of Technology, **FixTime** helps reduce queue wait times by offering a smart scheduling experience. The application features role-based dashboards, slot-based booking, and reviews — designed to save time for both users and service providers.

---

## ❓ Problem

In many public and private service sectors like clinics, salons, or government offices, customers face long queues and inefficient walk-in systems. This leads to frustration, poor customer satisfaction, and wasted time for both clients and service providers.

---

## 💡 Solution

**FixTime** eliminates the chaos of waiting lines by offering a seamless, real-time appointment booking system. It empowers users to book slots based on provider availability while enabling service providers to manage bookings efficiently through a dedicated dashboard. This enhances convenience, optimizes schedules, and improves user experience for all parties involved.

---

## 🔗 Live Website

* **Frontend:** [https://fix-time-7.vercel.app](https://fix-time-7.vercel.app)
* **Backend:** [https://fixtime-i368.onrender.com](https://fixtime-i368.onrender.com)

---

## ✨ Features

### 📅 For Users:

* Browse services by category (hospital, salon, etc.)
* Book appointment slots in real-time
* View upcoming and past appointments
* Leave reviews and ratings
* Calendar integration for upcoming bookings
* Email confirmation on successful bookings

### 🧑‍🎓 For Service Providers:

* Create and manage offered services
* Set available time slots
* View/manage incoming appointments
* Respond to reviews
* View analytics of appointments and feedback
* Manage availability on a dynamic calendar view

### ✅ General:

* Role-based dashboards (Customer & Provider)
* Auth with JWT and bcrypt
* Dark/light theme toggle
* Responsive design
* Error handling and form validation
* Environment variable support for API configuration

---

## 🛠️ Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | React, React Router DOM, Axios, CSS Modules |
| Backend    | Node.js, Express.js                         |
| Database   | MongoDB, Mongoose                           |
| Auth       | JWT, bcrypt.js                              |
| Deployment | Vercel (Frontend), Render (Backend)         |

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/nst-sdc/Fix-Time.git
cd Fix-Time
```

### 2. Backend Setup

```bash
cd server
npm install
touch .env
```

**Add this in `.env`:**

```env
PORT=5001
MONGODB_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
```

Start the backend:

```bash
npm run dev
```

Visit: [http://localhost:5001](http://localhost:5001)

---

### 3. Frontend Setup

```bash
cd ../client
npm install
npm install react-icons
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5001
```

Start the app:

```bash
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

---

### 4. Seed Sample Data

To test bookings:

```bash
curl -X POST http://localhost:5001/services/sample
```

---

## 🕵️ Folder Structure

```bash
Fix-Time/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages (Home, Dashboard, Auth, etc.)
│   │   ├── utils/          # Helper functions
│   │   └── App.js
│   └── public/
├── server/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Logic handlers
│   │   ├── routes/         # All API endpoints
│   │   ├── models/         # Mongoose schemas
│   │   ├── middleware/     # Auth middlewares
│   │   └── index.js        # Entry file
│   └── seedServices.js     # Seeder script
└── README.md
```

---

## 🌐 API Routes Overview

| Method | Route                    | Description                    |
| ------ | ------------------------ | ------------------------------ |
| POST   | `/auth/register`         | Register new user              |
| POST   | `/auth/login`            | Login existing user            |
| GET    | `/appointments/user`     | Get upcoming/past appointments |
| POST   | `/appointments/book`     | Book a slot                    |
| GET    | `/services/category/:id` | Get services by category       |
| POST   | `/reviews/submit`        | Submit a review                |
| GET    | `/profile`               | Fetch user profile info        |
| PATCH  | `/appointments/update`   | Cancel/reschedule appointments |

---

## 🤝 Contributing

We welcome contributions of all types:

* Feature additions
* UI improvements
* Bug fixes
* Documentation enhancements

**Steps to contribute:**

1. Fork the repo
2. Create a branch: `git checkout -b feature-name`
3. Make changes and commit: `git commit -m "add feature"`
4. Push changes: `git push origin feature-name`
5. Open a Pull Request

---

## 🔍 Roadmap

* Provider analytics dashboard
* Email/SMS confirmations
* Google Calendar integration
* Searchable service listing
* Admin panel (for moderation)
* Notification system for appointment reminders
* Review moderation system for providers
* PWA support for mobile responsiveness

---

## 🎓 Built By

This project was developed by a student team at **Newton School of Technology**, as part of a real-world software initiative led by **NST-SDC** (Software Development Club).

*Rudransh Gupta* (rudransh.gupta@adypu.edu.in)

*Naman Gupta* (naman.gupta@adypu.edu.in)

*Ipshita Patel* (ipshita.patel@adypu.edu.in)

*Priyabrata Singh* (priyabrata.singh@adypu.edu.in)

*Shreyas Sarkar* (shreyas.sarkar@adypu.edu.in)

*Sarthak Ghoderao* (sarthak.ghoderao@adypu.edu.in)

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

### ⭐ If you like this project, give it a star and share it with others!
