-- Create schema for the app
CREATE SCHEMA IF NOT EXISTS app;

-- Set the search path
SET search_path TO app;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Create oracles table
CREATE TABLE IF NOT EXISTS oracles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_id VARCHAR(255) NOT NULL,
  payment NUMERIC(18, 0) NOT NULL
);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  oracle_id INTEGER REFERENCES oracles(id) ON DELETE CASCADE,
  job_id VARCHAR(255) NOT NULL,
  url VARCHAR(1024) NOT NULL,
  path VARCHAR(1024) NOT NULL,
  times INTEGER NOT NULL
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES requests(id) ON DELETE CASCADE,
  oracle_id INTEGER REFERENCES oracles(id) ON DELETE CASCADE,
  result VARCHAR(255) NOT NULL
);
