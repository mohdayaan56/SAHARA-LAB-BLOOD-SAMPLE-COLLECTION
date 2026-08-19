# 🩸 SAHARA LAB – Blood Sample Collection

A modern and user-friendly **Blood Sample Collection Management System** designed to streamline the process of collecting, registering, tracking, and managing patient blood samples in a laboratory environment.

## 📌 About the Project

**SAHARA LAB – Blood Sample Collection** is a digital solution developed to simplify laboratory sample collection and reduce manual paperwork.

The system helps laboratory staff manage patient information, sample details, collection records, and sample status efficiently while maintaining organized and accessible records.

## ✨ Key Features

* 🧑‍⚕️ **Patient Registration** – Store and manage patient details.
* 🩸 **Blood Sample Collection** – Record sample collection information.
* 🏷️ **Sample Identification** – Assign unique identifiers to samples.
* 📋 **Sample Tracking** – Track the status of collected samples.
* 🔍 **Search & Manage Records** – Quickly find patient and sample information.
* 📊 **Dashboard** – View important collection statistics and records.
* 🔐 **Secure Data Management** – Keep laboratory and patient information organized.
* 📱 **Responsive Interface** – Designed for convenient use across devices.

## 🎯 Objectives

The main objectives of this project are to:

1. Digitize the blood sample collection process.
2. Reduce manual errors and paperwork.
3. Improve sample tracking and record management.
4. Provide quick access to patient and sample information.
5. Improve efficiency for laboratory staff.

## 🏗️ System Workflow

```text
Patient Registration
        ↓
Patient Information Entry
        ↓
Blood Sample Collection
        ↓
Sample ID Generation
        ↓
Sample Status Tracking
        ↓
Laboratory Processing
        ↓
Record Management
```

## 🛠️ Technologies Used


* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js
* **Database:** PostgreSQL , Prisma Schemas
* **Version Control:** Git & GitHub
* **Development Environment:** Antigravity IDE


## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mohdayaan56/SAHARA-LAB-BLOOD-SAMPLE-COLLECTION.git
```

### 2. Navigate to the Project

```bash
cd SAHARA-LAB-BLOOD-SAMPLE-COLLECTION
```


Set Up Database (PostgreSQL via Docker)
Run a PostgreSQL container on port 5433:
docker run --name sahara-lab-postgres -e POSTGRES_USER=saharalab -e POSTGRES_PASSWORD=saharalab123 -e POSTGRES_DB=saharalab -p 5433:5432 -d postgres:16-alpine

### 3. Configure Backend Environment
Navigate to the backend folder and set up your .env file:

```bash
cd backend
cp .env.example .env
```
Ensure backend/.env contains:
env
DATABASE_URL="postgresql://saharalab:saharalab123@localhost:5433/saharalab?schema=public"
PORT=4000
JWT_SECRET="sahara-lab-super-secret-jwt-key-2026"
JWT_EXPIRES_IN=7d
FRONTEND_ORIGIN="http://localhost:3000"


### 4. Install Dependencies, Migrate & Seed
In the backend directory:

```bash
# Install backend dependencies
npm install
# Push database schema migrations
npx prisma migrate dev --name init
# Seed database with staff, tests, and multi-month patient histories
npm run db:seed
```

### 5. Start the Backend API Server
```bash
npm run dev
```

### 6. Start the Frontend Client
Open a new terminal window in the project root:

```bash
cd "path/to/sahara-lab"
npx serve .
```


> The exact commands may vary depending on the technologies used in the project.

## 🔮 Future Enhancements

* 📱 Mobile application
* 🔔 Automated sample-status notifications
* 🧪 Laboratory test management
* 📄 Digital report generation
* 📊 Advanced analytics and reports
* 🔐 Role-based authentication
* ☁️ Cloud-based data storage
* 🏥 Integration with hospital/laboratory management systems

## 👨‍💻 Project

**SAHARA LAB – Blood Sample Collection**

Built with the goal of making laboratory sample collection **faster, simpler, and more organized**.

---

⭐ If you find this project useful, consider giving the repository a **star**.
