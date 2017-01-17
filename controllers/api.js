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
      res.status(303).end();
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

router.post('/course', jsonParser, function (req, res, next) {
  Course.newCourse(req.body)
    .then(function (data) {
      res.set('location', '/');
      res.status(301).end();
    })
    .catch(function (err) {
      res.set('location', '/');
      res.status(400).end();
    });
});

router.get('/course/:id', function (req, res, next) {
  Course.getCourse(req.params.id)
    .then(function (data) {
      if (data.length == 0) {
        res.status(404).json({});
      } else {
        res.status(200).json(data[0]);
      }
    })
    .catch(function (err) {
      res.status(404).json({});
    });
});

router.put('/course/:id', function (req, res, next) {
  res.status(500).end("No");
});

router.delete('/course/:id', function (req, res, next) {
  Course.getCourse(req.params.id)
    .then(function (data) {
      if (data.length == 0) {
        res.status(404).end();
      } else {
        Course.delCourse(req.params.id)
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

router.get('/course/:id/quizzes', function (req, res, next) {
  Course.getQuizzes(req.params.id)
    .then(function (data) {
      if (data.length == 0) {
        res.status(404).json({});
      } else {
        res.status(200).json(data);
      }
    })
    .catch(function (err) {
      res.status(404).json({});
    });
});

router.get('/course/:id/schedule', function (req, res, next) {
  Course.getSchedule(req.params.id)
    .then(function (data) {
      if (data.length == 0) {
        res.status(404).json({});
      } else {
        res.status(200).json(data);
      }
    })
    .catch(function (err) {
      res.status(501).json({});
    });
});

router.get('/course/:id/topics', function (req, res, next) {
  Course.getTopics(req.params.id)
    .then(function (data) {
      if (data.length == 0) {
        res.status(404).json({});
      } else {
        res.status(200).json(data);
      }
    })
    .catch(function (err) {
      res.status(501).json({});
    });
});

router.put('/course/:id/user', function (req, res, next) {
  Course.exists(req.params.id).then(function (check) { // 1
      if (check == 1) {
        User.exists(req.query.id).then(function (check2) { // 2
            if (check2 == 1) {
              Course.getQuizzes(req.params.id).then(function (data) { // 3
                  var arr = (new Array(data.length)).fill(0);
                  Course.addUser(req.params.id, req.query.id, arr) // 4
                    .then(function (resp) {
                      res.status(200).end(); // DONE.
                    }).catch(function (err) { res.status(501).end(); });
                }).catch(function (err) { res.status(501).end(); });
            } else { res.status(404).end(); }
          }).catch(function (err) { res.status(501).end(); });
      } else { res.status(404).end(); }
    }).catch(function (err) { res.status(501).end(); });
});

router.put('/course/:id/quiz', function (req, res, next) {
  Course.exists(req.params.id).then(function (check) {
      if (check == 1) {
        Quiz.exists(req.query.id).then(function (check2) {
            if (check2 == 1) {
              Course.addQuiz(req.params.id, req.query.id, req.query.index, req.query.queue, req.query.date)
                .then(function (data) {
                  res.status(200).end();
                }).catch(function (err) { console.log("A", err); res.status(501).end(); });
            } else { res.status(404).end(); }
          }).catch(function (err) { console.log("A", err); res.status(501).end(); });
      } else { res.status(404).end(); }
    }).catch(function (err) { console.log("B", err); res.status(501).end(); });
});

// =================================================

router.post('/quiz/', jsonParser, function (req, res, next) {
  Quiz.newQuiz(req.body)
    .then(function (data) {
      res.set('location', '/');
      res.status(301).end();
    })
    .catch(function (err) {
      res.status(400).end();
    });
});

router.get('/quiz/:id', function (req, res, next) {
  Quiz.getQuiz(req.params.id)
    .then(function (data) {
      if (data.length > 0) {
        res.status(200).json(data[0]);
      } else {
        res.status(404).json({});
      }
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).end("No");
    })
});

router.put('/quiz/:id', function (req, res, next) {
  res.status(500).end("No");
});

router.delete('/quiz/:id', function (req, res, next) {
  Quiz.exists(req.params.id)
    .then(function (data) {
      if (data == 1) {
        Quiz.deleteQuiz(req.params.id)
          .then(function (data) {
            res.status(200).end();
          })
          .catch(function (err) {
            res.status(501).end();
          });
      } else {
        res.status(404).end();
      }
    })
    .catch(function (err) {
      res.status(501).end();
    });
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
