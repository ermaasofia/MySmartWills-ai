# Database Management Guide

Since we've migrated from Supabase to MySQL, here's everything you need to manage the database.

## 0. 🎨 GUI Tool: TablePlus (Installed ✅)

TablePlus was just installed on your Mac. Here's how to connect:

### Open TablePlus
- Press `Cmd+Space` → type **"TablePlus"** → hit Enter
- Or open from **Applications** folder

### Create a New Connection
1. Click **"Create a new connection"** (or `Cmd+N`)
2. Select **MySQL** from the list
3. Fill in:
   ```
   Name:     SmartWills (any name you like)
   Host:     127.0.0.1
   Port:     3306
   User:     root
   Password: (leave blank if no password set)
   Database: smartwills
   ```
4. Click **"Test"** (green checkmark = success)
5. Click **"Connect"**

### What You Can Do in TablePlus

| Action | How |
|--------|-----|
| Browse tables | Click any table in left sidebar |
| View data | Table opens in spreadsheet view |
| Run SQL | Click **"Query"** tab (top toolbar) |
| Export as JSON | Right-click table → **Export → JSON** |
| Export plan_data | Run `SELECT * FROM plan_data` → Export button → JSON |
| Backup | Right-click connection → **Export → MySQL Dump** |
| View structure | Click **"Structure"** tab |

### Pro Tip: Export plan_data for SmartWills API
Run this query in TablePlus, then click **Export → JSON**:
```sql
SELECT * FROM plan_data;
```
That's the extracted will data you can hand to the SmartWills team.

---

## 1. Prerequisites

Make sure MySQL is installed on your system:

```bash
mysql --version
```

If not installed on macOS:
```bash
brew install mysql
brew services start mysql
```

## 2. Environment Variables

Create/edit `.env.local` in the project root:

```env
# MySQL Connection
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=smartwills

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET=your-generated-secret-key-here

# Admin bootstrap emails (comma-separated)
ADMIN_EMAILS=admin@example.com

# SMTP for emails (password reset, welcome)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@smartwills.ai

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Create the Database

Run the schema file:

```bash
mysql -u root -p < supabase/mysql-schema.sql
```

Or if you want to specify a password:
```bash
mysql -u root -p'your_password' < supabase/mysql-schema.sql
```

This creates the `smartwills` database with all tables.

## 4. Verify Tables

Connect and check:
```bash
mysql -u root -p
```

```sql
USE smartwills;
SHOW TABLES;
```

Expected tables:
| Table | Purpose |
|-------|---------|
| `users` | User accounts (email + password hash) |
| `chat_sessions` | Chat conversation sessions |
| `chat_messages` | Individual chat messages |
| `ai_prompts` | AI instructions per country |
| `plan_data` | Extracted will planning data |
| `user_memories` | Cross-session user memory |
| `conversation_summaries` | Per-session summaries |
| `admin_audit_logs` | Admin action logs |
| `password_reset_tokens` | Password reset tokens |
| `oauth_states` | Google OAuth state tokens |

## 5. Create an Admin User

After signing up through the app, promote yourself to admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Or bootstrap via env var `ADMIN_EMAILS=your-email@example.com` (first signup becomes admin automatically when no admin exists yet).

## 6. Common Management Commands

```sql
-- View all users
SELECT id, email, role, full_name, created_at FROM users;

-- View recent chat sessions
SELECT cs.id, u.email, cs.country_code, cs.title, cs.created_at
FROM chat_sessions cs
JOIN users u ON u.id = cs.user_id
ORDER BY cs.created_at DESC
LIMIT 20;

-- View plan data for a session
SELECT * FROM plan_data WHERE session_id = 'session-uuid-here'\G

-- View chat messages for a session
SELECT role, content, created_at
FROM chat_messages
WHERE session_id = 'session-uuid-here'
ORDER BY created_at;

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Count sessions per user
SELECT u.email, COUNT(cs.id) as session_count
FROM users u
LEFT JOIN chat_sessions cs ON cs.user_id = u.id
GROUP BY u.email
ORDER BY session_count DESC;

-- Delete old sessions (older than 30 days)
DELETE FROM chat_sessions WHERE created_at < NOW() - INTERVAL 30 DAY;
```

## 7. Backup & Restore

**Backup:**
```bash
mysqldump -u root -p smartwills > backup_$(date +%Y%m%d).sql
```

**Restore:**
```bash
mysql -u root -p smartwills < backup_20250101.sql
```

## 8. Reset Everything (Development)

```bash
# Drop and recreate
mysql -u root -p -e "DROP DATABASE IF EXISTS smartwills;"
mysql -u root -p < supabase/mysql-schema.sql
```

## 9. Troubleshooting

**"Can't connect to MySQL"**:
```bash
# Check if MySQL is running
brew services list | grep mysql

# Start MySQL
brew services start mysql
```

**"Access denied for user 'root'"**:
```bash
# On macOS with fresh install
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
```

**Connection pool errors in app**:
Check your `.env.local` has the correct `MYSQL_*` variables matching your MySQL setup.
