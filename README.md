# TechFix Pro — IT Technician Toolkit

A web-based IT diagnostic and troubleshooting toolkit for repair shops, MSPs, and field technicians. It combines a **live host diagnostics dashboard**, a **searchable command library**, **step-by-step troubleshooting guides**, and a **knowledge-base assistant** that matches a described problem to real fixes.

---

## What is real (and what is not)

This project deliberately removed the simulated scanners from earlier versions. Nothing on the dashboard is random anymore.

| Feature | Data source |
|---|---|
| Health score, CPU, memory, disks, network, JVM | Live JDK/OS APIs (`/system/info`, `/system/health`) |
| Command library, categories, guides | PostgreSQL rows (`/commands`, `/categories`, `/guides`) |
| Ask AI matches and match scores | Deterministic scoring over your own command/guide rows |
| Dashboard counters | Database aggregates (`/dashboard/summary`) |
| Conversational AI | **Optional** — requires your own OpenAI-compatible API key |

There are **no fake threat scans** and no invented findings. Commands are copy-only; the UI never executes anything on the host.

---

## Application structure (5 sections)

1. **Dashboard** — real host state, health checks, resource usage, library counters, recent commands.
2. **Ask AI** — describe a symptom in plain language; get ranked commands and guides with the reason each matched.
3. **Toolkit** — one page for all 10 categories, with search, risk filter and pagination (replaces 8 near-duplicate pages).
4. **Diagnostics** — live read-only CPU/RAM/storage/network/JVM metrics, auto-refresh, copyable Markdown report.
5. **Guides** — step-by-step workflows from the database, with commands, warnings and expected results.

Plus **Settings** for the optional AI model and connection details.

> The previous 19 pages (fake scanners, duplicated per-OS tool pages, static helpdesk screens and the PC-model encyclopedia) are preserved in `frontend/_backup/` and are no longer routed or bundled.

---

## Technology stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide React, Axios, React Router 6 |
| **Backend** | Java 21, Spring Boot 3.3.5, Spring Data JPA, Validation, springdoc OpenAPI 3 |
| **Database** | PostgreSQL 16/17 with Flyway migrations; H2 in-memory for the `dev` and `render` profiles |
| **Tests** | JUnit 5 + Mockito (system info, assistant scoring, command service) |

---

## Quick start (Windows 11)

### Option A — Development profile (no PostgreSQL password needed)

```powershell
cd C:\IT_Solution\backend
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

The `dev` profile uses in-memory H2, disables Flyway, and seeds a compact dataset
(10 categories, 13 commands, 2 guides, 1 sample customer) through `DevDataSeeder`.
Data disappears when the backend stops.

```powershell
cd C:\IT_Solution\frontend
npm install
npm run dev
```

Open http://localhost:5173

### Option B — PostgreSQL (persistent data)

1. Create the database:

```powershell
cd C:\IT_Solution\database
psql -U postgres -f init-db.sql
```

2. Set the password used by your local PostgreSQL install (defaults to `postgres`):

```powershell
$env:SPRING_DATASOURCE_PASSWORD="YOUR_PASSWORD"
```

3. Start the backend. Flyway applies `V1__initial_schema.sql` and `V2__seed_data.sql`:

```powershell
cd C:\IT_Solution\backend
mvn spring-boot:run
```

- API base: http://localhost:8080/api/v1
- Swagger UI: http://localhost:8080/api/v1/swagger-ui.html

4. Start the frontend as above.

### Build and test

```powershell
cd C:\IT_Solution\backend
mvn clean test

cd C:\IT_Solution\frontend
npm run build
```

---

## Deploy to Render (free)

The repo ships with `render.yaml`, which creates two free services in Singapore:

| Service | Type | URL |
|---|---|---|
| `pc-troubleshooter-api` | Docker web service (Spring Boot) | `https://pc-troubleshooter-api.onrender.com` |
| `pc-troubleshooter-web` | Static site (Vite build) | `https://pc-troubleshooter-web.onrender.com` |

