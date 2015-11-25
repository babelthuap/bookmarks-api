'use strict';

let express = require('express');
let router = express.Router();

let Link = require('../models/link');

router.get('/', (req, res) => {
  res.send( {name: 'Nicholas'} );
});

router.post('/', (req, res) => {
  res.send('');
});

router.put('/', (req, res) => {
  res.send('');
});

router.delete('/', (req, res) => {
  res.send('');
});

module.exports = router;
