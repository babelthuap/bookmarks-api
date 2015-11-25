'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tagSchema = mongoose.Schema({
    name: String,
    links: [{type: Schema.Types.ObjectId, ref: 'links'}],
    updated: {type: Date, default: Date.now}
  });

module.exports = mongoose.model('tags', tagSchema);
