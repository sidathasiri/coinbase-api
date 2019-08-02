const Express = require("express");
const coinbase = require("coinbase-commerce-node");
const log4js = require("log4js");
const config = require("./config");
const paymentRouter = require("./routes/payment");

const Webhook = coinbase.Webhook;
const Client = coinbase.Client;
const logger = log4js.getLogger();
const router = Express.Router();
logger.level = "info";

const clientObj = Client.init(config.API_KEY);
clientObj.setRequestTimeout(config.REQUEST_TIMEOUT);

const webhookSecret = config.WEBHOOK_SECRET;
const app = Express();

// Allowing cross origin requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

//middleware to process the webhooks streaming data
const rawBody = (req, res, next) => {
  req.setEncoding("utf8");
  var data = "";
  req.on("data", chunk => {
    data += chunk;
  });

  req.on("end", () => {
    req.rawBody = data;
    next();
  });
};

//capture events from coinbase webhooks
router.post("/", (req, res) => {
  var event;
  try {
    event = Webhook.verifyEventBody(
      req.rawBody,
      req.headers["x-cc-webhook-signature"],
      webhookSecret
    );
  } catch (error) {
    logger.error("Error occured", error.message);

    return res.status(400).send("Webhook Error:" + error.message);
  }

  logger.info("Event received:", event.type);

  res.status(200).send("Signed Webhook Received: " + event.type);
});

app.use("/payments", paymentRouter);
app.use(rawBody);
app.use(router);
app.listen(config.PORT, err => {
  if (err) {
    logger.error(err);
  }
  logger.info(`App listening on port ${config.PORT}!`);
});

module.exports = app; //for testing
