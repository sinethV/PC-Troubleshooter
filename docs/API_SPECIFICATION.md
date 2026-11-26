# TechFix Pro: REST API Specification

**Base Context Path:** `http://localhost:8080/api/v1`  
**Interactive Swagger UI:** `http://localhost:8080/api/v1/swagger-ui.html`  
**OpenAPI Specification:** `http://localhost:8080/api/v1/v3/api-docs`

---

## 1. Standard Response Envelope

All API endpoints return JSON responses wrapped in the standardized envelope:

### Success Envelope
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-11-24T10:00:00"
}
```

### Error Envelope
```json
{
  "success": false,
  "status": 404,
  "error": "Not Found",
  "message": "Command not found with id: '99'",
  "path": "/api/v1/commands/99",
  "validationErrors": null,
  "timestamp": "2026-11-24T10:00:00"
}
```

---

## 2. API Endpoints Catalog

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/summary` | Returns total commands, guides, tickets, risk ratios, featured tools, and recent activity |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/categories` | List all diagnostic categories sorted by `sortOrder` |
| `GET` | `/categories/{id}` | Get single category by ID |
| `GET` | `/categories/slug/{slug}` | Get category by slug (e.g. `windows`, `networking`) |
| `POST` | `/categories` | Create new diagnostic category |
| `PUT` | `/categories/{id}` | Update existing category |
| `DELETE` | `/categories/{id}` | Delete category |

### Commands
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/commands` | Search & filter commands with pagination (`categoryId`, `riskLevel`, `query`, `page`, `size`) |
| `GET` | `/commands/category/{slug}` | Get all commands for a category slug |
| `GET` | `/commands/featured` | Get curated high-priority triage commands |
| `GET` | `/commands/recent` | Get recently added commands |
| `GET` | `/commands/{id}` | Get command details including expected output and verification instructions |
| `POST` | `/commands` | Add new command to library |
| `PUT` | `/commands/{id}` | Update existing command |
| `DELETE` | `/commands/{id}` | Delete command |
| `POST` | `/commands/{id}/copy` | Record audit usage when technician copies command |

### Troubleshooting Guides
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/guides` | Search guides with pagination (`categoryId`, `difficulty`, `query`, `page`, `size`) |
| `GET` | `/guides/category/{slug}` | Get guides for a category slug |
| `GET` | `/guides/recent` | Get recent guides |
| `GET` | `/guides/{id}` | Get detailed guide with ordered steps and embedded commands |
| `POST` | `/guides` | Create a new troubleshooting procedure with steps |
| `DELETE` | `/guides/{id}` | Delete guide |
