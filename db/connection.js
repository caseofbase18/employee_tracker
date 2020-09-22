const mysql = require("mysql");

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

connection.connect(function (err) {
    if (err) throw err;

});

module.exports=connection;