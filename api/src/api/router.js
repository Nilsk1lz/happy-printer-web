const path = require("path");
const cors = require("cors");
const User = require("../models/user.model");
const Device = require("../models/device.model");
const Image = require("../models/image.model");
const Publication = require("../models/publication.model");
const passport = require("passport");

module.exports = (app) => {
  app.use(cors({ origin: true, credentials: true }));

  app.post("/api/register", (req, res) => {
    const user = new User();
    const salt = user.makesalt();
    const hash = user.hashPassword(req.body.password, salt);

    user.local = {
      email: req.body.email,
      salt,
      hash,
    };

    user._id = mongoose.Types.ObjectId();

    user.generateApiKey();

    user.save((err, registeredUser) => {
      logger.log({ level: "error", message: `Error saving user: ${err}` });
      if (err) return res.status(500).send();
      return res.status(201).send(registeredUser);
    });
  });

  // Login and Refresh tokens

  app.get(
    "/api/login",
    passport.authenticate("basic", { session: false }),
    (req, res) => {
      const { user } = req;
      res.header("Access-Control-Allow-Origin", "*");
      return res.status(200).send({
        token: user.local.token,
        devices: user.devices,
        api_key: user.local.api_key,
      });
    }
  );

  app.get(
    "/api/user",
    passport.authenticate("bearer", { session: false }),
    (req, res) => {
      const { user } = req;
      return res
        .status(200)
        .send({ token: user.local.token, devices: user.devices });
    }
  );

  // Patreon Oauth

  app.get("/api/oauth", (req, res) => {
    var oauth = require("./src/oauth");
    oauth.handleOAuthRedirectRequest(req, res);
  });

  app.post("/api/link", (req, res) => {
    // Update user account with patreon info
  });

  /////////////////////////////////////////
  // Private API
  /////////////////////////////////////////

  app.get(
    "/api/devices/:id",
    passport.authenticate(["localapikey", "bearer"], { session: false }),
    (req, res) => {
      Device.findOne({
        _id: req.params.id,
      })
        .populate("images")
        .exec((err, device) => {
          if (err) return res.status(500).send();
          return res.status(200).send(device);
        });
    }
  );

  app.get(
    "/api/devices",
    passport.authenticate(["localapikey", "bearer"], { session: false }),
    (req, res) => {
      Device.find({ _id: { $in: [req.user.devices.map((d) => d._id)] } })
        .populate("images")
        .exec((err, devices) => {
          if (err) return res.status(500).send();
          return res.status(200).send(devices);
        });
    }
  );

  app.post(
    "/api/devices",
    passport.authenticate(["localapikey", "bearer"], { session: false }),
    (req, res) => {
      const body = req.body;
      // Check if device exists
      req.user.devices.forEach((device) => {
        if (device.mac_address === body.mac_address)
          return res.status(409).send();
      });
      body._id = new mongoose.Types.ObjectId();
      new Device(body).save((err, device) => {
        if (err) return res.status(400).send();
        req.user.devices.push(device);
        req.user.save((err, savedUser) => {
          if (err) return status(500).send();
          res.status(201).send(req.user.devices);
        });
      });
    }
  );

  app.put(
    "/api/devices/:mac_address",
    passport.authenticate(["localapikey", "bearer"], { session: false }),
    (req, res) => {
      const { mac_address } = req.params;
      // Check if device exists
      if (!mac_address) return res.status(400).send();
      let device = req.user.devices.find((d) => d.mac_address === mac_address);

      const updatedDevice = req.body;
      device.apps = updatedDevice.apps;
      device.print_time = updatedDevice.print_time;
      device.save((err, updated) => {
        if (err) return res.status(400).send();
        return res.status(200).send(updated);
      });
    }
  );

  app.delete(
    "/api/devices/:deviceId?/images?/:imageId?",
    passport.authenticate(["localapikey", "bearer"], { session: false }),
    (req, res) => {
      if (!req.params.deviceId) {
        // This is a reset command
        // Delete all devices from the user
        req.user.devices = [];
        req.user.save((err) => {
          if (err) return res.status(500).send();
          return res.status(204).send();
        });
      } else {
        // Delete the image from the device
        Device.findOne({ _id: req.params.deviceId }).exec((err, device) => {
          if (err || !device) return res.status(404).send();
          // Set array to images not matching the imageId
          device.images = device.images.filter(
            (i) => i._id.toString() !== req.params.imageId
          );
          device.save((err, savedDevice) => {
            if (err) return res.status(500).send();
            return res.status(200).send(savedDevice);
          });
        });
      }
    }
  );

  /////////////////////////////////////////
  // Public API
  /////////////////////////////////////////

  app.get("/api/publications", (req, res) => {
    Publication.find().exec((err, pubs) => {
      if (err) return res.status(500).send();

      res.header("Access-Control-Allow-Origin", "*");
      return res.status(200).send(pubs);
    });
  });

  // Route to server assets

  app.get("/assets/*", (req, res) => {
    console.log("APPROOT: ", appRoot);
    res.sendFile(path.join(__dirname, "../../", req.originalUrl));
  });

  // Route to React App

  app.get("/*", (req, res) => {
    if ("development" === process.env.NODE_ENV) {
      res.sendFile(
        path.join(__dirname, `../../../webApp/build/dev/index.html`)
      );
    } else {
      res.sendFile(
        path.join(__dirname, "../../../webApp/build/prod/index.html")
      );
    }
  });
};
