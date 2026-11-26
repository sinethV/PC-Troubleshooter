# TechFix Pro: Windows 11 Developer & Execution Guide

This guide walks you through setting up, configuring, running, and verifying TechFix Pro on **Windows 11**.

---

## 1. Prerequisites Checklist

Ensure the following runtimes and tools are installed on your Windows 11 machine:

| Tool | Recommended Version | Verification Command in PowerShell |
|---|---|---|
| **Java JDK** | Java 21 LTS | `java -version` |
| **Node.js** | Node 18+ or Node 20+ | `node -v` |
| **PostgreSQL** | PostgreSQL 16 or 17 | `psql -U postgres -V` |
| **Git** | 2.40+ | `git --version` |

---

## 2. Step 1: Database Setup (PostgreSQL)

You can set up the database using either **pgAdmin 4** (GUI) or the **psql CLI**.

### Option A: Using PowerShell / psql
Open PowerShell as Administrator and run:
```powershell
# Navigate to the database scripts folder
cd C:\IT_Solution\database

# Connect to PostgreSQL and run the database initialization
psql -U postgres -f init-db.sql
```

When prompted for your PostgreSQL password, enter your `postgres` superuser password.

### Option B: Using pgAdmin 4 (GUI)
1. Launch **pgAdmin 4**.
2. Connect to your local server.
3. Right-click on **Databases** > **Create** > **Database...**
4. Set Database Name to: `techfix_pro`
5. Click **Save**.
6. Select `techfix_pro`, open the **Query Tool**, open `C:\IT_Solution\database\schema.sql` and click **Execute (F5)**.
7. Open `C:\IT_Solution\database\seed-data.sql` and click **Execute (F5)**.

*(Note: When running the Spring Boot backend, Flyway automatically handles schema migrations and seed data as well!)*

---

## 3. Step 2: Configure Backend (`application.yml`)

Check `C:\IT_Solution\backend\src\main\resources\application.yml`. If your PostgreSQL password differs from `postgres`, either:
1. Update `spring.datasource.password` in `application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/techfix_pro
       username: postgres
       password: YOUR_PASSWORD_HERE
   ```
2. Or set an environment variable before launching:
   ```powershell
   $env:SPRING_DATASOURCE_PASSWORD="YOUR_PASSWORD_HERE"
   ```

---

## 4. Step 3: Run the Spring Boot Backend

Open a PowerShell window:
```powershell
cd C:\IT_Solution\backend

# Build the project (or use your IDE - VS Code / IntelliJ)
mvn clean package -DskipTests

# Run the Spring Boot application
mvn spring-boot:run
```

*Alternatively, open `C:\IT_Solution\backend` in IntelliJ IDEA or VS Code and run `TechFixProApplication.java` directly.*

### Verification:
Open your browser to:
- **API Health & Summary:** [http://localhost:8080/api/v1/dashboard/summary](http://localhost:8080/api/v1/dashboard/summary)
- **Interactive Swagger UI:** [http://localhost:8080/api/v1/swagger-ui.html](http://localhost:8080/api/v1/swagger-ui.html)

---

## 5. Step 4: Run the React Frontend

Open a second PowerShell window:
```powershell
cd C:\IT_Solution\frontend

# Install dependencies (First time only)
npm install

# Start the Vite development server
npm run dev
```

### Verification:
Open your browser to:
- **TechFix Pro Dashboard:** [http://localhost:5173](http://localhost:5173)

---

## 6. Common Windows 11 Troubleshooting

### Issue 1: `Port 8080 is already in use`
- **Cause:** Another process (e.g. Jenkins, Tomcat, IIS, Docker) is bound to 8080.
- **Solution:** Find the PID using PowerShell:
  ```powershell
  netstat -ano | findstr :8080
  ```
  Terminate the process or change `server.port: 8081` in `application.yml` and update `vite.config.js` proxy.

### Issue 2: `Password authentication failed for user "postgres"`
- **Cause:** PostgreSQL password in `application.yml` does not match your local PostgreSQL install.
- **Solution:** Verify your password in pgAdmin and update `application.yml`.

### Issue 3: PowerShell Script Execution Policy
- **Symptom:** `npm.ps1 cannot be loaded because running scripts is disabled on this system`.
- **Solution:** Run in PowerShell as Administrator:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
