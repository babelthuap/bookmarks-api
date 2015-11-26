'use strict';

let express = require('express');
let router = express.Router();

let Link = require('../models/link');
let Tag = require('../models/tag');

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
  console.log('req.body: ', req.body);
  let link = new Link(req.body);
  let tags = req.body.tags.map(t => {return {name: t}});
  console.log('tags: ', tags);
  Tag.create(tags, (err, docs)  => {
    console.log('docs: ', docs);
    Tag.find({name: {$in: req.body.tags}}, (err, docs) => {
      console.log('docs: ', docs);
      if (err) {
        res.status(401).send(docs);
      }
      else {
        link.tags = docs.map(t => {return t._id});
        console.log('link', link);
        Link.update({title: link.title}, link, {upsert: true, new: true}, (err, doc) => {
          Tag.update({name: {$in: req.body.tags}},
            { $addToSet: { links: link._id.toString()} },
            {multi: true, new: true}, (err, doc) => {
            if (err) {
              res.status(403).send();
            }
            else {
              res.send(doc);
            }
          });
        });
      }
    });
  });

  // link.save((err, doc) => {
  //   if (err) {
  //     res.status(400).send();
  //   }
  //   else {
  //     res.send(doc);
  //   }
  // });
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

router.delete('/:link', (req, res) => {
  Link.findOneAndRemove({_id: req.params.link}, (err, doc) => {
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

module.exports = router;
