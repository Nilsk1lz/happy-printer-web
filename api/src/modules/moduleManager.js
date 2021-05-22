var fs = require("fs");
var path = require("path");
var cronstrue = require("cronstrue");
var async = require("async");
var { v4: uuidv4 } = require("uuid");
var capture = require("capture-phantomjs");
var CronJob = require("cron").CronJob;
var Device = require("../models/device.model");
var Image = require("../models/image.model");
var Publication = require("../models/publication.model");
const mongoose = require("mongoose");
const { publicEncrypt } = require("crypto");

const moduleDir = path.join(appRoot, "src", "modules");
const clientDir = path.join(appRoot, "assets", "images");

var logger;

const deleteFile = (filename) => {
  fs.unlink(path.join(clientDir, `${filename}.html`), (err) => {
    if (err) {
      logger.log({
        level: "error",
        message: `Error deleting file ${filename}`,
      });
    }
  });
};

const createFilePaths = () => {
  const static = path.join(appRoot, "assets");
  const images = path.join(static, "images");
  if (!fs.existsSync(static)) {
    fs.mkdirSync(static);
  }
  if (!fs.existsSync(images)) {
    fs.mkdirSync(images);
  }
};

const captureError = (e) => {
  logger.log({ level: "error", message: e });
};

const queueImageForDevices = (image, config) => {
  logger.log({
    level: "info",
    message: `Generating queues for ${config.name}`,
  });

  let query = {};
  query[`apps.${config._id}`] = { $exists: true };

  Device.find(query).exec((err, devices) => {
    if (err) return captureError(err);

    // Check if any devices have subscription to app
    if (!devices.length) {
      logger.log({
        level: "info",
        message: `No subscriptions found for ${config.name}`,
      });
      return;
    }

    // Replace existing image if it exists...
    // This way the device will only ever print the latest update?

    Image.findOne({ filename: config.name }).exec((err, imageDoc) => {
      if (err) return captureError(err);

      if (!imageDoc) {
        imageDoc = new Image({
          filename: config.name,
          _id: mongoose.Types.ObjectId(),
        });
      }
      imageDoc.data = image;
      imageDoc.save((err, savedImage) => {
        if (err) return captureError(err);

        // Loop through devices
        async.eachSeries(devices, (device, cb) => {
          logger.log({
            level: "info",
            message: `Adding image for ${config.name} to device: ${device._id}`,
          });
          // Add image to device queue
          if (!device.images) device.images = [];
          // Check if image exists in array
          if (
            device.images.find(
              (im) => im._id.toString() === savedImage._id.toString()
            )
          ) {
            return cb();
          }
          // Add image eto array
          device.images.push(imageDoc);
          // Save device
          device.save((err, savedDev) => {
            if (err) return captureError(err);
            logger.log({
              level: "info",
              message: `Finished job for ${config.name}`,
            });
            cb();
          });
        });
      });
    });
  });
};

const generateImage = (modulePath, config) => {
  logger.log({ level: "info", message: `Generating html for ${config.name}` });

  // Create directories
  createFilePaths();

  var module = require(modulePath);
  // Find all users with the module attached

  const userConfig = {};

  const filename = uuidv4();
  const filePath = path.join("assets", "images", `${filename}.html`);
  // generate html file
  module(filePath, userConfig)
    .then(() => {
      // generate snapshot of html
      logger.log({
        level: "info",
        message: `Generating snapshot for ${config.name}`,
      });
      capture({
        url: `http://localhost:3081/${filePath}`,
        width: 768,
        format: "png",
      })
        .then((screenshot) => {
          deleteFile(filename);

          var base64data = screenshot.toString("base64");
          queueImageForDevices(base64data, config);
        })
        .catch((e) => {
          logger.log({ level: "error", message: e });
        });
    })
    .catch((e) => {
      logger.log({ level: "error", message: e });
    });
};

const createCronJob = (modulePath, config) => {
  logger.log({
    level: "info",
    message: `Creating cronjob for ${config.name} running ${cronstrue.toString(
      config.cron
    )}`,
  });

  var job = new CronJob(
    config.cron,
    () => {
      generateImage(modulePath, config);
    },
    null,
    true,
    "Europe/London",
    this,
    false
  );
  job.start();
};

const seedDatabase = () => {
  console.log("Updating database");
  var modules = require("./modules.json");
  Publication.find().exec((err, pubs) => {
    async.eachSeries(modules, (mod, cb) => {
      console.log(`updating ${mod.name}`);
      let pub = pubs.find((p) => p._id.toString() === mod._id);

      if (!pub) {
        pub = new Publication(mod);

        return pub.save(cb);
      }

      Object.keys(mod).forEach((key) => {
        if (key !== "_id") pub[key] = mod[key];
      });

      pub.save(cb);
    });
  });
};

module.exports = {
  setupLogger: (globalLogger) => {
    logger = globalLogger;
  },
  // Run on app start
  // Register cron jobs
  registerModules: () => {
    // Get publications from the database
    Publication.find().exec((err, pubs) => {
      // Check and return error
      if (err) return captureError(err);

      async.eachSeries(pubs, (pub, cb) => {
        // Get config
        var modulePath = path.join("../modules/", pub.path);
        var configPath = path.join(modulePath, "config.json");

        var config = require(configPath);

        // Create job for module
        createCronJob(modulePath, config);
        cb();
      });
    });
  },
  updateDatabase: () => {
    seedDatabase();
  },
};
