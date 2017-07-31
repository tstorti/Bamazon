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

//add dummy data
connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id "+connection.threadId);

    // for(var i=11;i<12;i++){
    //     addRecord("product"+i,"department"+i,Math.floor(Math.random()*100+1),100);
    // }
    displaySales();

    
});

// var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//       connection.query(query, [answer.start, answer.end], 

//function to add a new record to the products table
function addRecord(name, department, price, stock){
    var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);";
    
    connection.query(query, [name,department,price,stock], function(err, res) {
        if (err) throw err;
        // console.log(res);
    });
}

//Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
function displaySales(){
    var query = "SELECT * FROM products";
    
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("id / product_name / price");
        console.log("-------------------------");
        for(i=0;i<res.length;i++){
            console.log(res[i].item_id + " / " +res[i].product_name + " / " + res[i].price);
        }
        buyPrompt(res);

    });
}
//    * The first should ask them the ID of the product they would like to buy.
function buyPrompt(productArray){
    inquirer
        .prompt([
            {
                type: "input",
                message: "Which product would you like to buy?",
                name: "buyID"
            },
        ])
        .then(function(response) {
            console.log(response.buyID);
            //console.log(productArray);
            howManyPrompt(productArray[response.buyID-1]);
        }); 
}
//    * The second message should ask how many units of the product they would like to buy.
function howManyPrompt(product){
    inquirer
        .prompt([
            {
                type: "input",
                message: "How many would  you like to buy?",
                name: "quantity"
            },
        ])
        .then(function(response) {
            //amount of product in stock
            console.log(product.quantity);
            //amount user wants to buy
            console.log(response.quantity);

            // 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.  
            if(product.quantity<response.quantity){
                //    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
                console.log("Insufficient quantity!");
            }
            else{
                //processOrder();
            }
        });
}
// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
function processOrder(){
    var query = "";
    var query = connection.query(query,function(err,res){
        if(err) throw err;
    });
}

function updateProduct(){
    // UPDATE table_name
    // SET column_name_1 = new_value_1, column_name_2 = new_value_2
    // WHERE column_name = some_value
    // var sql = "UPDATE products SET quantity = 3 WHERE id=4";
    // var query = connection.query(sql,function(err,res){
    //     if(err) throw err;
    // });
};