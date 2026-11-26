-- TechFix Pro Database Initialization Script
-- Execute this script as a PostgreSQL superuser (e.g., 'postgres')

-- Create Database
CREATE DATABASE techfix_pro
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

\connect techfix_pro;

-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Confirmation Notice
SELECT 'TechFix Pro Database initialized successfully' AS status;
