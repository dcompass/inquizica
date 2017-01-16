var express = require('express');
var router = express.Router();

// Public

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/demos', function (req, res) {
  res.render('demos');
});

router.get('/signup', allowOnly0, function (req, res) {
  res.render('signup');
});

router.get('/login', allowOnly0, function (req, res) {
  res.render('login');
});


// Students

router.get('/account', allowAbove1, function (req, res) {
  res.render('account');
});

router.get('/course/:id', allowAbove1, function (req, res) {
  res.render('course');
});

router.get('/quiz/:id', allowAbove1, function (req, res) {
  res.render('quiz');
});


// Mentors

router.get('/scheduler', allowAbove2, function (req, res) {
  res.render('scheduler');
});


// Admins

router.get('/admin', allowAbove3, function (req, res) {
  res.render('admin');
});


// Utilities

function allowOnly0 (req, res, next) {
  if (typeof req.user == "undefined") {
    next();
  } else if (req.user.type > 0) {
    res.status(301).set('Location', '/account').end();
  } else {
    next();
  }
}

function allowAbove1 (req, res, next) {
  if (typeof req.user == "undefined") {
    res.status(403).set('Location', '/login').end();
  } else if (req.user.type >= 1) {
    next();
  } else {
    res.status(403).set('Location', '/login').end();
  }
}

function allowAbove2 (req, res, next) {
  if (typeof req.user == "undefined") {
    res.status(403).set('Location', '/login').end();
  } else if (req.user.type >= 2) {
    next();
  } else {
    res.status(403).set('Location', '/login').end();
  }
}

function allowAbove3 (req, res, next) {
  if (typeof req.user == "undefined") {
    res.status(403).set('Location', '/login').end();
  } else if (req.user.type >= 3) {
    next();
  } else {
    res.status(403).set('Location', '/login').end();
  }
}

module.exports = router;
