process.env.NODE_ENV = 'test';

var async = require('async');
var moment = require('moment');
var knex = require('../db/knex.js');
var expect = require("chai").expect;
var request = require('supertest');
var app = require('../app.js');
var student = request.agent(app);
var teacher = request.agent(app);
var admin = request.agent(app);

// TODO: API Authentication in general.
// TODO: More specific expect() statements all over.

describe('API Controller:', function () {

  beforeEach(function (done) {
    knex.migrate.rollback()
    .then(function () {
      knex.migrate.latest()
      .then(function () {
        return knex.seed.run()
        .then(function () {
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    knex.migrate.rollback()
      .then(function () {
        done();
      });
  });

  describe('User', function () {
    it("[POST /user] should issue [303 SEE OTHER] redirect on success", function (done) {
      var user = {
        firstname: "Sean",
        lastname: "Lynch",
        phone: "610-675-4305",
        email: "seanjcrl@gmail.com",
        password: "password",
        affiliation: "Inquizica",
        type: 3
      };
      request(app)
        .post('/api/user')
        .send(user)
        .expect(303)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.header['location']).equals('/account');
          done();
        });
    });
    it("[POST /user] should issue [400 BAD REQ] on incomplete form data", function (done) {
      var user2 = {
        firstname: "Sean",
        lastname: "Lynch",
        // No Phone
        email: "seanjcrl@gmail.com",
        password: "password",
        affiliation: "Inquizica",
        type: 3
      };
      request(app)
        .post('/api/user')
        .send(user2)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.header['location']).equals('/signup');
          done();
        });
    });
    // TODO: Check all fields are present.
    it('[GET /user/:id] should issue [200 OKAY] with json for existing user', function (done) {
      request(app)
        .get('/api/user/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    })
    it('[GET /user/:id] should issue [404 NOT FOUND] with json if user does not exist', function (done) {
      request(app)
        .get('/api/user/919191')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        })
    })
    // TODO: Implement UPDATE operations.
    // TODO: Should tests if delete deletes all related entires.
    it('[DELETE /user/:id] should issue [200 OKAY] for existing user', function (done) {
      request(app)
        .delete('/api/user/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[DELETE /user/:id] should issue [404 NOT FOUND] if user does not exist', function (done) {
      request(app)
        .delete('/api/user/919191')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[GET /user/:id/progression] should issue [200 OKAY] with json on success', function (done) {
      request(app)
        .get('/api/user/1/progression?course=1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an.array;
          expect(res.body).to.have.lengthOf(3);
          done();
        });
    });
    it('[GET /user/:id/progression] should issue [404 NOT FOUND] with json if user/course does not exist ', function (done) {
      request(app)
        .get('/api/user/1/progression?course=818181')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an.array;
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });
    it('[PUT /user/:id/progression] should issue [200 OKAY] when updated successfully', function (done) {
      request(app)
        .put('/api/user/1/progression?course=1')
        .send({progression: [1, 1, 0, 0] })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    // TODO: Should check existence of user/course better.
    it('[PUT /user/:id/progression] should issue [404 NOT FOUND] if user does not exist', function (done) {
      request(app)
        .put('/api/user/919191/progression?course=1')
        .send({progression: [1, 1, 0, 0] })
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    // TODO: Implement "next", .get('/user/1/next?quiz=1')
    // it('[GET /user/:id/next] should issue 200 with json on success');
    it("[GET /user/:id/courses] should issue [200 OKAY] with json when successful", function (done) {
      request(app)
        .get('/api/user/1/courses')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });
    it("[GET /user/:id/courses] should issue [404 NOT FOUND] with json when user does not exist", function (done) {
      request(app)
        .get('/api/user/818181/courses')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });
    // TODO: Add tests for "exists".
  });

  describe("Auth", function () {
    // TODO: SALT AND HASH PASSWORDS!!!!
    it('[GET /account] should issue [403 FORBIDDEN] when user is not logged in', function (done) {
      student
        .get('/account')
        .expect(403)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[POST /login] should issue [200 OKAY] with json when successful', function (done) {
      student
        .post('/api/auth/login')
        .send({email: 'adam@gmail.com', passwd: 'password123' })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it('[GET /account] should issue [200 OKAY] when user is logged in', function (done) {
      student
        .get('/account')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it('[POST /logout] should issue [303 REDIRECT] to / when successfully logged out', function (done) {
      student
        .post('/api/auth/logout')
        .expect(303)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[GET /account] should issue [403 FORBIDDEN] after user is logged out', function (done) {
      student
        .get('/account')
        .expect(403)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
      });
  });

  describe("Course", function () {
    // TODO: should return new course id on success too (and redirect there...).
    it('[POST /course] should issue [301 REDIRECT] on success', function (done) {
      var course_data = {
        title: "Physiology",
        description: "Medical school level course",
        author: "Dr. Miller",
        affiliation: "Inquizica"
      };
      request(app)
        .post('/api/course')
        .send(course_data)
        .expect(301)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[POST /course] should issue [400 BAD REQ] on incomplete form data', function (done) {
      var course_data = {
        // title missing
        description: "Medical school level course",
        author: "Dr. Miller",
        affiliation: "Inquizica"
      };
      request(app)
        .post('/api/course')
        .send(course_data)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[GET /course/:id] should issue [200 OKAY] with json for exsiting course', function (done) {
      request(app)
        .get('/api/course/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it('[GET /course/:id] should issue [404 NOT FOUND] with json if course does not exist', function (done) {
      request(app)
        .get('/api/course/919191')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    // TODO: Check that delete cascades to delete everything related as well.
    it('[DELETE /course/:id] should issue [200 OKAY] for existing course', function (done) {
      request(app)
        .delete('/api/course/2')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[DELETE /course/:id] should issue [404 NOT FOUND] for non-existant course', function (done) {
      request(app)
        .delete('/api/course/818181')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[GET /course/:id/quizzes] should issue [200 OKAY] with json for existing course', function (done) {
      request(app)
        .get('/api/course/1/quizzes')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it('[GET /course/:id/quizzes] should issue [404 NOT FOUND] with json for non-existant course', function (done) {
      request(app)
        .get('/api/course/818181/quizzes')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it('[GET /course/:id/schedule] should issue [200 OKAY] with json for existing course', function (done) {
      request(app)
        .get('/api/course/1/schedule')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it('[GET /course/:id/schedule] should issue [404 NOT FOUND] with json for non-existant course', function (done) {
      request(app)
        .get('/api/course/818181/schedule')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    // it('[GET /course/:id/topics] should issue [200 OKAY] with json for existing course', function (done) {
    //   request(app)
    //     .get('/api/course/1/topics')
    //     .expect(200)
    //     .end(function (err, res) {
    //       if (err) return done(err);
    //       expect(res.body).to.be.json;
    //       done();
    //     });
    // });
    // it('[GET /course/:id/topics] should issue [404 NOT FOUND] with json for non-existant course', function (done) {
    //   request(app)
    //     .get('/api/course/818181/topics')
    //     .expect(404)
    //     .end(function (err, res) {
    //       if (err) return done(err);
    //       expect(res.body).to.be.json;
    //       done();
    //     });
    // });
    it('[PUT /course/:id/user] should issue [200 OKAY] for existing course', function (done) {
      request(app)
        .put('/api/course/1/user?id=4')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[PUT /course/:id/user] should issue [404 NOT FOUND] for non-existant course', function (done) {
      request(app)
        .put('/api/course/919191/user?id=2')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    // TODO: Add tests for "exists".
    it('[PUT /course/:id/quiz] should issue [200 OKAY] for existing course', function (done) {
      var some_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      var url = '/api/course/1/quiz?id=4&index=3&queue=0&date=' + encodeURIComponent(some_date);
      request(app)
        .put(url)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[PUT /course/:id/quiz] should issue [404 NOT FOUND] for non-existant course', function (done) {
      var some_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      var url = '/api/course/919191/quiz?id=2&index=0&queue=0&date=' + encodeURIComponent(some_date);
      request(app)
        .put(url)
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    // TODO: Add test for both exists checks.
  });

  describe("Quiz", function () {
    it("[POST /quiz] should issue 301 REDIRECT on success", function (done) {
      var quiz1 = {
        title: "Quiz #3",
        author: "Pynch"
      };
      request(app)
        .post('/api/quiz')
        .send(quiz1)
        .expect(301)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[POST /quiz] should issue [400 BAD REQ] on incomplete form data", function (done) {
      var quiz2 = {
        // No title
        author: "Pynch"
      };
      request(app)
        .post('/api/quiz')
        .send(quiz2)
        .expect(400)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /quiz/:id] should issue [200 OKAY] with json for existing quiz", function (done) {
      request(app)
        .get('/api/quiz/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it("[GET /quiz/:id] should issue [404 NOT FOUND] with json for non-existant quiz", function (done) {
      request(app)
        .get('/api/quiz/717171')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it("[DELETE /quiz/:id] should issue [200 OKAY] for existing quiz", function (done) {
      request(app)
        .delete('/api/quiz/2')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("[DELETE /quiz/:id] should issue [404 NOT FOUND] for non-existant quiz", function (done) {
      request(app)
        .delete('/api/quiz/717171')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    // TODO: should have different response for empty analytics.
    it("[GET /quiz/:id/analytics] should issue [200 OKAY] for existing quiz", function (done) {
      request(app)
        .get('/api/quiz/1/analytics')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          expect(res.body).to.have.lengthOf(4);
          done();
        });
    });
    it("[GET /quiz/:id/analytics] should issue [404 NOT FOUND] for non-existant quiz", function (done) {
      request(app)
        .get('/api/quiz/9/analytics')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    // TODO: Should test getRecords independantly.
    it("[GET /quiz/:id/questions] should issue [200 OKAY] for existing quiz", function (done) {
      request(app)
        .get('/api/quiz/1/questions')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });
    it("[GET /quiz/:id/questions] should issue [404 NOT FOUND] for non-existant quiz", function (done) {
      request(app)
        .get('/api/quiz/717171/questions')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    // TODO: Should test without query params.
    it("[PUT /quiz/:id/question] should issue [200 OKAY] for existing quiz", function (done) {
      request(app)
        .put('/api/quiz/1/question?id=3&index=0')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[PUT /quiz/:id/question] should issue [404 NOT FOUND] for non-existant quiz", function (done) {
      request(app)
        .put('/api/quiz/717171/question?id=3&index=0')
        .expect(404)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    // it("[POST /quiz/:id/record] should issue [200 OKAY] for existing quiz", function (done) {
    //   request(app)
    //     .post('/api/quiz/1/record')
    //     .send({})
    //     .expect(200)
    //     .end(function (err) {
    //       if (err) return done(err);
    //       done();
    //     });
    // });
    // it("[POST /quiz/:id/record] should issue [404 NOT FOUND] for non-existant quiz", function (done) {
    //   request(app)
    //     .post('/api/quiz/717171/record')
    //     .send({})
    //     .expect(404)
    //     .end(function (err) {
    //       if (err) return done(err);
    //       done();
    //     });
    // });
  });

  describe("Demo", function () {
    it('[POST /demo/promo] should issue [200 OKAY] if it contains a valid quiz id and phone number', function (done) {
      request(app)
        .post('/api/demo/promo')
        .send({ course: '5', phone: '9998887766'})
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it('[POST /demo/promo] should issue [400 BAD REQ] if it contains an invalid quiz id', function (done) {
      request(app)
        .post('/api/demo/promo')
        .send({ course: '2', phone: '6106754305'})
        .expect(400)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it('[POST /demo/promo] should issue [400 BAD REQ] if it contains an existing users phone number', function (done) {
      request(app)
        .post('/api/demo/promo')
        .send({ course: '5', phone: '1234567890'})
        .expect(400)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    // it should get/send json
  });

  // describe('Quiz', function () {

  //   it("should UPDATE a given quiz", function (done) {
  //     request(app)
  //       .put('/quiz/3')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ the analytics of a given quiz");
  //   it("should READ the questions of a given quiz");
  //   it("should ADD a question to a given quiz");
  //   it("should CREATE a new quiz record");
  // });

  // describe('Question', function () {
  //   it("should CREATE a new question", function (done) {
  //     request(app)
  //       .post('/question')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ a given question", function (done) {
  //     request(app)
  //       .get('/question/4')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should UPDATE a given question", function (done) {
  //     request(app)
  //       .put('/question/4')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should DESTROY a given question", function (done) {
  //     request(app)
  //       .delete('/question/4')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ responses for a given question");
  // });

  // describe('Response', function () {
  //   it("should CREATE a new response", function (done) {
  //     request(app)
  //       .post('/response')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ a given response", function (done) {
  //     request(app)
  //       .get('/response/5')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should UPDATE a given response", function (done) {
  //     request(app)
  //       .put('/response/5')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should DESTROY a given response", function (done) {
  //     request(app)
  //       .delete('/response/5')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  // });

});

describe("View Controller:", function () {

  before(function (done) {
    async.series([
      function (callback) {
        knex.migrate.rollback()
        .then(function () {
          knex.migrate.latest()
          .then(function () {
            return knex.seed.run()
            .then(function () {
              callback();
            });
          });
        });
      },
      function (callback) {
        student
          .post('/api/auth/login')
          .send({email: 'adam@gmail.com', passwd: 'password123' })
          .expect(200)
          .end(function (err, res) {
            if (err) return callback(err);
            // expect(res.headers['location']).to.equal('/account');
            console.log("   student logged in");
            callback();
          });
      },
      function (callback) {
        teacher
          .post('/api/auth/login')
          .send({email: 'diana@gmail.com', passwd: 'wordpass123' })
          .expect(200)
          .end(function (err, res) {
            if (err) return callback(err);
            // expect(res.headers['location']).to.equal('/account');
            console.log("   teacher logged in");
            callback();
          });
      },
      function (callback) {
        admin
          .post('/api/auth/login')
          .send({email: 'elizabeth@gmail.com', passwd: 'admin' })
          .expect(200)
          .end(function (err, res) {
            if (err) return callback(err);
            // expect(res.headers['location']).to.equal('/account');
            console.log("   admin logged in");
            callback();
          });
      }],
      function (err, results) {
        if (err) console.log(err);
        done();
    });
  });

  after(function (done) {
    async.series([
      function (callback) {
        student
          .post('/api/auth/logout')
          .expect(303)
          .end(function (err, res) {
            if (err) return callback(err);
            console.log("   student logged out");
            callback();
          });
      },
      function (callback) {
        teacher
          .post('/api/auth/logout')
          .expect(303)
          .end(function (err, res) {
            if (err) return callback(err);
            console.log("   teacher logged out");
            callback();
          });
      },
      function (callback) {
        admin
          .post('/api/auth/logout')
          .expect(303)
          .end(function (err, res) {
            if (err) return callback(err);
            console.log("   admin logged out");
            callback();
          });
      }],
      function (err, results) {
        if (err) console.log(err);
        done();
    });
  });

  describe("Error Pages", function () {
    it("should send 404 if page does not exist", function (done) {
      request(app)
        .get('/doesNotExist')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("Index Page", function () {
    it("[GET /] should send 200 for anyone", function (done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /] should send 200 for students", function (done) {
      student
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    })
    it("[GET /] should send 200 for teachers", function (done) {
      teacher
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /] should send 200 for admins", function (done) {
      admin
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("Demo Page", function () {
    it("[GET /demos] should issue 200 for anyone", function (done) {
      request(app)
        .get('/demos')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /demos] should issue 200 for students", function (done) {
      student
        .get('/demos')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /demos] should issue 200 for teachers", function (done) {
      teacher
        .get('/demos')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /demos] should send 200 for admins", function (done) {
      admin
        .get('/demos')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("Signup Page", function () {
    it("[GET /signup] should issue 200 for anyone", function (done) {
      request(app)
        .get('/signup')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    })
    it("[GET /signup] should issue 303 redirect to /account for students", function (done) {
      student
        .get('/signup')
        .expect(303)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.header['location']).equals('/account');
          done();
        });
    })
    it("[GET /signup] should issue 303 redirect to /account for teacers", function (done) {
      teacher
        .get('/signup')
        .expect(303)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.header['location']).equals('/account');
          done();
        });
    });
  });

  describe("Login Page", function () {
    it("[GET /login] should issue 200 for anyone", function (done) {
      request(app)
        .get('/login')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /login] should issue 303 redirect to /account for students", function (done) {
      student
        .get('/login')
        .expect(303)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.headers['location']).to.equal('/account');
          done();
        });
    });
    it("[GET /login] should issue 303 redirect to /account for teachers", function (done) {
      teacher
        .get('/login')
        .expect(303)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.headers['location']).to.equal('/account');
          done();
        });
    });
  });

  describe("Account Dashboard/Page", function () {
    // TODO: It should differentiate between student, teacher, admin, etc.
    it("[GET /account] should issue 403 forbidden for anyone", function (done) {
      request(app)
        .get('/account')
        .expect(403)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /account] should issue 200 for students", function (done) {
      student
        .get('/account')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /account] should issue 200 for teachers", function (done) {
      teacher
        .get('/account')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /account] should send 200 for admins", function (done) {
      admin
        .get('/account')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("Course Dashboard/Page", function () {
    it("[GET /course/:id] should issue 403 forbidden for anyone", function (done) {
      request(app)
        .get('/course/1')
        .expect(403)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /course/:id] should issue 200 for students", function (done) {
      student
        .get('/course/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /course/:id] should issue 200 for teachers", function (done) {
      teacher
        .get('/course/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /course/:id] should send 200 for admins", function (done) {
      admin
        .get('/course/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("Quiz Page", function () {
    it("[GET /quiz/:id] should issue 403 forbidden for anyone", function (done) {
      request(app)
        .get('/quiz/1')
        .expect(403)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /quiz/:id] should issue 200 for students", function (done) {
      student
        .get('/quiz/1')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /quiz/:id] should issue 200 for teachers", function (done) {
      teacher
        .get('/quiz/1')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /quiz/:id] should send 200 for admins", function (done) {
      admin
        .get('/quiz/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("Scheduler Page", function () {
    it("[GET /scheduler] should issue 403 forbidden for anyone", function (done) {
      request(app)
        .get('/scheduler')
        .expect(403)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /scheduler] should issue 403 forbidden for students", function (done) {
      student
        .get('/scheduler')
        .expect(403)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /scheduler] should issue 200 for teachers", function (done) {
      teacher
        .get('/scheduler')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /scheduler] should send 200 for admins", function (done) {
      admin
        .get('/scheduler')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("Admin Page", function () {
    it("[GET /admin] should issue 403 forbidden for anyone", function (done) {
      request(app)
        .get('/admin')
        .expect(403)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /admin] should issue 403 forbidden for students", function (done) {
      student
        .get('/admin')
        .expect(403)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /admin] should issue 403 forbidden for teachers", function (done) {
      teacher
        .get('/admin')
        .expect(403)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /admin] should send 200 for admins", function (done) {
      admin
        .get('/admin')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
});
