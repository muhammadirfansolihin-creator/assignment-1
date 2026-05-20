CREATE DATABASE IF NOT EXISTS employee_dir
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE employee_dir;

DROP TABLE IF EXISTS employee;

CREATE TABLE employee(
    empId VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO employee (empId, name, email, department, position, hireDate, salary, active) 
VALUES
    ()