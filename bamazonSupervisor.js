
var mysql = require("mysql");
var inquirer = require("inquirer");
var passwords = require("./passwords.js");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port:3306,
    user:"root",
    password: passwords.mysql.password,
    database:'bamazon'
});


connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id "+connection.threadId);
    supervisorPrompt();
});

//display manager menu options
function supervisorPrompt(){
    inquirer
        .prompt([
            {
                type: "list",
                message: "Select a menu action",
                choices: ["View Product Sales By Department", "Create New Department", "Quit"],
                name: "menu"
            },
        ])
        .then(function(response) {
            console.log(response.menu);
            if (response.menu === "View Product Sales By Department"){
                displayDepartmentSales();
            }
            else if (response.menu === "Create New Department"){
                addDepartment();
            }
            else {
                connection.destroy();
            }
            
        }); 
};


// 5. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.
function displayDepartmentSales(){
    //create sales table for display purposes
    var salesTable = new Table({
        head: ["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"], colWidths: [20, 20, 20, 20, 20]
    });
    
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales FROM products INNER JOIN departments ON departments.department_name = products.department_name GROUP BY departments.department_name";
    
    connection.query(query, function(err, res) {
        if (err) throw err;
        for(i=0;i<res.length;i++){
            //add each department to sales table.  
            //Profit = total sales - overhead costs.
            salesTable.push([res[i].department_id, res[i].department_name, "$"+res[i].over_head_costs, "$"+res[i].product_sales, "$"+(res[i].product_sales -  res[i].over_head_costs)]);
        }
        //output sales table
        console.log(salesTable.toString());
        supervisorPrompt();
    });
};

//if user selects add department on main menu, prompt for required fields
function addDepartment(){
     inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the new department?",
                name: "name"
            },
            {
                type: "input",
                message: "What are the overhead costs?",
                name: "overhead"
            },
        ])
        .then(function(response) {
            addDeptRecord(response.name, response.overhead);
        });
};

//function to add a new record to the departments table
function addDeptRecord(name, overhead){
    var query = "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?);";
    
    connection.query(query, [name,overhead], function(err, res) {
        if (err) throw err;
        console.log(name + " has been added to the database.");
        console.log(" ");
        supervisorPrompt();
    });
};




