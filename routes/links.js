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
  res.send('');
});

router.delete('/', (req, res) => {
  res.send('');
});

module.exports = router;
