'use strict';

let express = require('express');
let router = express.Router();

let Tag = require('../models/tag');

router.get('/', (req, res) => {
  Tag.find({}, null, {sort: '-updated'})
    .populate('links', 'title url')
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
      // should update each of the links in the links array
      res.send(doc);
    }
  });
});

router.put('/', (req, res) => {
  Tag.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
    if (err) {
      res.status(400).send();
    }
    else {
      // should update each of the links in the links array
      res.send(doc);
    }
  });
});

router.delete('/', (req, res) => {
  Tag.findOneAndRemove({_id: req.body._id}, (err, doc) => {
    if (err) {
      res.status(400).send();
    }
    else {
      // should update each of the links in the links array
      res.send('Success');
    }
  });
});

module.exports = router;
