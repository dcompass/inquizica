process.env.NODE_ENV = 'test';

var async = require('async');
var knex = require('../db/knex.js');
var expect = require("chai").expect;
var request = require('supertest');
var app = require('../app.js');
var student = request.agent(app);
var teacher = request.agent(app);

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
    setTimeout(done(), 1100);
  });

  describe('User', function () {
    it("[POST /user] should issue 303 SEE OTHER redirect on success", function (done) {
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
    it("[POST /user] should issue 400 BAD REQ on incomplete form data", function (done) {
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
    it('[GET /user/:id] should issue 200 OKAY with json for existing user', function (done) {
      request(app)
        .get('/api/user/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    })
    it('[GET /user/:id] should issue 404 NOT FOUND with json if user does not exist', function (done) {
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
    it('[DELETE /user/:id] should issue 200 OKAY for existing user', function (done) {
      request(app)
        .delete('/api/user/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[DELETE /user/:id] should issue 404 NOT FOUND if user does not exist', function (done) {
      request(app)
        .delete('/api/user/919191')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[GET /user/:id/progression] should issue 200 OKAY with json on success', function (done) {
      request(app)
        .get('/api/user/1/progression?course=1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an.array;
          expect(res.body).to.have.lengthOf(4);
          done();
        });
    });
    it('[GET /user/:id/progression] should issue 404 NOT FOUND with json if user/course does not exist ', function (done) {
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
    it('[PUT /user/:id/progression] should issue 200 OKAY when updated successfully', function (done) {
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
    it('[PUT /user/:id/progression] should issue 404 NOT FOUND if user does not exist', function (done) {
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
    it("[GET /user/:id/courses] should issue 200 OKAY with json when successful", function (done) {
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
    it("[GET /user/:id/courses] should issue 404 NOT FOUND with json when user does not exist", function (done) {
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
  });

  describe("Auth", function () {
    // TODO: SALT AND HASH PASSWORDS!!!!
    it('[GET /account] should issue 403 when user is not logged in', function (done) {
      student
        .get('/account')
        .expect(403)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[POST /login] should issue 302 redirect to /account when successful', function (done) {
      student
        .post('/api/auth/login')
        .send({email: 'seanjcrl@gmail.com', passwd: 'password123' })
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.headers['location']).to.equal('/account');
          done();
        });
    });
    it('[GET /account] should issue 200 when user is logged in', function (done) {
      student
        .get('/account')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it('[POST /logout] should issue 301 redirect to / when successfully logged out', function (done) {
      student
        .post('/api/auth/logout')
        .expect(301)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[GET /account] should issue 403 after user is logged out', function (done) {
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
    it('[POST /course] should issue 301 redirect on success', function (done) {
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
    it('[POST /course] should issue 400 bad request on incomplete form data', function (done) {
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
    it('[GET /course/:id] should issue 200 with json for exsiting course', function (done) {
      request(app)
        .get('/api/course/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it('[GET /course/:id] should issue 404 with json if course does not exist', function (done) {
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
    it('[DELETE /course/:id] should issue 200 OKAY for existing course', function (done) {
      request(app)
        .delete('/api/course/2')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[DELETE /course/:id] should issue 404 NOT FOUND for non-existant course', function (done) {
      request(app)
        .delete('/api/course/818181')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[GET /course/:id/quizzes] should issue 200 OKAY with json for existing course', function (done) {
      request(app)
        .get('/api/course/1/quizzes')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it('[GET /course/:id/quizzes] should issue 404 NOT FOUND with json for non-existant course', function (done) {
      request(app)
        .get('/api/course/818181/quizzes')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it('[GET /course/:id/schedule] should issue 200 OKAY with json for existing course', function (done) {
      request(app)
        .get('/api/course/1/schedule')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });
    it('[GET /course/:id/schedule] should issue 404 NOT FOUND with json for non-existant course', function (done) {
      request(app)
        .get('/api/course/818181/schedule')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    });

    // it('[GET /course/:id/topics] should issue 200 OKAY with json for existing course', function (done) {
    //   request(app)
    //     .get('/api/course/1/topics')
    //     .expect(200)
    //     .end(function (err, res) {
    //       if (err) return done(err);
    //       expect(res.body).to.be.json;
    //       done();
    //     });
    // });
    // it('[GET /course/:id/topics] should issue 404 NOT FOUND with json for non-existant course', function (done) {
    //   request(app)
    //     .get('/api/course/818181/topics')
    //     .expect(404)
    //     .end(function (err, res) {
    //       if (err) return done(err);
    //       expect(res.body).to.be.json;
    //       done();
    //     });
    // });
    //
    // it('[PUT /course/:id/user] should issue 200 OKAY for existing course', function (done) {
    //   request(app)
    //     .put('/api/course/1/user')
    //     .send({})
    //     .expect(200)
    //     .end(function (err, res) {
    //       if (err) return done(err);
    //       done();
    //     });
    // });
    // it('[PUT /course/:id/user] should issue 404 NOT FOUND for non-existant course', function (done) {
    //   request(app)
    //     .put('/api/course/1/user')
    //     .send({})
    //     .expect(404)
    //     .end(function (err, res) {
    //       if (err) return done(err);
    //       done();
    //     });
    // });
    //
    // it('[PUT /course/:id/quiz] should issue 200 OKAY for existing course', function (done) {
    //   request(app)
    //     .put('/api/course/1/quiz')
    //     .send({})
    //     .expect(200)
    //     .end(function (err, res) {
    //       if (err) return done(err);
    //       done();
    //     });
    // });
    // it('[PUT /course/:id/quiz] should issue 404 NOT FOUND for non-existant course', function (done) {
    //   request(app)
    //     .put('/api/course/919191/quiz')
    //     .send({})
    //     .expect(404)
    //     .end(function (err, res) {
    //       if (err) return done(err);
    //       done();
    //     });
    // });

  });


  // describe('Quiz', function () {
  //   it("should CREATE a new quiz", function (done) {
  //     request(app)
  //       .post('/quiz')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ a given quiz", function (done) {
  //     request(app)
  //       .get('/quiz/3')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should UPDATE a given quiz", function (done) {
  //     request(app)
  //       .put('/quiz/3')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should DESTROY a given quiz", function (done) {
  //     request(app)
  //       .delete('/quiz/3')
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
        student
          .post('/api/auth/login')
          .send({email: 'seanjcrl@gmail.com', passwd: 'password123' })
          .expect(302)
          .end(function (err, res) {
            if (err) return callback(err);
            expect(res.headers['location']).to.equal('/account');
            console.log("   student logged in");
            callback();
          });
      },
      function (callback) {
        teacher
          .post('/api/auth/login')
          .send({email: 'sean@gmail.com', passwd: 'wordpass123' })
          .expect(302)
          .end(function (err, res) {
            if (err) return callback(err);
            expect(res.headers['location']).to.equal('/account');
            console.log("   teacher logged in");
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
          .expect(301)
          .end(function (err, res) {
            if (err) return callback(err);
            console.log("   student logged out");
            callback();
          });
      },
      function (callback) {
        teacher
          .post('/api/auth/logout')
          .expect(301)
          .end(function (err, res) {
            if (err) return callback(err);
            console.log("   teacher logged out");
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
    it("[GET /signup] should issue 301 redirect to /account for students", function (done) {
      student
        .get('/signup')
        .expect(301)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.header['location']).equals('/account');
          done();
        });
    })
    it("[GET /signup] should issue 301 redirect to /account for teacers", function (done) {
      teacher
        .get('/signup')
        .expect(301)
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
    it("[GET /login] should issue 301 redirect to /account for students", function (done) {
      student
        .get('/login')
        .expect(301)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.headers['location']).to.equal('/account');
          done();
        });
    });
    it("[GET /login] should issue 301 redirect to /account for teachers", function (done) {
      teacher
        .get('/login')
        .expect(301)
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
  });
});
