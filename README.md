# 🎓 Study-Sphere - A Collaborative Study Platform

Welcome to **Study-Sphere**, a powerful and responsive educational platform built for students, tutors, and admins to collaborate, manage study sessions, and enhance learning experiences.

🌐 **Live Site**: [https://study-sphere-fb1d4.web.app](https://study-sphere-fb1d4.web.app)

📁 **Client Repo**: [Client GitHub](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-jamilWebdesign2024)  
📁 **Server Repo**: [Server GitHub](https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-jamilWebdesign2024)

🔐 **Admin Credentials:**
- Email: `admin@studysphere.com`
- Password: `admin123`

---

## 🚀 Key Features

- 🧾 **JWT Authentication** (Email/Password & Google)
- 👥 **Role-Based Access Control** (Student / Tutor / Admin)
- 📅 **Study Session Creation & Booking**
- 📝 **Notes & Review System for Students**
- 🧑‍🏫 **Tutor Material Uploading & Session Control**
- 🛡️ **Admin Dashboard** for managing users, sessions, and content
- 🌍 **Fully Responsive** across mobile, tablet, and desktop
- 🔐 **Protected Routes** with token persistence on reload
- ⚙️ **TanStack Query** used for all GET API calls
- 🌈 **SweetAlert2 & Toastify** for all notifications and CRUD feedback
- 📦 **.env-secured** Firebase & MongoDB credentials

---

## ✨ Homepage Sections

1. 🔝 Navbar with dynamic login/logout and dashboard routing
2. 🎯 Hero Banner with call-to-action
3. 🗂️ Available Study Sessions (Only approved ones shown)
4. 📚 Popular Study Categories
5. 👨‍🏫 Featured Tutors
6. 📞 Footer with social and contact info

---

## 📁 Tech Stack

- **Frontend:** React, React Router DOM, TailwindCSS, DaisyUI, Framer Motion
- **Backend:** Node.js, Express.js, MongoDB, JWT
- **Authentication:** Firebase Auth (Email/Password, Google)
- **API Data Fetching:** Axios + TanStack Query
- **File Hosting:** ImgBB (Material/Image Uploads)
- **Payment Gateway:** Stripe
- **Other Tools:** React Hook Form, React Toastify, SweetAlert2, Date-fns

---

## 🔐 Role-Based Dashboards

### 🧑‍🎓 Student Dashboard
- ✅ View & Book Sessions
- 📝 Create & Manage Notes
- ⭐ Submit Ratings & Reviews
- 📥 Download Materials (Images & Drive links)

### 👨‍🏫 Tutor Dashboard
- ➕ Create Sessions
- 📤 Upload Materials
- 👀 View Own Sessions with Rejection Feedback

### 👨‍💼 Admin Dashboard
- 🔍 Search & Manage Users (with role update)
- 📜 Approve/Reject Study Sessions with modal feedback
- 🧹 View/Delete Materials
- 📢 Make Announcements *(optional feature)*

---

## 🔄 Pagination

- 📄 Tutors Page  
- 📄 Admin → All Users Page

---

## 🔑 Authentication Strategy

- Email/Password Login (with role selection)
- Google OAuth (default role: student)
- JWT Token stored in `localStorage`
- Axios interceptor to attach token
- Middleware for role-based route protection

---

## 🌟 Bonus Features

- 🧠 Classmate Viewer by Session *(student dashboard)*
- 📢 Public Announcements page
- 🔒 Token-secured route refresh persistence

---

## 🛠️ Environment Variables (`.env`)

