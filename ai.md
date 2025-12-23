# AI Agent & API System Manual v1.0

## Overview
This document serves as the comprehensive manual for the **Affilinko AI Agent System**. The system is designed to allow external AI Agents (like ChatGPT, Claude, or custom scripts) and Administrators to have **full programmatic control** over the website's content, database, and configurations via a secure API and SQL Console.

---

## 1. System Architecture

The Agent System consists of three core components:
1.  **API Key Manager**: A secure vault for generating and managing access tokens.
2.  **SQL Console ("Agent Mode")**: A terminal-style interface for executing raw SQL commands.
3.  **RPC Bridge (`invoke_sql_query`)**: A secure server-side function that allows authorized admins to bypass standard API limits and execute direct database queries.

---

## 2. API Key Management

### Location
*   **URL**: `/admin/api`
*   **Access**: Sidebar -> **API & Агенты**

### How to Generate a Key
1.  Navigate to the **API Keys** tab.
2.  Click **"Создать ключ"** (Create Key).
3.  Enter a descriptive name (e.g., "Content Bot", "SEO Auto-Updater").
4.  **Copy the Key**: The key (starting with `sk_live_`) is shown **only once**. Store it securely.

### Permissions
*   Currently, all generated keys grant **Administrator** level access.
*   Keys are stored securely in the `api_keys` table with Row Level Security (RLS) enabled.

---

## 3. SQL Console (Agent Terminal)

### Location
*   **URL**: `/admin/api` -> Tab: **SQL Console (Agent)**

### Capabilities
The SQL Console allows you to run **any** PostgreSQL command. This gives you absolute power to:
*   **Read Data**: Select specific fields, join tables, filter complex data.
*   **Modify Data**: Bulk update posts, change user roles, fix data errors.
*   **Schema Changes**: Create new tables, add columns, change rules.

### Basic Commands
Type these commands into the terminal editor and press **Run Query** (or `Cmd/Ctrl + Enter`).

#### List All Users
```sql
SELECT id, email, role, created_at FROM profiles ORDER BY created_at DESC;
```

#### Get Recent 5 Posts
```sql
SELECT id, title, status FROM posts ORDER BY created_at DESC LIMIT 5;
```

#### Update User Role to Admin
```sql
-- Replace 'USER_EMAIL' with actual email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

#### Count Tables
```sql
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';
```

---

## 4. RPC Function Documentation

### `invoke_sql_query(query text)`
This is the core engine ensuring security and execution.

*   **Type**: Database Function (RPC)
*   **Language**: PL/pgSQL
*   **Security**: `SECURITY DEFINER` (Runs with owner privileges)
*   **Access Control**: Strictly limited to users with `role = 'admin'` in the `profiles` table.

#### Usage via Supabase JS Client
External agents can invoke this function programmatically:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('URL', 'SERVICE_ROLE_KEY')

const { data, error } = await supabase.rpc('invoke_sql_query', {
  query: "SELECT * FROM public.posts WHERE status = 'published'"
})

if (error) console.error(error)
else console.log(data) // Returns JSON array of results
```

---

## 5. Troubleshooting

### "Access Denied" Error
*   **Cause**: The user executing the query does not have the `admin` role in the `profiles` table.
*   **Fix**: Manually update the user's role in the database or ask a Super Admin to do it.

### "Query returned no results"
*   **Cause**: The SQL syntax is correct, but no rows matched the criteria (e.g., `WHERE id = 99999`).
*   **Fix**: Double-check your `WHERE` clauses.

### Query Failed / Error
*   **Cause**: Invalid SQL syntax (e.g., missing semicolon, wrong table name).
*   **Fix**: Read the error message in the red alert box. It usually points to the exact syntax error.
