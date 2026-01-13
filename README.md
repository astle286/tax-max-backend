# 🧾 Tax Max 

A modular **backend system for tax and family expense management**, built with **Python** and designed for scalability. This project uses a **microservice architecture** with separate services for authentication, tax calculations, family management, and exports — all orchestrated via **Docker Compose**.

---

## 🚀 Features
- 🔐 **Auth Service** – Secure user authentication and authorization  
- 👨‍👩‍👧 **Family Service** – Manage family members and relationships  
- 💸 **Tax Service** – Calculate and manage tax-related data  
- 📤 **Export Service** – Export reports and data in structured formats  
- 🐳 **Dockerized setup** – Easy local development and deployment  
- 🗄️ **SQL initialization scripts** – Preconfigured databases for each service  

---

## 🛠️ Tech Stack
- **Language:** Python  
- **Framework:** Flask (per service)  
- **Database:** PostgreSQL (per service, initialized via SQL scripts)  
- **Containerization:** Docker & Docker Compose  
- **Architecture:** Microservices (auth, family, tax, export)  

---

## 📂 Project Structure
```
tax-max-backend/
├── auth-service/          # Authentication microservice
├── family-service/        # Family management microservice
├── tax-service/           # Tax calculation microservice
├── export-service/        # Export/reporting microservice
├── init-auth-db.sql       # Auth DB initialization
├── init-family-db.sql     # Family DB initialization
├── init-tax-db.sql        # Tax DB initialization
├── docker-compose.yml     # Multi-service orchestration
└── README.md              # Project documentation
```

---

## ⚡ Quick Start

### 1️⃣ Clone the repository
```bash
git clone https://github.com/astle286/tax-max-backend.git
cd tax-max-backend
```

### 2️⃣ Build and run with Docker Compose
```bash
docker-compose up --build
```

### 3️⃣ Access services
- Auth Service → `http://localhost:5001`  
- Family Service → `http://localhost:5002`  
- Tax Service → `http://localhost:5003`  
- Export Service → `http://localhost:5004`  

---

## 🧪 Database Initialization
Each service comes with its own SQL script for database setup:

```bash
psql -U postgres -f init-auth-db.sql
psql -U postgres -f init-family-db.sql
psql -U postgres -f init-tax-db.sql
```

---

## 🌍 Deployment Notes
- Designed for **cloud deployment** with container orchestration.  
- Each service runs independently, making scaling easier.  
- Logs can be integrated with monitoring tools like **AWS CloudWatch**.  

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## 📜 License
This project is licensed under the MIT License.  

---
