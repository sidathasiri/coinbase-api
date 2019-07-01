"use strict";

/**
 * To run this example please read README.md file
 */
var Express = require("express");
var coinbase = require("coinbase-commerce-node");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
var Webhook = coinbase.Webhook;
var Checkout = coinbase.resources.Checkout;
var Charge = coinbase.resources.Charge;
var Client = coinbase.Client;

var clientObj = Client.init("887edb8c-ea0d-4e62-9726-f1e8d18587a3");
clientObj.setRequestTimeout(3000);

/**
 * Past your webhook secret from Settings/Webhook section
 */
var webhookSecret = "83957786-cb5d-4263-8da8-a1bbab849b4d";
var app = Express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function rawBody(req, res, next) {
  req.setEncoding("utf8");

  var data = "";

  req.on("data", function(chunk) {
    data += chunk;
  });

  req.on("end", function() {
    req.rawBody = data;

    next();
  });
}

app.get("/", function(req, res) {
  res.send("test");
});

app.post("/create-charge", function(req, res) {
  console.log("creating charge");
  console.log(req.body);
  const amount = req.body.amount;

  var chargeData = {
    name: "Bob",
    description: "Bob' 5 pizza",
    local_price: {
      amount: amount,
      currency: "USD"
    },
    pricing_type: "fixed_price"
  };
  Charge.create(chargeData, function(error, response) {
    if (error) {
      console.log(error);
    }
    console.log(response);
    res.send(response);
  });
});

app.get("/checkout-status/:id", (req, res) => {
  const id = req.params.id;
  Checkout.retrieve(id, function(error, response) {
    if (error) {
      console.log(error);
    }
    console.log(response);
    res.send(response);
  });
});

app.get("/delete-checkout/:id", (req, res) => {
  var checkoutObj = new Checkout();

  checkoutObj.id = req.params.id;
  checkoutObj.delete(function(error, response) {
    if (error) {
      console.log(error);
    }
    console.log(response);
    res.send(response);
  });
});

app.use(rawBody);
app.listen(8000, function(err) {
  if (err) {
    console.log(err);
  }
  console.log("App listening on port 8000!");
});
