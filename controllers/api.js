// This module/API is an express rotuer.
var express = require('express');
var router = express.Router();

// Load useful modules.
var passport = require('passport');
var logger = require('../middleware/logs.js');
var papa = require('babyparse');
var fs = require('fs');

// Load parsing middleware mostly for form data.
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var multer = require('multer');
var upload = multer({ dest: __dirname + '/../uploads/' });

// Load database models.
var User = require('../db/models/user');
var Course = require('../db/models/course');
var Quiz = require('../db/models/quiz');
var Question = require('../db/models/question');
var Qm = require('../db/models/qm');

// ==============|
// Authorization |
// ==============|

router.post('/auth/login', jsonParser, passport.authenticate('local', {failureRedirect: '/login'}), function (req, res, next) {
  if (typeof req.user != "undefined") {
    res.status(200).json({"redirect_url": "/account"});
  } else {
    res.status(300).end();
  }
});

router.post('/auth/logout', function (req, res, next) {
  req.logout();
  res.set('Location', '/');
  res.status(303).end();
});

router.get('/auth/logout', function (req, res, next) {
  req.logout();
  res.set('Location', '/');
  res.status(303).end();
});

// ===============|
// Demonstrations |
// ===============|

router.post('/demo/promo', jsonParser, function (req, res, next) {
  res.set("Content-Type", "application/json");

  // Check valid ID.
  var valid_ids = [5, 6];
  if (valid_ids.indexOf(Number(req.body.course)) == -1) {
    res.status(400).json({});
  } else {
    var quiz_id = req.body.course;

    // Check if user exists
    User.existsByPhone(req.body.phone)
    .then(function (exists) {
      // If they do...
      if (exists == 1) {
        res.status(400).json({resp: 0}); // -> Bad request (already did it)

      // If they don't...
      } else {
        var user_params = {
          firstname: "Promo_User",
          phone: req.body.phone,
          type: 0
        };

        // Add the new user
        User.newUser(user_params)
        .then(function (data) {
          // Send them the quiz.
          var sent = Qm.sendQuiz(req.body.phone, quiz_id);
          if (sent) { res.status(200).json({resp: 1}); }
        }).catch(function (err) { res.status(500).json({}); });
      }
    });
  };
});

router.post('/admin', upload.single('spreadsheet'), function (req, res, next) {
  if (req.file.mimetype != 'text/csv') { console.log('wrong type'); }
  else { console.log(req.file); }
  // res.status(200).json({'redirect_url': '/admin'});

  var fileContent = fs.readFileSync(req.file.path, { encoding: 'utf8' });
  papa.parse(fileContent, {
    delimiter: ",",
    newline: "\r\n",
    complete: function (results) {
      makeQuiz(results.data, function (err) {
        res.status(200).json({'redirect_url': '/admin'});
      });
    }
  });

  function makeQuiz (csvArray, cb) {
    var quizTitle = csvArray[10][1];
    console.log(quizTitle);
    cb(null);
  }
});

// ===========|
// User Model |
// ===========|

/**
 * POST /user
 */
router.post('/user/', jsonParser, function (req, res, next) {
  var course_code = req.body.code;
  delete req.body.code;
  User.newUser(req.body).then(function (data) {
      // TODO: Join course if desired.

      // Create user.
      var usr = { "id": data[0].id, "name": req.body.firstname, "type": req.body.type };
      // Login
      req.login(usr, function (err) {
        res.status(200).json({"redirect_url": "/account"});
      });
    })
    .catch(function (err) {
      // logger.log('error', err);
      // res.set('Location', '/signup');
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
        res.status(200).json([]);
      } else {
        // var results = data.map(function (elem) { return elem.course_id; });
        res.status(200).json(data);
      }
    })
    .catch(function (err) {
      res.status(500).json([]);
    });
});

// router.get('/user/')

// =============|
// Course Model |
// =============|

// Should also add user to this new course.
router.post('/course', jsonParser, function (req, res, next) {
  // TODO: Remove this.
  // res.status(200).json({"redirect_url": "/account"});

  Course.newCourse(req.body)
    .then(function (data) {
      res.set('location', '/');
      res.status(200).end();
    })
    .catch(function (err) {
      res.set('location', '/');
      res.status(400).end();
    });
});

// TODO: remove this.
router.get('/course/topics', function (req, res, next) {
  res.status(200).json([
    { id: 1, title: "HIPAA Protocols"},
    { id: 2, title: "Central Nervous System"},
    { id: 3, title: "Calculus"},
    { id: 4, title: "Javascript"},
    { id: 5, title: "Civic Duties"},
  ]);
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

// ===========|
// Quiz Model |
// ===========|

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

router.get('/quiz/:id/analytics', function (req, res, next) {
  // Quiz exists?
  Quiz.getQuestions(req.params.id)
  .then(function (data) {
    if (data.length > 0) {
      var ids = data.map(function (row) { return row.question_id; });
      Quiz.getRecords(ids)
      .then(function (records) {
        res.status(200).json(records);
      }).catch(function (err) { res.status(501).json([]); })
    } else { res.status(404).json([]); }
  }).catch(function (err) { res.status(501).json([]); });
});

router.get('/quiz/:id/questions', function (req, res, next) {
  Quiz.getQuestions(req.params.id)
  .then(function (data) {
    if (data.length > 0) {

      // Count ids for grouping.
      var tmp = [];
      data.forEach(function (resp, idx) {
        if (tmp.indexOf(resp.question_id) == -1) { tmp.push(resp.question_id); }
      });

      // Fill questions array.
      var questions = new Array(tmp.length);
      data.forEach(function (resp, idx) {
        var spot = tmp.indexOf(resp.question_id);
        if (typeof questions[spot] == "undefined") { questions[spot] = []; }
        questions[spot].push(resp);
      });

      res.status(200).json(questions);
    }
    else { res.status(404).json([]); }
  })
  .catch(function (err) { console.log(err); res.status(501).json([]); });
})

router.put('/quiz/:id/question', function (req, res, next) {
  Quiz.exists(req.params.id)
  .then(function (data) {
    if (data == 1) {
      Quiz.addQuestion(req.params.id, req.query.id, req.query.index)
      .then(function (data) {
        res.status(200).end();
      })
      .catch(function (err) { console.log(err); res.status(501).end(); });
    } else { res.status(404).end(); }
  }).catch(function (err) { res.status(501).end(); });
});

router.post('/quiz/:id/record', jsonParser, function (req, res, next) {
  res.status(501).end();
});

// ===============|
// Question Model |
// ===============|

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
