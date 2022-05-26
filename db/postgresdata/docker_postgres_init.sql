CREATE USER me;
CREATE DATABASE transcendance_db;
GRANT ALL PRIVILEGES ON DATABASE transcendance_db TO me;
\c transcendance_db 

-- CREATE TABLE users (
--   ID SERIAL PRIMARY KEY,
--   name VARCHAR(30),
--   email VARCHAR(30)
-- );

-- INSERT INTO users (name, email)
--   VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com');
