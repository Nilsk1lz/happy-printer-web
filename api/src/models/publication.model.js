'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PublicationSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  path: {
    type: String,
    required: true,
  },

  cron: {
    type: String,
    required: true,
  },

  cron_description: {
    type: String,
    required: true,
  },

  options: [
    {
      type: Object,
      required: false,
    },
  ],

  icon: {
    type: String,
    required: false,
  },

  preview: {
    type: String,
    required: false,
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

PublicationSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Publication', PublicationSchema);
