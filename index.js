const mysql = require("mysql");
const console = require('console.table');
const inquirer=require("inquirer");
​
function promptUser() {
    const options=["View all employees","View employees by department","View employees by role","Add employee","Add department","Add role","Update employee role","Done"];
    
    inquirer.prompt([
        {type:"list", message:"What would you like to do?", choices:options, name:"choice"}
    ]).then(response=>{
        if(response.choice==options[0]) {
            viewEmployees();
        } else if(response.choice==options[1]) {
            viewEmpDepartment();
        }  else if(response.choice==options[2]) {
            viewEmpRole();
        }   else if(response.choice==options[3]) {
            addEmployee();
        } else if(response.choice==options[4]) {
            addDepartment();
        } 
        else if(response.choice==options[5]) {
            addRole();
        }
        else if(response.choice==options[6]) {
            updateEmpRole();
        }
        else if(response.choice==options[7]) {
            connection.end();
        }
    })
}
​
​
​
const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port
    port: 8889,
  
    // Your username
    user: "root",
  
    // Your password and db
    password: "root",
    database: "employees_db"
  });
​
  connection.connect(function(err) {
    if (err) throw err;
    
    promptUser();
​
  });
  