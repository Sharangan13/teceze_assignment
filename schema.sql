-- Run this in your Supabase SQL editor to create the employees table

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  employee_no VARCHAR(20) NOT NULL UNIQUE,
  employee_name VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  salary NUMERIC(12, 2) NOT NULL CHECK (salary > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: seed with sample data
INSERT INTO employees (employee_no, employee_name, designation, salary) VALUES
  ('EMP001', 'Alice Johnson', 'Software Engineer', 85000.00),
  ('EMP002', 'Bob Smith', 'Product Manager', 95000.00),
  ('EMP003', 'Carol White', 'UI/UX Designer', 78000.00);