**Steps**

1. Push this repository to GitHub (`sinethV/PC-Troubleshooter`).
2. In the Render Dashboard, open your project → **New** → **Blueprint**.
3. Connect the `PC-Troubleshooter` repo and click **Apply**. Render creates both
   services and wires the frontend's `VITE_API_ORIGIN` to the API URL automatically.
4. Wait for the API health check (`/api/v1/system/health`) to go live, then open
   the static site URL.

**How the deployment is wired**

- The API runs the `render` Spring profile (`application-render.yml`): in-memory
  H2, Flyway off, data reseeded on every cold start. The app is read-only, so
  nothing is lost. For persistence, add a Render Postgres and use the default
  PostgreSQL profile with `SPRING_DATASOURCE_*` variables instead.
- The frontend reads `VITE_API_ORIGIN` at build time and calls
  `<origin>/api/v1`.
- CORS accepts `https://*.onrender.com` plus localhost through
  `TECHFIX_CORS_ALLOWED_ORIGINS`.
- Free services sleep after inactivity. The first request can take ~50 s; the
  API client timeout is 60 s.
- `PORT` is injected by Render and read by `server.port` in
  `application-render.yml`.

---

## API endpoints used by the UI

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/system/info` | Hostname, OS, CPU, memory, disks, network adapters, JVM |
| GET | `/system/health` | Health score + checks derived from measured values |
| GET | `/assistant/ask?q=` | Ranked commands and guides with match reasons |
| GET | `/dashboard/summary` | Counters, categories, recent commands and guides |
| GET | `/commands` | Search/filter/paginate the command library |
| GET | `/categories` | Category list with command counts |
| GET | `/guides`, `/guides/{id}` | Guide list and full steps |

---

## Project layout

```text
C:\IT_Solution
├── backend/
│   ├── pom.xml
│   ├── Dockerfile                 # Render Docker build (Java 21)
│   └── src/
│       ├── main/java/com/techfixpro/
│       │   ├── config/       # CORS, OpenAPI, dev data seeder
│       │   ├── controller/   # dashboard, commands, categories, guides, system, assistant
│       │   ├── dto/          # API envelopes, system and assistant DTOs
│       │   ├── entity/       # 11 JPA entities
│       │   ├── exception/    # global error envelopes
│       │   ├── mapper/       # entity-to-DTO mappers
│       │   ├── repository/   # Spring Data repositories
│       │   └── service/      # business services + system/assistant services
│       └── main/resources/
│           ├── application.yml       # PostgreSQL profile
│           ├── application-dev.yml   # H2 in-memory profile
│           ├── application-render.yml# Render demo profile (H2, PORT)
│           └── db/migration/         # Flyway V1 (schema) + V2 (seed)
│
├── frontend/
│   ├── src/
│   │   ├── api/          # axios client + system/assistant/guide endpoints
│   │   ├── components/   # ui primitives, command cards, guide modal, layout
│   │   ├── hooks/        # backend health polling
│   │   ├── pages/        # Dashboard, AskPage, ToolkitPage, DiagnosticsPage, GuidesPage, Settings
│   │   └── utils/        # formatting, clipboard, optional AI client
│   └── _backup/          # removed pages kept for reference (not bundled)
│
├── database/             # init-db.sql, schema.sql, seed-data.sql
├── docs/                 # architecture, database design, API spec, setup guide
└── render.yaml           # Render Blueprint (API + static site)
```

---

## Safety policy

1. **Copy-only execution** — commands are displayed with risk and required permissions, then copied by the technician.
2. **Read-only diagnostics** — the backend reads JVM/OS metrics; it does not run shell commands or require elevation.
3. **Honest answers** — the assistant only returns rows from your library and states when nothing matches.
4. **Optional AI, your key** — the model key is stored in browser `localStorage`, sent only to the provider you configure, and never to this backend.
