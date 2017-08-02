
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
    managerPrompt();
});

//display manager menu options
function managerPrompt(){
    inquirer
        .prompt([
            {
                type: "list",
                message: "Select a menu action",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
                name: "menu"
            },
        ])
        .then(function(response) {
            console.log(response.menu);
            if (response.menu === "View Products for Sale"){
                displaySales();
            }
            else if (response.menu === "View Low Inventory"){
                viewLowInventory();
            }
            else if (response.menu === "Add to Inventory"){
                addInventory();
            }
            else if (response.menu ==="Add New Product"){
                addProduct();
            }
            else{
                connection.destroy();
            }
            
        }); 
};

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory(){
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter the ID of the product you would like to add inventory to",
                name: "id"
            },
        ])
        .then(function(response) {
            howManyPrompt(response.id);
        }); 
};

//prompt for user to select how much stock to add for selected menu item
function howManyPrompt(id){
    inquirer
        .prompt([
            {
                type: "input",
                message: "How much inventory would you like to add?",
                name: "quantity"
            },
        ])
        .then(function(response) {
            var query = "SELECT stock_quantity FROM products WHERE item_id = ?";
            var query = connection.query(query, [id], function(err, res){
                processStockChange(id, res[0].stock_quantity, response.quantity);
            });
            
        });
};

//update the inventory based on old and new inventory
function processStockChange(id, oldQuantity, addQuantity){
    var newStock = parseInt(oldQuantity) + parseInt(addQuantity);
    var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
    var query = connection.query(query, [newStock, id], function(err,res){
        if(err) throw err;
        //    * Once the update goes through, show the customer the total cost of their purchase.
        console.log("You have added "+ addQuantity + " to product " + id);
        console.log(" ");
        managerPrompt();
    });
};

//prompt for product details
function addProduct(){
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the new product?",
                name: "name"
            },
            {
                type: "input",
                message: "What department is the product in?",
                name: "department"
            },
            {
                type: "input",
                message: "What is the unit price?",
                name: "price"
            },
            {
                type: "input",
                message: "What is the initial inventory?",
                name: "stock"
            },
        ])
        .then(function(response) {
            addRecord(response.name, response.department, response.price, response.stock);
        });
};

//function to add a new record to the products table
function addRecord(name, department, price, stock){
    var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);";
    
    connection.query(query, [name,department,price,stock], function(err, res) {
        if (err) throw err;
        console.log(name + " has been added to the database.");
        console.log(" ");
        managerPrompt();
    });
};

//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
function displaySales(){
    var productsTable = new Table({
        head: ["product_id", "product_name", "price", "stock"], colWidths: [20, 20, 20, 20]
    });
    
    var query = "SELECT * FROM products";
    
    connection.query(query, function(err, res) {
        if (err) throw err;
        for(i=0;i<res.length;i++){
            productsTable.push([res[i].item_id, res[i].product_name, "$"+res[i].price, res[i].stock_quantity]);
        }
        console.log(productsTable.toString());
        managerPrompt();

    });
};

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
function viewLowInventory(){
    var productsTable = new Table({
        head: ["product_id", "product_name", "price", "stock"], colWidths: [20, 20, 20, 20]
    });
    
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    
    connection.query(query, function(err, res) {
        if (err) throw err;
        for(i=0;i<res.length;i++){
            productsTable.push([res[i].item_id, res[i].product_name, "$"+res[i].price, res[i].stock_quantity]);
        }
        console.log(productsTable.toString()); 
        managerPrompt();
    });
};




