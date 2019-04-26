var inquirer = require("inquirer");
var mysql = require("mysql");


var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1Qaz@wsx",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);
    userStart();
  });


}

function userStart() {
  inquirer.prompt([

    {
      type: "list",
      name: "userSelect",
      message: "Select option",
      choices: ["Buy", "Exit"]
    }


  ]).then(function (guess) {
    switch (guess.userSelect) {
      case "Buy":
        purchaseItem();
        break;

      case "Exit":
        connection.end();
        break;
    }
  });

  function purchaseItem() {
    inquirer
      .prompt([{
        name: "productName",
        type: "number",
        message: "Enter the item id to purchase",

      },
      {
        name: "numberUnit",
        type: "number",
        message: "Enter the amount to purchase",
      }
      ])
      .then(function (answer) {

        connection.query("SELECT stock_quantity FROM products where item_id = ?", [answer.productName], function (err, res) {
          if (err) throw err;
          console.table(res);
          value = res[0].stock_quantity - answer.numberUnit;

          console.log("The amount of units your buying is: " + ":" + res[0].stock_quantity);
          console.log("The amount of units left now is: " + ":" + value);

          connection.query("UPDATE products SET stock_quantity= ? where item_id = ?", [value, answer.productName], function (err, res) {

            console.table(res);
            afterConnection()
          });
         });
        }
      )
  }
};
