# 🛍️ E-Market LunaLuxe – Frontend Dashboard & State Management

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-Toolkit-purple?logo=redux)
![React Query](https://img.shields.io/badge/React_Query-Data_Fetching-red?logo=reactquery)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-blue?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

> **Brief 2 – E-Market Frontend : Dashboard & State Management**  
> 📅 _Duration:_ 10/11/2025 → 21/11/2025  
> 👥 _Team:_ 4 full stack developers  

---

## 👨‍💻 Team Members (GitHub)

| Name | GitHub Username |
|------|-----------------|
| Mohammed Latrach | [@LatrachDev](https://github.com/LatrachDev) |
| Younes Imouga | [@Younes-Imouga](https://github.com/Younes-Imouga) |
| Ikram Benallali | [@ikrambenallali](https://github.com/ikrambenallali) |
| Samira Kibous | [@samirakibous](https://github.com/samirakibous) |

---

## 🎯 Project Overview

The **E-Market LunaLuxe** frontend transforms a simple React marketplace into a **complete, secure, and scalable application** featuring:

- 🔐 **JWT Authentication** with role-based dashboards (`user`, `seller`, `admin`)
- ⚙️ **Global State Management** (Redux Toolkit / Context API)
- 🔄 **Optimized Data Fetching** with React Query
- 🛒 **Cart and Checkout System**
- 🧩 **Modular Dashboard** for each role
- 🧠 **Testing (Unit & Integration)** using Jest and React Testing Library
- 🎨 **Responsive, modern UI** with TailwindCSS and optional Framer Motion animations

---

## 🧱 Features by Role

| Role | Dashboard | Key Features |
|------|------------|---------------|
| 👤 **User** | Profile / Cart / Orders | Manage profile, view & checkout cart |
| 🏪 **Seller** | My Products / Orders / Coupons | CRUD products, manage orders & coupons |
| 🛠 **Admin** | Users / Reviews / Logs | Manage users, reviews, and platform data |

Each dashboard includes:
- Role-based navigation  
- Data fetched with React Query  
- Secure access through protected routes  

---

## ⚙️ Tech Stack

| Domain | Tools |
|--------|--------|
| **Framework** | React 18 (Vite) |
| **State Management** | Redux Toolkit / Context API |
| **Data Fetching** | React Query + Axios |
| **Routing** | React Router v6 |
| **Validation** | React Hook Form + Yup |
| **Auth & Security** | JWT, Axios interceptors |
| **UI** | TailwindCSS / MUI |
| **Testing** | Jest, React Testing Library, MSW |
| **Version Control** | GitHub Flow, Pull Requests |

---

## 🧩 Key Functionalities

### 1️⃣ Authentication & Roles
- Login & register connected to backend API  
- Role-based dashboards (`user`, `seller`, `admin`)  
- Token handling via `localStorage`  
- Protected routes and Axios interceptors  

### 2️⃣ Global State Management
- Store structured into slices:  
  - `userSlice`, `productsSlice`, `cartSlice`, `ordersSlice`  
- Efficient updates with React Query cache invalidation  

### 3️⃣ Cart & Checkout
Endpoints consumed:
| Method | Route | Description |
|--------|--------|-------------|
| `GET` | `/cart` | Get current user’s cart |
| `POST` | `/cart` | Add item to cart |
| `PATCH` | `/cart/:id` | Update quantity |
| `DELETE` | `/cart/:id` | Remove item |
| `POST` | `/orders` | Create order from cart |

UI:
- `/cart` page displays cart items, total price, and coupon management  
- “Validate my order” → creates order and redirects to user dashboard  

### 4️⃣ Testing
- **Unit tests:** UI components, hooks, reducers  
- **Integration tests:** Auth, dashboard access, cart/checkout flows  
- **Tools:** Jest, React Testing Library, MSW  

Example scripts:
```json
"scripts": {
  "test": "jest --watchAll=false",
  "test:coverage": "jest --coverage"
}
```

---

## 🧪 Example Test Cases

| ID | Feature | Type | Scenario | Expected Result |
|----|----------|------|-----------|------------------|
| T-01 | Login | Integration | Given a valid user → When they log in → Then redirect to their dashboard | ✅ `/dashboard/user` |
| T-02 | Cart | Unit | Given 2 items and a -10% coupon → When applied → Then total recalculated | ✅ Total = 90€ |
| T-03 | Admin Access | Integration | Given a regular user → When accessing `/admin` → Then redirected to `/` | ✅ 403 Redirect |

---

## 🧠 Project Structure

```
E-Market-LunaLuxe/
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Role-based pages (User, Seller, Admin)
│   ├── store/             # Redux Toolkit slices
│   ├── hooks/             # Custom hooks (useAuth, useCart, etc.)
│   ├── api/               # Axios setup & endpoints
│   ├── utils/             # Helpers and constants
│   └── App.jsx            # Main app routing
│
├── tests/                 # Jest & RTL tests
├── public/                # Static assets
├── package.json
├── README.md
└── vite.config.js
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- npm or yarn
- Backend API (Laravel or Express) running locally or deployed

### Steps
```bash
# Clone the repository
git clone https://github.com/LatrachDev/E-Market-LunaLuxe.git

# Navigate to the project
cd E-Market-LunaLuxe

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Update API base URL and JWT secret if needed

# Start the development server
npm run dev
```

---

## 📘 Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest test suite |
| `npm run test:coverage` | Run tests with coverage report |

---

## 🎨 Design & UI
- Based on Figma design from Brief 1  
- Added dashboards and cart flow  
- Responsive and accessible  
- TailwindCSS + Framer Motion for animations  

---

## 🧾 Deliverables

- ✅ GitHub repository (shared)
- ✅ Complete README (this file)
- ✅ Role-based dashboard (user/seller/admin)
- ✅ Cart & checkout features
- ✅ Testing plan + test files
- ✅ Figma link of updated dashboard
- 🎥 (Optional) Demo video

---

## 🧮 Evaluation Criteria

✔ Functional JWT authentication & roles  
✔ Fully working dashboards  
✔ Cart & checkout functional  
✔ Redux/Context state management  
✔ Data fetching with React Query  
✔ Form validation & token security  
✔ Responsive, clean UI  
✔ Documented tests (unit & integration)  
✔ Clear README & organized repo  

---

## 📜 License
This project is released under the **MIT License**.

---

### 💬 Contact
If you’d like to collaborate or report an issue, feel free to reach out through the [Issues tab](https://github.com/LatrachDev/E-Market-LunaLuxe/issues).

---

> **E-Market LunaLuxe – Built with ❤️ by the YouCoders Squad**
