

// 6. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.
// 7. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.
//    * Hint: You may need to look into aliases in MySQL.
//    * Hint: You may need to look into GROUP BYs.
//    * Hint: You may need to look into JOINS.
//    * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)


var mysql = require("mysql");
var inquirer = require("inquirer");
var passwords = require("./passwords.js");

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
                
            }
            
        }); 
};


// 5. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.
// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |
function displayDepartmentSales(){
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) FROM products INNER JOIN departments ON departments.department_name = products.department_name GROUP BY departments.department_name";
    
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("id / department_name / overhead / sales / ");
        console.log("-------------------------");
        for(i=0;i<res.length;i++){
            console.log(res[i].department_id + " / " +res[i].department_name + " / " + res[i].over_head_costs + " / "+ res[i].product_sales);
        }
        console.log(" ");
        supervisorPrompt();

    });
};

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




