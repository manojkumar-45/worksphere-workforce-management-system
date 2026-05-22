# WorkSphere – Workforce Management System

WorkSphere is a modern full-stack web application designed to help organizations efficiently manage employees, attendance, payroll, shifts, and leave requests.

The application provides a centralized dashboard for HR and management teams to streamline workforce operations with secure authentication, analytics, and employee management features.

---

# 🚀 Features

- 👨‍💼 Employee Management System
- 📅 Attendance Tracking
- 🕒 Shift Management
- 📝 Leave Request Management
- 💰 Payroll Management
- 📊 Dashboard Analytics
- 🔐 Secure Authentication & Authorization
- 👤 User Registration and Login
- ⚡ Responsive and Modern UI
- 📈 Employee Statistics and Reports

---

# 🛠️ Tech Stack

## 🎨 Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Chart.js
- React ChartJS 

## ⚙️ Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- REST APIs
- JWT Authentication
- Bean Validation

## 🗄️ Database
- MySQL

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/wms.git
cd wms
```

---

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## 3️⃣ Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

# 🌐 Database Configuration

Configure MySQL credentials inside:

```bash
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/wms
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# 📂 Project Structure

```bash
WMS/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/main/java/com/wms/backend/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── security/
│   │   ├── service/
│   │   └── config/
│   ├── src/main/resources/
│   └── pom.xml
│
└── README.md
```

---

# 📊 Main Modules

- 🏠 Dashboard
- 👨‍💼 Employee Management
- 📅 Attendance Management
- 🕒 Shift Scheduling
- 📝 Leave Management
- 💰 Payroll System
- 🔐 Authentication & Security

---

# 🔒 Security Features

- Spring Security integration
- JWT-based authentication
- Protected frontend routes
- Secure REST API handling
- Authentication validation

---

# 📈 Dashboard & Analytics

The dashboard provides:

- Employee statistics
- Attendance overview
- Payroll summaries
- Leave analytics
- Workforce insights using charts and graphs

---

# 🎯 Future Improvements

- 📱 Improved mobile responsiveness
- 📊 Advanced analytics and reports
- 📧 Email notifications for leave approvals
- ☁️ Cloud deployment support
- 📥 Export payroll reports as PDF/Excel
- 🔔 Attendance alerts and reminders
- 🌍 Multi-role access management

---
