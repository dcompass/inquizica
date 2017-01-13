var express = require('express');
var router = express.Router();

var passport = require('passport');

var logger = require('../middleware/logs.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var User = require('../db/models/user');
var Course = require('../db/models/course');
var Quiz = require('../db/models/quiz');
var Question = require('../db/models/question');


router.post('/auth/login', jsonParser, passport.authenticate('local', {successRedirect: '/account', failureRedirect: '/login'}), function (req, res, next) {
  res.status(300).end();
});

router.post('/auth/logout', function (req, res, next) {
  req.logout();
  res.set('Location', '/');
  res.status(301).end();
});

// =================================================

router.post('/user/', jsonParser, function (req, res, next) {
  User.newUser(req.body)
    .then(function (data) {
      res.set('Location', '/account');
      res.status(301).end();
    })
    .catch(function (err) {
      // logger.log('error', 'Could not create user.');
      res.set('Location', '/signup');
      res.status(400).end();
    });
});

router.get('/user/:id', function (req, res, next) {
  User.getUser(req.params.id)
    .then(function (user) {
      // TODO: Stricter tests on responses.
      if (user.length == 0) {
        res.status(404).json({});
      } else {
        res.status(200).json(user[0]);
      }
    })
    .catch(function (err) {
      logger.log('error', 'Could not find user.');
      res.status(404).json({});
    });
});

router.put('/user/:id', function (req, res, next) {
  User.updateUser(req.params.id, req.body)
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      console.log(err);
    });
});

router.delete('/user/:id', function (req, res, next) {
  User.getUser(req.params.id)
    .then(function (data) {
      if (data.length == 0) {
        res.status(404).end();
      } else {
        User.deleteUser(req.params.id)
          .then(function (data) {
            res.status(200).end();
          })
          .catch(function (err) {
            res.status(500).end();
          });
      }
    })
    .catch(function (err) {
      res.status(500).end();
    });
});

router.get('/user/:id/progression', function (req, res, next) {
  User.getProg(req.params.id, req.query.course)
    .then(function (data) {
      if (data.length == 0) {
        res.status(404).json([]);
      } else {
        res.status(200).json(JSON.parse(data[0].progression));
      }
    })
    .catch(function (err) {
      res.status(500).end();
    });
});

router.put('/user/:id/progression', jsonParser, function (req, res, next) {
  // console.log(req.params.id, req.query.course, JSON.stringify(req.body.progression));
  User.updateProg(req.params.id, req.query.course, JSON.stringify(req.body.progression))
    .then(function (data) {
      if (data == 0) {
        res.status(404).end();
      } else {
        res.status(200).end();
      }
    })
    .catch(function (err) {
      res.status(500).end();
    })
  // User.updateProg(req.params.id, req.query.course, req.body)
});

router.get('/user/:id/courses', function (req, res, next) {
  User.getCourses(req.params.id)
    .then(function (data) {
      if (data.length == 0) {
        res.status(404).json([]);
      } else {
        var results = data.map(function (elem) { return elem.course_id; });
        res.status(200).json(results);
      }
    })
    .catch(function (err) {
      res.status(500).json([]);
    });
});

// =================================================

router.post('/course/', function (req, res, next) {
  res.status(500).end("No");
});

router.get('/course/:id', function (req, res, next) {
  res.status(500).end("No");
});

router.put('/course/:id', function (req, res, next) {
  res.status(500).end("No");
});

router.delete('/course/:id', function (req, res, next) {
  res.status(500).end("No");
});

// =================================================

router.post('/quiz/', function (req, res, next) {
  res.status(500).end("No");
});

router.get('/quiz/:id', function (req, res, next) {
  res.status(500).end("No");
});

router.put('/quiz/:id', function (req, res, next) {
  res.status(500).end("No");
});

router.delete('/quiz/:id', function (req, res, next) {
  res.status(500).end("No");
});

// =================================================

router.post('/question/', function (req, res, next) {
  res.status(500).end("No");
});

router.get('/question/:id', function (req, res, next) {
  res.status(500).end("No");
});

router.put('/question/:id', function (req, res, next) {
  res.status(500).end("No");
});

router.delete('/question/:id', function (req, res, next) {
  res.status(500).end("No");
});

// =================================================

router.post('/response/', function (req, res, next) {
  res.status(500).end("No");
});

router.get('/response/:id', function (req, res, next) {
  res.status(500).end("No");
});

router.put('/response/:id', function (req, res, next) {
  res.status(500).end("No");
});

router.delete('/response/:id', function (req, res, next) {
  res.status(500).end("No");
});



module.exports = router;
