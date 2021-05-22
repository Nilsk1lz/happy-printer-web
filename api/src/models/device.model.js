'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DeviceSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    required: true,
  },

  apps: {
    type: Object,
    required: true,
    default: {},
  },

  images: [
    {
      type: Schema.ObjectId,
      ref: 'Image',
      required: false,
    },
  ],

  mac_address: {
    type: String,
    required: true,
  },

  friendly_name: {
    type: String,
    required: true,
  },

  print_time: {
    type: String,
    required: false,
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

DeviceSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Device', DeviceSchema);
