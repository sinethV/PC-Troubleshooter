# TechFix Pro: Database Design & Entity Relationship

## 1. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    ROLES ||--o{ USERS : "assigned to"
    USERS ||--o{ SUPPORT_TICKETS : "assigned technician"
    USERS ||--o{ REPAIR_HISTORY : "logged by"
    USERS ||--o{ TOOL_USAGE : "recorded for"
    
    CATEGORIES ||--o{ COMMANDS : "groups"
    CATEGORIES ||--o{ TROUBLESHOOTING_GUIDES : "organizes"
    
    COMMANDS ||--o{ GUIDE_STEPS : "recommended in"
    COMMANDS ||--o{ TOOL_USAGE : "audit tracked in"
    
    TROUBLESHOOTING_GUIDES ||--o{ GUIDE_STEPS : "contains ordered"
    
    CUSTOMERS ||--o{ DEVICES : "owns"
    CUSTOMERS ||--o{ SUPPORT_TICKETS : "submits"
    
    DEVICES ||--o{ SUPPORT_TICKETS : "subject of"
    
    SUPPORT_TICKETS ||--o{ REPAIR_HISTORY : "remediation log"

    ROLES {
        bigint id PK
        varchar name UK
        varchar description
        timestamp created_at
    }

    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar full_name
        bigint role_id FK
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        bigint id PK
        varchar name UK
        varchar slug UK
        varchar icon_name
        text description
        int sort_order
        timestamp created_at
        timestamp updated_at
    }

    COMMANDS {
        bigint id PK
        bigint category_id FK
        varchar name
        text command_syntax
        text explanation
        text purpose
        text when_to_use
        varchar required_permissions
        varchar risk_level
        text expected_output
        text verification_instructions
        boolean is_featured
        timestamp created_at
        timestamp updated_at
    }

    TROUBLESHOOTING_GUIDES {
        bigint id PK
        bigint category_id FK
        varchar title
        text description
        text symptoms
        varchar target_os
        varchar difficulty
        int estimated_time_minutes
        timestamp created_at
        timestamp updated_at
    }

    GUIDE_STEPS {
        bigint id PK
        bigint guide_id FK
        int step_number
        varchar title
        text instruction
        bigint command_id FK
        text warning_note
        text expected_result
        timestamp created_at
        timestamp updated_at
    }

    CUSTOMERS {
        bigint id PK
        varchar full_name
        varchar company_name
        varchar email
        varchar phone
        text address
        text notes
        timestamp created_at
        timestamp updated_at
    }

    DEVICES {
        bigint id PK
        bigint customer_id FK
        varchar device_name
        varchar device_type
        varchar os_version
        varchar serial_number
        varchar ip_address
        varchar mac_address
        text notes
        timestamp created_at
        timestamp updated_at
    }

    SUPPORT_TICKETS {
        bigint id PK
        varchar ticket_number UK
        bigint customer_id FK
        bigint device_id FK
        bigint assigned_user_id FK
        varchar title
        text description
        varchar priority
        varchar status
        text resolution_summary
        timestamp created_at
        timestamp updated_at
    }

    REPAIR_HISTORY {
        bigint id PK
        bigint ticket_id FK
        bigint technician_user_id FK
        text action_taken
        text commands_executed
        text parts_replaced
        text notes
        timestamp completed_at
        timestamp created_at
    }

    TOOL_USAGE {
        bigint id PK
        bigint command_id FK
        bigint user_id FK
        varchar tool_name
        varchar execution_context
        timestamp executed_at
    }
```

## 2. Table Relationships & Design Decisions

1. **`roles` & `users`:**
   - 1-to-many relationship. Enforces Role-Based Access Control (RBAC).
   - Sensitive password hashes are stored exclusively with BCrypt encryption ($2a$ format). No plaintext credentials are ever stored or exposed.

2. **`categories` & `commands`:**
   - 1-to-many relationship with `ON DELETE CASCADE`.
   - Commands are categorized into logical technician domains: Windows, Networking, Hardware, Security, Disk Management, System Administration, PowerShell, Linux, and Printers.

3. **`troubleshooting_guides` & `guide_steps`:**
   - 1-to-many parent-child relationship.
   - Enforces unique ordering via `uq_guide_step (guide_id, step_number)`.
   - Each step optionally references a `command_id` (`ON DELETE SET NULL`), providing interactive copyable commands directly in the diagnostic workflow.

4. **`customers`, `devices`, `support_tickets`, & `repair_history`:**
   - Standard ITIL helpdesk data model:
     - Each Customer owns one or more registered Devices.
     - Support Tickets link a Customer and specific Device to an assigned Technician User.
     - Each resolved Ticket accumulates entries in `repair_history` recording exact commands run, parts replaced, and preventive recommendations.

5. **`tool_usage`:**
   - Audit trail tracking technician command copy frequency and execution context to analyze the most effective field triage tools.
