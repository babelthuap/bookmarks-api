'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


// let Tag;


let tagSchema = mongoose.Schema({
  name: {type: String, unique: true, required: true},
  links: [{type: Schema.Types.ObjectId, ref: 'links'}],
  updated: {type: Date, default: Date.now}
}, { strict: true });

// Tag.statics

module.exports = mongoose.model('tags', tagSchema);
