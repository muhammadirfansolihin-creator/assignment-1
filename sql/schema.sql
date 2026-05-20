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
    ('EMP001', 'Hafiz bin Abdullah', 'hafiz@vsorg.com','IT','Senior Software Engineer', '2024-05-15', 7500.00, 1),
    ('EMP002', 'Johari bin Zamzuri','johari@vsorg.com','HR','HR Manager','2023-03-20', 6870.00, 1),
    ('EMP003', 'Suhaila binti Awang','suhailaawang@vsorg.com','Finance','Financial Analyst','2023-05-15' ,5400.00, 1),
    ('EMP004', 'Chen Xiaolong','xiaolong@vsorg.com','IT','Software Architect','2023-04-25', 9875.00, 1),
    ('EMP005', 'Ram Kumar','ramkumar@vsorg.com','Marketing','Sales Manager','2023-12-13', 5000.00,1),
    ('EMP006', 'Abdul Kadir bin Abdul Rashid','kadir@vsorg.com','Finance','Accountant','2023-07-19', 6700.00,1),
    ('EMP007', 'Shi Jinjing','jinjingshi@vsorg.com','Operations','Operation Analyst','2023-01-02', 7500.00, 0);