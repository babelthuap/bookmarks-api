'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let linkSchema = mongoose.Schema({
    title: String,
    url: String,
    tags: [{type: Schema.Types.ObjectId, ref: 'tags'}],
    updated: {type: Date, default: Date.now}
  });

module.exports = mongoose.model('links', linkSchema);
