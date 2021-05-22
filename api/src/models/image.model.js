"use strict";

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var ImageSchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    required: true,
  },

  data: {
    type: String,
    required: true,
  },

  filename: {
    type: String,
    required: true,
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

ImageSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model("Image", ImageSchema);
