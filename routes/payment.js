const express = require("express");
const coinbase = require("coinbase-commerce-node");
const log4js = require("log4js");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const Charge = coinbase.resources.Charge;
const logger = log4js.getLogger();
logger.level = "info";

router.post("/create-charge", (req, res) => {
  logger.info("creating charge");
  let amount;
  if (req.body.amount) {
    amount = req.body.amount;
  } else {
    return res.json({ error: "Amount is not included in the request" });
  }

  var chargeData = {
    local_price: {
      amount: amount,
      currency: "USD"
    },
    pricing_type: "fixed_price"
  };
  Charge.create(chargeData, (error, response) => {
    if (error) {
      logger.error(error.message);
      return res.json({ error: error.message });
    }
    res.send(response);
  });
});

module.exports = router;
