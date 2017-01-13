var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/signup', function (req, res) {
  res.render('signup');
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/account', function (req, res) {
  if (typeof req.user == 'undefined') {
    res.status(403).end();
  } else {
    res.render('account');
  }
});

module.exports = router;
