'use strict';

let express = require('express');
let router = express.Router();

let Link = require('../models/link');

router.get('/', (req, res) => {
  Link.find({}, null, {sort: '-updated'})
    .populate('tags', 'name')
    .exec((err, links) => {
    if (err) {
      res.status(400).send('Error');
    }
    else {
      res.send(links);
    }
  });
});

router.post('/', (req, res) => {
  let link = new Link(req.body);
  link.save((err, doc) => {
    if (err) {
      res.status(400).send();
    }
    else {
      res.send(doc);
    }
  });
});

router.put('/', (req, res) => {
  Link.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
    if (err) {
      res.status(400).send();
    }
    else {
      res.send(doc);
    }
  });
});

router.delete('/', (req, res) => {
  Link.findOneAndRemove({_id: req.body._id}, (err, doc) => {
    if (err) {
      res.status(400).send();
    }
    else {
      res.send('Success');
    }
  });
});

module.exports = router;
