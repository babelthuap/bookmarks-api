
'use strict';

let express = require('express');
let router = express.Router();

let Item = require('../models/item');
let Offer = require('../models/offer');
let User = require('../models/user');
let auth = require('../config/auth');

let checkError = (err, res, user) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(user);
  }
}

// user registration
router.post('/register', (req, res) => {
  console.log(req.body);
  User.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (user !== null) {
      res.status(401).send('User already exists');
    }
    else {
      let user = new User(req.body);
      user.encryptPass((err) => {
        if (err) {
          console.log(err);
          res.status(500).send('Encryption failed');
        }
        else {
          user.save((err, doc) => {
            if (!err) {
              doc.password = null;
            }
            checkError(err, res, doc);
          });
        }
      });
    }
  });
});

// User authentication
router.post('/authenticate', (req, res) => {
  console.log('Authenticating', req.body.username);
  User.findOne({username: req.body.username}, (err, doc) => {
    if (err) {
      console.error('Database error: ', err);
      res.status(500).send();
    }
    else if (doc === null) {
      console.log('User not found.');
      res.status(401).send();
    }
    else {
      doc.validatePass(req.body.password, (err, result) => {
        if (err || !result) {
          console.log('Password check failed ', err);
          res.status(401).send();
        }
        else {
          console.log('Logged in.');
          let token = doc.token();
          if (token) {
            res.setHeader('X-Authenticate', token);
            res.send();
          }
          else {
            res.status(500).send();
          }
        }
      });
    }
  });
});

// the user may request their details
router.get('/me', auth.isAuth, (req, res) => {
  let id = req.userId;
  User.findOne({_id: id}, (err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (!user) {
      res.status(401).send('Authentication error');
    } 
    else {
      user.password = null;
      res.json(user);
    }
  });
});

// the user may update their record
router.put('/me', auth.isAuth, (req, res) => {
  let user = new User(req.body);
  user._id = req.userId;
  console.log(user);
  user.encryptPass((err) => {
    if (err) {
      checkError(err, res);
    }
    else {
      User.findOneAndUpdate({_id: req.userId}, user, {new: true}, (err, doc) => {
        if (err) {
          checkError(err, res);
        }
        else {
          doc.password = null;
          res.json(doc);
        }
      });
    }
  });
});

// The user may post an item
// req.body contains a new item
router.post('/item', auth.isAuth, (req, res) => {
  let item = new Item(req.body);
  item.owner = req.userId;
  console.log('item: ', item);
  item.save((err, doc) => {
    checkError(err, res, doc);
  });
});

// The user may update an item
// req.body contains an existing item
router.put('/item', auth.isAuth, (req, res) => {
  let item = new Item(req.body);
  console.log('item: ', item);
  Item.findOneAndUpdate({_id: item._id, owner: req.userId}, item, {new: true}, (err, doc) => {
    if (err) {
      checkError(err, res, doc);
    }
    else if (!doc) {
      checkError('Item not found', res);
    }
    else {
      checkError(err, res, doc);
    }
  });
});

// The user may delete their items
router.delete('/item/:itemId', auth.isAuth, (req, res) => {
  Item.findOneAndRemove({_id: req.params.itemId, owner: req.userId}, (err, doc) => {
    if (err) {
      checkError(err, res);
    }
    else if (!doc) {
      checkError('Item not found', res);
    }
    else {
      checkError(err, res, doc);
    }
  });
});

// The user may request a list of his items
// Items are selecetd based on the user ID
router.get('/items', auth.isAuth, (req, res) => {
  Item.find({owner: req.userId}, null, {sort: '-updated'}, (err, items) => {
    if (!err) {
      res.send(items);
    }
    else {
      res.status(400);
    }
  });
});

// The user may request a list of all items for sale
// All items that are marked 'forSale' are returned 
router.get('/listings', auth.isAuth, (req, res) => {
  Item.find({forSale: true, owner: {$ne: req.userId}}, null, {sort: '-updated'})
    .populate('owner', 'username email avatar')
    .exec((err, items) => {
    if (!err) {
      res.send(items);
    }
    else {
      res.status(400);
    }
  });
});

// The user may offer and item for an exchange
// The user may offer more than one item
router.post('/offer', auth.isAuth, (req, res) => {
  let offer = new Offer(req.body);
  offer.from = req.userId;
  console.log('offer: ', offer);
  offer.save((err, doc) => {
    checkError(err, res, doc);
  });
});

// The user may revoke an offer before it is accepted
router.delete('/offer/:offerId', auth.isAuth, (req, res) => {
  Offer.findOneAndRemove({_id: req.params.offerId}, (err, doc) => {
    checkError(err, res, doc);
  });
});

// The user may request a list of all his offers
router.get('/offers', auth.isAuth, (req, res) => {
  Offer.find({from: req.userId}, null, {sort: '-updated'})
    .populate('to', 'username email avatar')
    .populate('for offer')
    .exec((err, items) => {
    if (!err) {
      res.send(items);
    }
    else {
      res.status(400);
    }
  });
});

// The user may request a list of all offers to him
router.get('/offers/tome', auth.isAuth, (req, res) => {
  Offer.find({to: req.userId}, null, {sort: '-updated'})
    .populate('from', 'username email avatar')
    .populate('for offer')
    .exec((err, items) => {
    if (!err) {
      res.send(items);
    }
    else {
      res.status(400);
    }
  });
});

// The user can reject the offer. If this happens the
// other user can post another one.
router.put('/offer/reject', auth.isAuth, (req, res) => {
  console.log('Rejecting offer: ', req.body);
  let offerId = req.body.id;
  Offer.findOneAndUpdate({_id: offerId, to: req.userId}, {accepted: false}, {new: true}, (err, doc) => {
    checkError(err, res, doc);
  });
});

// This is a special request when the user accepts
// one offer. As a result the items change hands.
// One offer is accepted and other are rejected.
router.put('/offer/accept', auth.isAuth, (req, res) => {
  console.log('Rejecting offer: ', req.body);
  Offer.findOneAndUpdate({_id: req.body.id, to: req.userId}, {accepted: true}, {new: true}, (err, doc) => {
    if (err) {
      checkError(err, res);
    }
    else {
      console.log('Offer accepted', doc);
      let forId = doc.for;
      let fromId = doc.from;
      let offerId = doc.offer;
      Offer.update({_id: {$ne: offerId}, to: req.userId, for: forId}, {accepted: false}, (err, raw) => {
        if (err) {
          checkError(err, res);
        }
        else {
          console.log('Offers rejected', raw);
          Item.findOneAndUpdate({_id: forId, owner: req.userId}, {owner: fromId}, (err, doc2) => {
            if (err) {
              checkError(err, res);
            }
            else {
              console.log('Item changed hands', doc2);
              Item.findOneAndUpdate({_id: offerId, owner: fromId}, {owner: req.userId}, (err, doc3) => {
                console.log('Item changed hands', doc3);
                checkError(err, res, 'OK');
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
