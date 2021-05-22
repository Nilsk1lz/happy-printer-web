const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");

const dotenv = require("dotenv");
dotenv.config();

// Setup Passport
require("./src/api/authentication")(passport);
app.use(passport.initialize());

// Setup Logging
var winston = require("winston");
var expressWinston = require("express-winston");
var { Loggly } = require("winston-loggly-bulk");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.simple()
      ),
    }),
    new Loggly({
      token: process.env.LOGGLY_TOKEN,
      subdomain: "happpyprinter",
      tags: ["Winston-NodeJS"],
      json: true,
    }),
  ],
});

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.splat(),
          winston.format.simple()
        ),
      }),
      new winston.transports.Loggly({
        subdomain: "happyprinter",
        inputToken: process.env.LOGGLY_TOKEN,
        json: true,
        tags: ["NodeJS-Express"],
      }),
    ],
  })
);

// Set global root directory var
global.appRoot = path.resolve(__dirname);

const Device = require("./src/models/device.model");
const User = require("./src/models/user.model");
const Publication = require("./src/models/publication.model");

const ModuleManager = require("./src/modules/moduleManager");

const port = 3081;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../webApp/build")));

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const router = require("./src/api/router")(app);

app.listen(port, () => {
  logger.log({
    level: "info",
    message: `Server listening on the port::${port}`,
  });
});

ModuleManager.setupLogger(logger);
ModuleManager.updateDatabase();
ModuleManager.registerModules();
