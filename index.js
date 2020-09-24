const cTable = require('console.table');
const inquirer = require("inquirer");
const connection = require("./db/connection.js");

//prompts user to choose what to do
function promptUser() {
    const options = ["View all employees", "View departments", "View roles", "View employees by department", "View employees by manager", "Add employee", "Add department", "Add role", "Remove employee", "Update employee role", "Update employee manager", "QUIT"];

    inquirer.prompt([
        { type: "list", message: "What would you like to do?", choices: options, name: "choice" }
    ]).then(response => {
        if (response.choice == options[0]) {
            viewEmployees();
        } else if (response.choice == options[1]) {
            viewDept();
        } else if (response.choice == options[2]) {
            viewRoles();
        } else if (response.choice == options[3]) {
            viewEmpDepartment();
        } else if (response.choice == options[4]) {
            viewEmpManager();
        } else if (response.choice == options[5]) {
            addEmployee();
        } else if (response.choice == options[6]) {
            addDepartment();
        } else if (response.choice == options[7]) {
            addRole();
        } else if (response.choice == options[8]) {
            removeEmployee();
        } else if (response.choice == options[9]) {
            updateEmpRole();
        } else if (response.choice == options[10]) {
            updateEmpManager();
        } else if (response.choice == options[11]) {
            connection.end();
            console.table("And you're done!");
        }
    });
};

//views all employees
function viewEmployees() {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
    CONCAT (E2.first_name, ' ', E2.last_name) AS manager_name FROM employee	
    INNER JOIN role ON role.id = employee.role_id 
    INNER JOIN department ON department.id = role.department_id
    LEFT JOIN employee AS E2 ON E2.id = employee.manager_id;`, (err, results) => {
        if (err) {
            connection.end();
        } else {
            console.table(results);
            promptUser();
        }
    });
}

//view departments
function viewDept() {
    connection.query(`SELECT name FROM department;`, (err, results) => {
        if (err) {
            connection.end();
        } else {
            console.table(results);
            promptUser();
        }
    })
};

//view roles 
function viewRoles() {
    connection.query(`SELECT title FROM role;`, (err, results) => {
        if (err) {
            connection.end();
        } else {
            console.table(results);
            promptUser();
        }
    })
};

//views employees by department
function viewEmpDepartment() {
    connection.query("SELECT * FROM department", (err, results) => {
        let deptArray = [];
        for (let i = 0; i < results.length; i++) {
            let department = {
                name: results[i].name,
                value: results[i].id
            };
            deptArray.push(department);
        }
        inquirer.prompt([
            { name: "choice", message: "Choose a department to see its employees:", choices: deptArray, type: "list" }
        ]).then(response => {
            connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.id = ?", response.choice, (err, results) => {
                console.table(results);
                promptUser();
            });
        });
    });
};

//views employees by their manager
function viewEmpManager() {
    connection.query("SELECT * FROM employee", function () {
        inquirer.prompt([
            { name: "manager_id", message: "Enter a manager's id to see their employees:", type: "input" }
        ]).then(answer => {
            connection.query("SELECT * FROM employee WHERE manager_id = ?;", [answer.manager_id], (err, results) => {
                if (err) throw err;
                if (err) {
                    console.table("Ooops! Time for a do-over!");
                    connection.end();
                } else {
                    console.table(results);
                    promptUser();
                }
            });
        });
    });
};

//adds employee to system
function addEmployee() {
    inquirer.prompt([
        { name: "first_name", message: "What is the employee's first name?", type: "input" },
        { name: "last_name", message: "What is the employee's last name?", type: "input" },
        { name: "manager_id", message: "What is the employee's manager id?", type: "input" },
        { name: "role_id", message: "What is the employee's role id?", type: "input" },
    ]).then((answer) => {
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                manager_id: answer.manager_id,
                role_id: answer.role_id
            },
            (err) => {
                if (err) throw err;
                console.table("Employee added");
                promptUser();
            }
        );
    });
};

//adds new department
function addDepartment() {
    inquirer.prompt([
        { name: "name", message: "What is the name of the department that you would like to add?", type: "input" },
    ]).then((answer) => {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answer.name
            },
            (err) => {
                if (err) throw err;
                console.table("Department added");
                promptUser();
            }
        )
    })
};

//adds new role
function addRole() {
    inquirer.prompt([
        { name: "title", message: "What is the title of the role that you would like to add?", type: "input" },
        { name: "salary", message: "What is the salary for the role that you would like to add?", type: "input" },
        { name: "department_id", message: "Enter the department number to which you would like to add the new role:", type: "input" }
    ]).then((answer) => {
        connection.query(
            `INSERT INTO role SET ?`,
            {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_id
            },
            (err) => {
                if (err) throw err;
                console.table("Role added");
                promptUser();
            }
        )
    })
};

//deletes employee from system
function removeEmployee() {
    inquirer.prompt([
        { name: "id", message: "What is the employee's id number?", type: "input" }
    ]).then((answer) => {
        connection.query(`DELETE FROM employee WHERE ?`,
            {
                id: answer.id
            },
            (err) => {
                if (err)
                    throw err;
                console.table(`Employee removed`);
                promptUser();
            }
        );
    });
};

//updates employee role
function updateEmpRole() {
    console.log("Update employee role here");
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role_id, role.title, department.name AS department FROM employee	
    INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id;`, (err, results) => {
        if (err) throw err;
        if (err) {
            connection.end();
        } else {
            console.table(results);

            inquirer.prompt([
                { name: "id", message: "What is the employee's id number?", type: "input" },
                { name: "role_id", message: "What is the employee's new role id?", type: "input" }
            ]).then(function (answer) {
                connection.query(
                    `UPDATE employee SET role_id = ? WHERE id = ?`, [answer.role_id, answer.id], (err) => {
                        if (err) throw err;
                        if (err) {
                            console.table("Ooops! Time for a do-over!");
                            connection.end();
                        } else {
                            console.log("Employee role updated");
                            promptUser();
                        }
                    })
            })
        }
    });
};

//updates employee manager
function updateEmpManager() {
    console.log("Here is where you update your employee's manager")
    inquirer.prompt([
        { name: "manager_id", message: "What is the manager's id number?", type: "input" },
        { name: "id", message: "What is the employee's id number?", type: "input" },
    ]).then(function (answer) {
        connection.query(
            `UPDATE employee SET manager_id = ? WHERE id = ?;`, [answer.manager_id, answer.id],
            (err) => {
                if (err) throw err;
                if (err) {
                    console.table(err);
                } else {
                    console.table("Employee manager updated");
                    promptUser();
                }
            }
        );
    });
};

promptUser();




