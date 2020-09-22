const cTable = require('console.table');
const inquirer = require("inquirer");
const connection = require("./db/connection.js");

function promptUser() {
    const options = ["View all employees", "View employees by department", "View employees by manager", "Add employee", "Remove employee", "Update employee role", "Update employee manager", "QUIT"];

    inquirer.prompt([
        { type: "list", message: "What would you like to do?", choices: options, name: "choice" }
    ]).then(response => {
        if (response.choice == options[0]) {
            viewEmployees();
        } else if (response.choice == options[1]) {
            viewEmpDepartment();
        } else if (response.choice == options[2]) {
            viewEmpManager();
        } else if (response.choice == options[3]) {
            addEmployee();
        } else if (response.choice == options[4]) {
            removeEmployee();
        } else if (response.choice == options[5]) {
            updateEmpRole();
        } else if (response.choice == options[6]) {
            updateEmpManager();
        } else if (response.choice == options[7]) {
            connection.end();
        }
    });
};

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (error, results) {
        console.table(results);
        connection.end();
    });
};

function viewEmpDepartment() {
    connection.query("SELECT * FROM department", function (error, results) {
        let deptArray = [];
        for (let i = 0; i < results.length; i++) {
            let department = {
                name: results[i].name,
                value: results[i].id
            }
            deptArray.push(department);
        }
        console.log(deptArray);
        inquirer.prompt([
            { type: "list", message: "Choose a department to see its employees:", choices: deptArray, name: "choice" }
        ]).then(response => {
            connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.id = ?", response.choice, function (error, results) {
                console.table(results);
                connection.end();
            });
        });
    });
};


function viewEmpManager() {
    connection.query("SELECT * FROM employee", function (error, results) {
        let empArray = [];
        for (let i = 0; i < results.length; i++) {
            let manager = {
                name: results[i].name,
                value: results[i].id
            }
            empArray.push(manager);
        }
        console.log(empArray);
        inquirer.prompt([
            { type: "list", message: "Choose a manager's id to see their employees:", choices: empArray, name: "choice" }
        ]).then(response => {
            connection.query("SELECT employee.manager_id FROM employee", response.choice, function (error, results) {
                console.table(results);
                connection.end();
            });
        });
    });
};

function addEmployee() {
    inquirer.prompt([
        { name: "first_name", message: "What is the employee's first name?", type: "input" },
        { name: "last_name", message: "What is the employee's last name?", type: "input" },
        { name: "manager_id", message: "What is the employee's manager id?", type: "input" },
        { name: "role_id", message: "What is the employee's role id?", type: "input" },
    ]).then(function (answer) {
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                manager_id: answer.manager_id,
                role_id: answer.role_id
            },
            function (err) {
                if (err) throw err;
                console.table("Employee added");
                connection.end();
            }
        );
    });
};

function removeEmployee() {
    inquirer.prompt([
        { name: "first_name", message: "What is the employee's first name?", type: "input" },
        { name: "last_name", message: "What is the employee's last name?", type: "input" },
        { name: "manager_id", message: "What is the employee's manager id?", type: "input" },
        { name: "role_id", message: "What is the employee's role id?", type: "input" },
    ]).then(function (answer) {
        connection.query(
            "DELETE FROM employee WHERE ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                manager_id: answer.manager_id,
                role_id: answer.role_id
            },
            function (err) {
                if (err) throw err;
                console.log("Employee removed");
                connection.end();
            }
        );
    });
};

function updateEmpRole() {
    console.log("Update employee role here");
    inquirer.prompt([
        { name: "id", message: "What is the employee's id?", type: "input" },
        { name: "title", message: "What is the employee's title?", type: "input" },
        { name: "salary", message: "What is the employee's salary?", type: "input" },
        { name: "department_id", message: "What is the employee's department id?", type: "input" },
    ]).then(function (answer) {
        connection.query(
            "UPDATE department WHERE ?",
            {
                id: answer.id,
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_id
            },
            function (err) {
                if (err) throw err;
                console.log("Employee role updated");
                connection.end();
            }
        );
    });
};

function updateEmpManager() {
    console.log("Here is where you update your employee's manager")
    inquirer.prompt([
        { name: "first_name", message: "What is the employee's first name?", type: "input" },
        { name: "last_name", message: "What is the employee's last name?", type: "input" },
        { name: "manager_id", message: "Who is the employee's new manager by id?", type: "input" }
    ]).then(function(answer){
        connection.query(
            "UPDATE employee WHERE ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                manager_id: answer.manager_id,
            },
            function (err) {
                if (err) throw err;
                console.table("Employee's manager updated");
                connection.end();
            }
        );
    });
 };


promptUser();




