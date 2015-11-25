'use strict';

let express = require('express');
let router = express.Router();

let Tag = require('../models/tag');

router.get('/', (req, res) => {
  Tag.find({}, null, {sort: '-updated'})
    .populate('tags', 'name')
    .exec((err, tags) => {
    if (err) {
      res.status(400).send('Error');
    }
    else {
      res.send(tags);
    }
  });
});

router.post('/', (req, res) => {
  let tag = new Tag(req.body);
  tag.save((err, doc) => {
    if (err) {
      res.status(400).send();
    }
    else {
      res.send(doc);
    }
  });
});

router.put('/', (req, res) => {
  res.send('');
});

router.delete('/', (req, res) => {
  res.send('');
});

module.exports = router;
