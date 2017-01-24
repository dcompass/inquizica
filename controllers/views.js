var express = require('express');
var router = express.Router();

// Public

router.get('/', function (req, res) {
  if (typeof req.user == "undefined") {
    res.render('index', {user: null} );
  } else {
    res.render('index', {user: req.user});
  }
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
  res.render('account', {user: req.user});
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
  console.log(req.user);
  if (typeof req.user == "undefined") {
    next();
  } else if (req.user.type > 0) {
    res.status(303).set('Location', '/account').end();
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
