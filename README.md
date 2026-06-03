<div align="center">

# 📝 Aletheia.

### A blog platform with authentication, protected routes, and an admin dashboard.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

</div>

---

## 📌 Overview

**Aletheia** is a blog application where users can sign up, log in, and read blog posts. It features Google authentication, email/password authentication, protected routes, and a dedicated admin panel for managing users and posts — all powered by Firebase.

---

## ✨ Features

- 🔐 **Email & Password Authentication** — Secure signup and login with Firebase Auth
- 🔵 **Google Sign-In** — One-click login with Google
- 🛡️ **Protected Routes** — Dashboard and inner pages are accessible only after login
- 👑 **Admin Dashboard** — Admin-only panel to manage users and blog posts
- 🗄️ **Firestore Database** — Users and posts stored in Firebase Firestore
- 📱 **Fully Responsive** — Works seamlessly on mobile and desktop
- ⚡ **Fast & Modern** — Built with Vite for lightning-fast development

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| Routing | React Router DOM v6 |
| Authentication | Firebase Auth |
| Database | Firebase Firestore |
| State Management | React Context API |

---

## 📁 Project Structure

```
src/
  components/
    config.js           # Firebase configuration
    AuthContext.jsx     # Global auth state provider
    useAuth.js          # Custom auth hook
    ProtectedRoute.jsx  # Route guards (auth + admin)
    Login.jsx           # Login page
    Signup.jsx          # Signup page
    Dashboard.jsx       # Main blog dashboard (protected)
    Admin.jsx           # Admin panel (admin only)
  App.jsx               # Routes setup
  main.jsx              # App entry point
  index.css             # Global styles + Tailwind
```


<div align="center">

Made with ❤️ by **Biyas Pal**

</div>
