# Bamazon

This is a command-line storefront app with customer, manager, and supervisor views.

Customer interface is opened with **bamazoncustomer.js**
    *Allows user to purchase some quantity of any of the products available in the MySQL products database

Manager interface is opened with **bamazonManager.js**
    *Allows user to view all products available in the MySQL products database with stock quantities
    *Allows user to view all products available in the MySQL products database with stock quantities less than 5
    *Allows user to add stock to a product
    *Allows user to add a new product

Supervisor interface is opened with **bamazonSupervisor.js**
    *Allows user to view profit by department (total sales - overhead costs)
    *Allows user to add a new department

Demo video available at [link to Demo!](https://drive.google.com/open?id=0Bxq14zPqWo3ncXdNWVlPYUZaRGM)

Note you will need to set up a MySQL server and provide your own password as part of the connection definition in each file

**products** table has the following fields:
item_id
product_name
department_name
price
stock_quantity
product_sales

**departments** table has the following fields:
department_id
department_name
over_head_costs
