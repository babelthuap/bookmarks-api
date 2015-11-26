'use strict';

let express = require('express');
let router = express.Router();

let Tag = require('../models/tag');
let Link = require('../models/link');

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
      res.send(doc);
    }
  });
});

router.delete('/:tag', (req, res) => {
  Tag.findOneAndRemove({_id: req.params.tag}, (err, doc) => {
    if (err) {
      res.status(400).send();
    }
    else if (!doc) {
      res.status(400).send('Not Found');
    }
    else {
      res.send('Success');
    }
  });
});

// this path assosiate the tag with a link updating both
router.put('/:tag/:link', (req, res) => {
  Tag.findOneAndUpdate({_id: req.params.tag},
    { $addToSet: { links: req.params.link } },
    {new: true}, (err, doc) => {
    if (err) {
      res.status(400).send();
    }
    else {
      Link.findOneAndUpdate({_id: req.params.link},
        { $addToSet: { tags: req.params.tag } },
        {new: true}, (err, doc) => {
        if (err) {
          res.status(400).send();
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});

// This path breaks assosiation between the tag and the link
router.delete('/:tag/:link', (req, res) => {
  Tag.findOneAndUpdate({_id: req.params.tag},
    { $pull: { links: req.params.link } },
    {new: true}, (err, doc) => {
    if (err) {
      res.status(400).send();
    }
    else {
      Link.findOneAndUpdate({_id: req.params.link},
        { $pull: { tags: req.params.tag } },
        {new: true}, (err, doc) => {
        if (err) {
          res.status(400).send();
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});

module.exports = router;
