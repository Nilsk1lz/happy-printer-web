'use strict';

var mongoose = require('mongoose'),
  secret = 'NINJA',
  crypto = require('crypto'),
  jwt = require('jwt-simple'),
  Schema = mongoose.Schema,
  uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    required: true,
  },

  apps: {
    type: Object,
    required: true,
    default: {},
  },

  devices: [
    {
      type: Schema.ObjectId,
      ref: 'Device',
      required: false,
    },
  ],

  local: {
    email: String,
    hash: String,
    salt: String,
    token: String,
    api_key: String,
    first_name: String,
    last_name: String,
    invite_id: String,
  },

  token: {
    type: String,
    required: false,
  },

  active: {
    type: Boolean,
    required: true,
    default: true,
  },

  verified: {
    type: Boolean,
    required: true,
    default: false,
  },

  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },

  created_at: {
    type: Date,
    required: true,
    default: new Date(),
  },

  updated_at: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

// **************
// Methods
// **************

UserSchema.methods.parse = function () {
  this.salt = undefined;
  this.hashed_password = undefined;
  this.token = undefined;
  this.invite_id = undefined;
  // 	this.deleted = undefined;
};

UserSchema.methods.parseLogin = function () {
  this.salt = undefined;
  this.hashed_password = undefined;
  this.invite_id = undefined;
  // 	this.deleted = undefined;
};

UserSchema.methods.authenticate = function (plainText, hash, salt) {
  return this.hashPassword(plainText, salt) === hash;
};

UserSchema.methods.makesalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

UserSchema.methods.hashPassword = function (pin, salt) {
  if (!pin || !salt) return '';
  const newsalt = new Buffer(salt, 'base64');
  const hash = crypto.pbkdf2Sync(pin, newsalt, 10000, 64, 'sha512').toString('base64');
  return hash;
};

UserSchema.methods.generateToken = function () {
  var payload = { board_id: this._id, date: new Date() };
  this.local.token = jwt.encode(payload, secret);
  return this.local.token;
};

UserSchema.methods.generateApiKey = function () {
  this.api_key = this.makesalt();
  return this.api_key;
};

UserSchema.methods.authenticateToken = function (token) {
  var decoded = jwt.decode(token, secret);
  return decoded.board_id === this._id;
};

UserSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
