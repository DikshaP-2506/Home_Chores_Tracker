CREATE DATABASE chores_tracker;

\c chores_tracker;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE family_members (
  member_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(user_id),
  avatar_url VARCHAR(255)
);

CREATE TABLE chores (
  chore_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INTEGER REFERENCES users(user_id),
  assigned_to INTEGER REFERENCES family_members(member_id),
  due_date TIMESTAMP,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE completed_chores (
  completed_id SERIAL PRIMARY KEY,
  chore_id INTEGER REFERENCES chores(chore_id),
  completed_by INTEGER REFERENCES family_members(member_id),
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_by INTEGER REFERENCES users(user_id),
  notes TEXT
); 