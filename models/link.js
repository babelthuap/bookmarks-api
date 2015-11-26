'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let linkSchema = mongoose.Schema({
    title: {type: String, unique: true, required: true},
    url: {type: String, required: true},
    tags: [{type: Schema.Types.ObjectId, ref: 'tags'}],
    updated: {type: Date, default: Date.now}
  }, { strict: true });

module.exports = mongoose.model('links', linkSchema);
