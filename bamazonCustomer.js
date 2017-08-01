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

    //loop to add dummy data
    // for(var i=11;i<12;i++){
    //     addRecord("product"+i,"department"+i,Math.floor(Math.random()*100+1),100);
    // }
    displaySales();

    
});

//function to add a new record to the products table
function addRecord(name, department, price, stock){
    var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);";
    
    connection.query(query, [name,department,price,stock], function(err, res) {
        if (err) throw err;
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
                message: "Enter the ID of the product you would like to buy",
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

            // 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.  
            if(product.stock_quantity<response.quantity){
                //    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
                console.log("Insufficient quantity!");
                console.log("There are only " + product.stock_quantity  + " in stock.");
                console.log("Choose a vaild quantity");
                howManyPrompt(product);
            }
            else{
                processOrder(product, response.quantity);
            }
        });
}
// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
function processOrder(product,purchaseQuantity){
    var newStock = product.stock_quantity - purchaseQuantity;
    var newSales = product.product_sales + purchaseQuantity*product.price;
    var productID = product.item_id;
    var query = "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?";
    var query = connection.query(query, [newStock, newSales, productID], function(err,res){
        if(err) throw err;
        //    * Once the update goes through, show the customer the total cost of their purchase.
        console.log("You have purchased " + purchaseQuantity +" of "+ product.product_name + " for $"+product.price*purchaseQuantity);
    });

}

