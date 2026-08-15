-- ==============================================================
-- AI SmartWills MySQL Schema
-- Run this to create the MySQL database tables
-- Usage: mysql -u root -p smartwills < supabase/mysql-schema.sql
-- ==============================================================

CREATE DATABASE IF NOT EXISTS smartwills
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE smartwills;

-- ─── Users table (replaces Supabase auth.users) ────────────────

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(200) DEFAULT NULL,
  preferred_country VARCHAR(5) DEFAULT 'MY',
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ─── Chat sessions table ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS chat_sessions (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  country_code VARCHAR(5) NOT NULL DEFAULT 'MY',
  title VARCHAR(100) DEFAULT 'New Chat',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_chat_sessions_user_id (user_id),
  INDEX idx_chat_sessions_updated_at (updated_at DESC),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Chat messages table ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS chat_messages (
  id CHAR(36) NOT NULL PRIMARY KEY,
  session_id CHAR(36) NOT NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_chat_messages_session_id (session_id),
  INDEX idx_chat_messages_created_at (created_at),
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── AI prompts table ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_prompts (
  id CHAR(36) NOT NULL PRIMARY KEY,
  country_code VARCHAR(5) NOT NULL DEFAULT 'MY',
  country_name VARCHAR(100) NOT NULL DEFAULT 'Malaysia (Conventional Will)',
  prompt_type ENUM('character', 'sop', 'company_info', 'services', 'other') NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_country_prompt (country_code, prompt_type),
  INDEX idx_ai_prompts_type (prompt_type),
  INDEX idx_ai_prompts_country (country_code)
) ENGINE=InnoDB;

-- ─── Plan data table (extracted will information) ──────────────

CREATE TABLE IF NOT EXISTS plan_data (
  id CHAR(36) NOT NULL PRIMARY KEY,
  session_id CHAR(36) NOT NULL UNIQUE,
  user_id CHAR(36) NOT NULL,
  country_code VARCHAR(5) NOT NULL DEFAULT 'MY',
  user_name VARCHAR(200) DEFAULT NULL,
  birthdate VARCHAR(50) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  religion VARCHAR(100) DEFAULT NULL,
  marital_status VARCHAR(50) DEFAULT NULL,
  dependents_count INT DEFAULT NULL,
  dependents_label VARCHAR(100) DEFAULT NULL,
  executor_name VARCHAR(200) DEFAULT NULL,
  guardian_name VARCHAR(200) DEFAULT NULL,
  hkid VARCHAR(50) DEFAULT NULL,
  gender VARCHAR(20) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  email VARCHAR(320) DEFAULT NULL,
  assets TEXT DEFAULT NULL,
  liabilities TEXT DEFAULT NULL,
  beneficiary_info TEXT DEFAULT NULL,
  executor_info TEXT DEFAULT NULL,
  guardian_info TEXT DEFAULT NULL,
  executors TEXT DEFAULT NULL,
  guardians TEXT DEFAULT NULL,
  beneficiaries TEXT DEFAULT NULL,
  witnesses TEXT DEFAULT NULL,
  witness_info TEXT DEFAULT NULL,
  payment_info TEXT DEFAULT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_plan_data_session (session_id),
  INDEX idx_plan_data_user (user_id),
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── User memories (cross-session persistent facts) ────────────

CREATE TABLE IF NOT EXISTS user_memories (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL UNIQUE,
  facts JSON NOT NULL DEFAULT ('{}'),
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_memories_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Conversation summaries (per-session rolling summary) ──────

CREATE TABLE IF NOT EXISTS conversation_summaries (
  id CHAR(36) NOT NULL PRIMARY KEY,
  session_id CHAR(36) NOT NULL UNIQUE,
  user_id CHAR(36) NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  message_count INT NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_summaries_session (session_id),
  INDEX idx_summaries_user (user_id),
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Admin audit logs ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id CHAR(36) NOT NULL PRIMARY KEY,
  admin_id CHAR(36) DEFAULT NULL,
  action VARCHAR(255) NOT NULL,
  details JSON DEFAULT ('{}'),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_logs_admin (admin_id),
  INDEX idx_audit_logs_created_at (created_at DESC),
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── Password reset tokens ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token CHAR(36) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reset_token (token),
  INDEX idx_reset_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── OAuth state tokens (for Google OAuth) ─────────────────────

CREATE TABLE IF NOT EXISTS oauth_states (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  state CHAR(36) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_oauth_state (state)
) ENGINE=InnoDB;

