USE employees_db;

INSERT INTO department (name) VALUES('Sales'),('Legal'),('Engineering'),('Finance'),('Human Resources');

INSERT INTO role (title, salary, department_id) VALUES('HR Director', 50000, 5),('Salesperson', 30000, 1), ('Accountant', 40000, 4), ('Lawyer', 75000, 2), ('Jr Software Developer', 5000000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES('Axel', 'Maltese', 1, null), ('Shadow', 'Spinola', 2, null), ('Mouse', 'LeCat', 3, null), ('Dobby', 'Bonatakis', 4, null), ('Hazel', 'Leibinger', 5, null), ('Charlie', 'Dean', 1, 1), ('Max', 'Dean', 2, null);